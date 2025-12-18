import Link from "next/link";
import { ImageComponent } from "./image-component";

interface LogoProps {
	asLink?: boolean;
	className?: string;
}

const Logo = ({ asLink = true, className = "shrink-0" }: LogoProps) => {
	const image = (
		<ImageComponent
			src="/storage/synos-logo-beige-glow.svg"
			alt="Synos Medical"
			width={0}
			height={0}
			sizes="100vw"
			className="h-8 w-20 sm:h-10 sm:w-[120px] p-3 py-2 rounded"
		/>
	);

	if (!asLink) {
		return <div className={className}>{image}</div>;
	}

	return (
		<Link href="/" className={className}>
			{image}
		</Link>
	);
};

export default Logo;
