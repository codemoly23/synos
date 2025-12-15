import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
