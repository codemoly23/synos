import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			// Redirect /blogg to /nyheter
			{
				source: "/blogg",
				destination: "/nyheter",
				permanent: true,
			},
			// Redirect /blogg/[slug] to /nyheter/[slug]
			{
				source: "/blogg/:slug",
				destination: "/nyheter/:slug",
				permanent: true,
			},
			// Redirect /blogg/category/[slug] to /nyheter/category/[slug]
			{
				source: "/blogg/category/:slug",
				destination: "/nyheter/category/:slug",
				permanent: true,
			},
			// Redirect /blogg/tag/[slug] to /nyheter/tag/[slug]
			{
				source: "/blogg/tag/:slug",
				destination: "/nyheter/tag/:slug",
				permanent: true,
			},
			// Redirect /blogg/author/[slug] to /nyheter/author/[slug]
			{
				source: "/blogg/author/:slug",
				destination: "/nyheter/author/:slug",
				permanent: true,
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "plus.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "www.synos.se",
			},
			{
				protocol: "https",
				hostname: "images.pexels.com",
			},
			{
				protocol: "https",
				hostname: "img.youtube.com",
			},
			{
				protocol: "https",
				hostname: "i.ytimg.com",
			},
		],
		// Allow query strings for local images (needed for cache-busting avatars)
		// Omitting 'search' property allows any query string (e.g., ?t=timestamp)
		localPatterns: [
			{
				pathname: "/api/storage/files/**",
			},
			{
				pathname: "/storage/**",
			},
			{
				pathname: "/images/**",
			},
			{
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
