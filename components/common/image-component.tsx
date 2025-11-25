"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageProps, default as NextImage } from "next/image";
import React, { JSX, useState } from "react";

type IProps = Omit<ImageProps, "src"> & {
	src: string | undefined | null; //| StaticImport | null
	fallback?: string;
	debug?: string;
	showLoader?: boolean;
	wrapperClasses?: ImageProps["className"];
};

const ImageComponent = ({
	src,
	alt,
	showLoader = true,
	wrapperClasses = "",
	...props
}: IProps): JSX.Element => {
	const [loading, setLoading] = useState(true);
	const [onErrorSrc, setOnErrorSrc] = useState<string | undefined>(undefined);

	const handleOnError = (
		e: React.SyntheticEvent<HTMLImageElement, Event>
	): void => {
		if (e?.currentTarget?.src !== props.fallback)
			setOnErrorSrc("/placeholder.jpeg");

		setLoading(false);
	};

	return (
		<div className={`relative ${wrapperClasses}`}>
			{showLoader && loading && (
				<Skeleton
					className={`absolute bottom-0 left-0 h-full w-full animate-bounce-down rounded-none! motion-safe:animate-bounce-down`}
				/>
			)}
			<NextImage
				{...props}
				src={(onErrorSrc || src || props.fallback) ?? "/placeholder.jpeg"}
				onLoad={() => setLoading(false)}
				onError={handleOnError}
				width={props.width}
				height={props.height}
				alt={alt || "img"}
			/>
		</div>
	);
};

export { ImageComponent };
