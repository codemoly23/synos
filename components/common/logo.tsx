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
