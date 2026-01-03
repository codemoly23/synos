import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { careersPageService } from "@/lib/services/careers-page.service";
import { JobDetail } from "./_components/job-detail";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

interface JobDetailPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: JobDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const job = await careersPageService.getJobBySlug(slug);

	if (!job) {
		return {
			title: "Job Not Found | Synos Medical",
		};
	}

	return {
		title: `${job.title} | Lediga Tjänster | Synos Medical`,
		description:
			job.shortDescription ||
			`Ansök till tjänsten ${job.title} hos Synos Medical. ${job.location ? `Plats: ${job.location}.` : ""} ${job.employmentType || ""}`,
		openGraph: {
			title: `${job.title} | Karriär hos Synos Medical`,
			description:
				job.shortDescription ||
				`Ansök till tjänsten ${job.title} hos Synos Medical.`,
			...(job.featuredImage && { images: [job.featuredImage] }),
		},
	};
}

export async function generateStaticParams() {
	const jobs = await careersPageService.getActiveJobs();

	return jobs
		.filter((job) => job.slug)
		.map((job) => ({
			slug: job.slug!,
		}));
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
	const { slug } = await params;
	const [job, pageData] = await Promise.all([
		careersPageService.getJobBySlug(slug),
		careersPageService.getPublicCareersPage(),
	]);

	if (!job) {
		notFound();
	}

	return (
		<JobDetail
			job={job}
			contactSidebar={pageData.contactSidebar}
			expertCta={pageData.expertCta}
		/>
	);
}
