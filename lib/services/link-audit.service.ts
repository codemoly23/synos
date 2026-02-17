import {
	linkAuditRepository,
	type LinkAuditData,
	type PaginatedLinkAudits,
} from "@/lib/repositories/link-audit.repository";
import { extractAllLinks } from "./link-extractor.service";
import { checkLinks } from "./link-checker.service";

class LinkAuditService {
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

		// Run scan (this runs async but we don't await it in the API handler)
		this.runScan(auditId, type, startTime, onProgress).catch(async (err) => {
			console.error("Link audit failed:", err);
			await linkAuditRepository.fail(auditId, err.message || "Unknown error");
		});

		return audit;
	}

	/**
	 * Internal: Run the actual scan
	 */
	private async runScan(
		auditId: string,
		type: "full" | "internal" | "external",
		startTime: number,
		onProgress?: (checked: number, total: number) => void
	): Promise<void> {
		// Step 1: Extract all links from content
		let allLinks = await extractAllLinks();

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

		// Step 2: Check all links
		const auditedLinks = await checkLinks(allLinks, (checked, total) => {
			// Update progress periodically (every 5 checks)
			if (checked % 5 === 0 || checked === total) {
				linkAuditRepository.updateProgress(auditId, {
					checkedLinks: checked,
				});
			}
			onProgress?.(checked, total);
		});

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
