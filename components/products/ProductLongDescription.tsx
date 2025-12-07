"use client";

import { motion } from "framer-motion";

interface ProductLongDescriptionProps {
	description: string;
}

export function ProductLongDescription({
	description,
}: ProductLongDescriptionProps) {
	console.log("description => ", description);
	return (
		<motion.section
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="mb-16"
			id="about"
		>
			<div className="p-8 md:p-10 rounded-2xl bg-card/80 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-colors duration-300">
				<motion.h2
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.1, delay: 0.1 }}
					className="text-3xl font-bold text-secondary mb-6"
				>
					Om Produkten
				</motion.h2>
				<div className="prose prose-lg max-w-none">
					<div className="text-muted-foreground leading-relaxed space-y-4">
						{/* {description.split("\n\n").map((paragraph, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
								className="text-base md:text-lg"
							>
								<div dangerouslySetInnerHTML={{ __html: paragraph }} />
							</motion.div>
						))} */}
						<div dangerouslySetInnerHTML={{ __html: description }} />
					</div>
				</div>
			</div>
		</motion.section>
	);
}
