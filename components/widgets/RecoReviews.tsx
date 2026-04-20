import type { IReviewsSettings } from "@/models/site-settings.model";

interface RecoReviewsProps {
	data: IReviewsSettings;
}

export function RecoReviews({ data }: RecoReviewsProps) {
	if (!data?.recoWidgetUrl) return null;

	return (
		<section className="section-padding bg-secondary text-white">
			<div className="_container">
				{(data.title || data.subtitle) && (
					<div className="mb-8 text-center">
						{data.title && (
							<h2 className="text-3xl md:text-4xl font-bold mb-3">
								{data.title}
							</h2>
						)}
						{data.subtitle && (
							<p className="text-slate-100/80 text-lg">{data.subtitle}</p>
						)}
					</div>
				)}

				<iframe
					src={data.recoWidgetUrl}
					title="Omdömen på Reco"
					height={225}
					loading="lazy"
					style={{
						width: "100%",
						border: 0,
						display: "block",
						overflow: "hidden",
					}}
				/>
			</div>
		</section>
	);
}
