interface ProductPageProps {
	params: {
		slug: string;
	};
}

export default function ProductPage({ params }: ProductPageProps) {
	// TODO: Fetch product data based on slug
	return (
		<div className="min-h-screen py-20">
			<div className="section-container">
				<h1 className="text-4xl font-bold text-foreground mb-4">
					Product: {params.slug}
				</h1>
				<p className="text-muted-foreground">
					Product details page - to be implemented
				</p>
			</div>
		</div>
	);
}

export async function generateStaticParams() {
	// TODO: Return list of product slugs
	return [
		{ slug: "motus-pro" },
		{ slug: "toro-pico-laser" },
		{ slug: "tetra-pro-co2-laser" },
	];
}
