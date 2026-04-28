import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	turbopack: {
		root: __dirname,
	},
	webpack: (config, { isServer }) => {
		config.watchOptions = {
			...config.watchOptions,
			ignored: ["**/nul", "**/node_modules/**", "**/.git/**", "**/.next/**"],
		};
		return config;
	},
	async redirects() {
		return [
			{
				source: "/kategori",
				destination: "/klinikutrustning",
				permanent: true,
			},
			{
				source: "/kategori/:category",
				destination: "/klinikutrustning/:category",
				permanent: true,
			},
			{
				source: "/kategori/:category/:slug",
				destination: "/klinikutrustning/:category/:slug",
				permanent: true,
			},
			{
				source: "/blogg",
				destination: "/nyheter",
				permanent: true,
			},
			{
				source: "/blogg/:slug",
				destination: "/nyheter/:slug",
				permanent: true,
			},
			{
				source: "/blogg/category/:slug",
				destination: "/nyheter/category/:slug",
				permanent: true,
			},
			{
				source: "/blogg/tag/:slug",
				destination: "/nyheter/tag/:slug",
				permanent: true,
			},
			{
				source: "/blogg/author/:slug",
				destination: "/nyheter/author/:slug",
				permanent: true,
			},
			{
				source: "/om-oss/varfor-valja-synos",
				destination: "/starta-eget/varfor-valja-synos",
				permanent: true,
			},
			{
				source: "/kopguide",
				destination: "/starta-eget/kopguide",
				permanent: true,
			},
			{
				source: "/utbildningar/miniutbildning-online",
				destination: "/starta-eget/miniutbildning",
				permanent: true,
			},
			{
				source: "/om-oss/jobba-hos-oss",
				destination: "/om-oss/lediga-tjanster",
				permanent: true,
			},
			{
				source: "/om-oss/integritetspolicy",
				destination: "/integritetspolicy",
				permanent: true,
			},
			{
				source: "/villkor",
				destination: "/faq",
				permanent: false,
			},
			{
				source: "/blogg/",
				destination: "/nyheter",
				permanent: true,
			},
			{
				source: "/kopguide/",
				destination: "/starta-eget/kopguide",
				permanent: true,
			},
			{
				source: "/utbildningar/miniutbildning-online/",
				destination: "/starta-eget/miniutbildning",
				permanent: true,
			},
			{
				source: "/om-oss/varfor-valja-synos/",
				destination: "/starta-eget/varfor-valja-synos",
				permanent: true,
			},
			{
				source: "/om-oss/jobba-hos-oss/",
				destination: "/om-oss/lediga-tjanster",
				permanent: true,
			},
			{
				source: "/om-oss/integritetspolicy/",
				destination: "/integritetspolicy",
				permanent: true,
			},
		];
	},
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "images.unsplash.com" },
			{ protocol: "https", hostname: "plus.unsplash.com" },
			{ protocol: "https", hostname: "www.synos.se" },
			{ protocol: "https", hostname: "images.pexels.com" },
			{ protocol: "https", hostname: "img.youtube.com" },
			{ protocol: "https", hostname: "i.ytimg.com" },
		],
		localPatterns: [
			{ pathname: "/api/storage/files/**" },
			{ pathname: "/storage/**" },
			{ pathname: "/images/**" },
			{ pathname: "/**" },
		],
	},
};

export default nextConfig;
