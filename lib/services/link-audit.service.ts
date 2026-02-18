import {
	linkAuditRepository,
	type LinkAuditData,
	type PaginatedLinkAudits,
} from "@/lib/repositories/link-audit.repository";
import { extractAllLinks } from "./link-extractor.service";
import { checkLinks } from "./link-checker.service";

class LinkAuditService {
	// Track abort controllers for running audits
	private abortControllers = new Map<string, AbortController>();

	/**
	 * Start a new link audit scan
	 * Returns the audit ID immediately, runs the scan in the background
	 */
	async startAudit(
		type: "full" | "internal" | "external" = "full",
		onProgress?: (checked: number, total: number) => void
	): Promise<LinkAuditData> {
		// Check if there's already a running audit
		const isRunning = await linkAuditRepository.hasRunningAudit();
		if (isRunning) {
			throw new Error("An audit is already running");
		}

		// Create audit record
		const audit = await linkAuditRepository.create(type);
		const auditId = String(audit._id);
		const startTime = Date.now();

		// Create abort controller for this audit
		const abortController = new AbortController();
		this.abortControllers.set(auditId, abortController);

		// Run scan (this runs async but we don't await it in the API handler)
		this.runScan(auditId, type, startTime, onProgress, abortController.signal)
			.catch(async (err) => {
				if (abortController.signal.aborted) return; // Already handled by cancelAudit
				console.error("Link audit failed:", err);
				await linkAuditRepository.fail(auditId, err.message || "Unknown error");
			})
			.finally(() => {
				this.abortControllers.delete(auditId);
			});

		return audit;
	}

	/**
	 * Cancel a running audit
	 */
	async cancelAudit(auditId?: string): Promise<boolean> {
		if (auditId) {
			// Cancel specific audit
			const controller = this.abortControllers.get(auditId);
			if (controller) {
				controller.abort();
				this.abortControllers.delete(auditId);
				await linkAuditRepository.cancel(auditId);
				return true;
			}
			// Audit may be running but controller not found (e.g. server restarted)
			// Still try to mark it as cancelled in DB
			const audit = await linkAuditRepository.getById(auditId);
			if (audit && audit.status === "running") {
				await linkAuditRepository.cancel(auditId);
				return true;
			}
			return false;
		}

		// Cancel any running audit
		const latest = await linkAuditRepository.getLatest();
		if (latest && latest.status === "running") {
			const id = String(latest._id);
			const controller = this.abortControllers.get(id);
			if (controller) {
				controller.abort();
				this.abortControllers.delete(id);
			}
			await linkAuditRepository.cancel(id);
			return true;
		}
		return false;
	}

	/**
	 * Internal: Run the actual scan
	 */
	private async runScan(
		auditId: string,
		type: "full" | "internal" | "external",
		startTime: number,
		onProgress?: (checked: number, total: number) => void,
		signal?: AbortSignal
	): Promise<void> {
		// Step 1: Extract all links from content
		let allLinks = await extractAllLinks();

		if (signal?.aborted) return;

		// Filter by type
		if (type === "internal") {
			allLinks = allLinks.filter((l) => !l.isExternal);
		} else if (type === "external") {
			allLinks = allLinks.filter((l) => l.isExternal);
		}

		// Update total count
		await linkAuditRepository.updateProgress(auditId, {
			totalLinks: allLinks.length,
		});

		if (signal?.aborted) return;

		// Step 2: Check all links
		const auditedLinks = await checkLinks(allLinks, (checked, total) => {
			// Update progress periodically (every 5 checks)
			if (checked % 5 === 0 || checked === total) {
				linkAuditRepository.updateProgress(auditId, {
					checkedLinks: checked,
				});
			}
			onProgress?.(checked, total);
		}, signal);

		if (signal?.aborted) return;

		// Step 3: Calculate stats
		const stats = {
			totalLinks: allLinks.length,
			checkedLinks: auditedLinks.length,
			brokenLinks: auditedLinks.filter((l) => l.status === "broken").length,
			redirectLinks: auditedLinks.filter((l) => l.status === "redirect").length,
			mixedContentLinks: auditedLinks.filter((l) => l.status === "mixed-content").length,
			externalBrokenLinks: auditedLinks.filter((l) => l.isExternal && l.status === "broken").length,
			okLinks: auditedLinks.filter((l) => l.status === "ok").length,
			timeoutLinks: auditedLinks.filter((l) => l.status === "timeout").length,
			duration: Date.now() - startTime,
		};

		// Step 4: Save results
		await linkAuditRepository.complete(auditId, auditedLinks, stats);
	}

	/**
	 * Get latest audit report
	 */
	async getLatestAudit(): Promise<LinkAuditData | null> {
		return linkAuditRepository.getLatest();
	}

	/**
	 * Get audit by ID
	 */
	async getAuditById(id: string): Promise<LinkAuditData | null> {
		return linkAuditRepository.getById(id);
	}

	/**
	 * Get audit history (paginated, no links)
	 */
	async getAuditHistory(page: number, limit: number): Promise<PaginatedLinkAudits> {
		return linkAuditRepository.findPaginated(page, limit);
	}

	/**
	 * Delete an audit
	 */
	async deleteAudit(id: string): Promise<void> {
		return linkAuditRepository.deleteById(id);
	}

	/**
	 * Check if an audit is running
	 */
	async isRunning(): Promise<boolean> {
		return linkAuditRepository.hasRunningAudit();
	}
}

export const linkAuditService = new LinkAuditService();
