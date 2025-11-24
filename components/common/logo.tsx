import Image from "next/image";
import Link from "next/link";

const Logo = () => {
	return (
		<Link href="/" className="shrink-0">
			<Image
				src="https://www.synos.se/wp-content/themes/synos/assets/design/assets/images/logotype.svg"
				alt="Synos Medical"
				width={0}
				height={0}
				sizes="100vw"
				className="bg-accent h-8 w-[80px] sm:h-10 sm:w-[120px] p-3 py-2 rounded"
			/>
		</Link>
	);
};

export default Logo;
