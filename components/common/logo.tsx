import Link from "next/link";
import { ImageComponent } from "./image-component";

const DEFAULT_LOGO_URL = "/storage/synos-logo-beige-glow.svg";

interface LogoProps {
	asLink?: boolean;
	className?: string;
	logoUrl?: string;
}

const Logo = ({
	asLink = true,
	className = "shrink-0",
	logoUrl = DEFAULT_LOGO_URL,
}: LogoProps) => {
	const image = (
		<ImageComponent
			src={logoUrl || DEFAULT_LOGO_URL}
			alt="Synos Medical"
			width={0}
			height={0}
			sizes="100vw"
			className="h-12 w-32 sm:h-14 sm:w-40 lg:h-14 lg:w-40 p-2 py-1.5 rounded"
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
