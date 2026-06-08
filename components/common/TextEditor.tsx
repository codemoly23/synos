"use client";

import React, { useEffect, useRef, useCallback } from "react";
import SunEditor from "suneditor-react";
import SunEditorCore from "suneditor/src/lib/core";
import katex from "katex";
import "suneditor/dist/css/suneditor.min.css";
import "katex/dist/katex.min.css";

import { SunEditorReactProps } from "suneditor-react/dist/types/SunEditorReactProps";

const commonButtons = [
	"bold",
	"underline",
	"italic",
	"strike",
	"subscript",
	"superscript",
	"removeFormat",
	"font",
	"textStyle",
	"fontColor",
	"hiliteColor",
];

const buttonListVariants = {
	simple: [[...commonButtons, "link"]],
	detailedSimple: [
		[...commonButtons, "align", "list", "link", "image", "table"],
	],
	detailedSimpleMinimal: [[...commonButtons, "align", "list"]], // for invoice footer with dangeriouslySetInnerHTML
	detailedAdvance: [
		[
			...commonButtons,
			"align",
			"list",
			"link",
			"image",
			"video",
			"table",
			"math",
			"codeView",
		],
	],
	advanceMinimal: [
		[
			...commonButtons,
			"align",
			"list",
			"link",
			"image",
			"video",
			"math",
			"codeView",
		],
	],
	advanceFull: [
		[...commonButtons, "undo", "redo"],
		["fontSize", "formatBlock"],
		["align", "horizontalRule", "list", "lineHeight"],
		["table", "link", "image", "video"],
		[
			"math",
			"codeView",
			"preview",
			"print",
			"save",
			"template",
			"fullScreen",
			"showBlocks",
		],
	],
};

interface TextEditorProps
	extends Pick<
		SunEditorReactProps,
		| "placeholder"
		| "height"
		| "width"
		| "onChange"
		| "autoFocus"
		| "disable"
		| "defaultValue"
		| "name"
	> {
	variant?: keyof typeof buttonListVariants;
}

const templatesList = [
	{
		name: "Simple Template",
		html: `<p>Hello! Start typing your content here...</p>`,
	},
	{
		name: "Advanced Product Template (EN)",
		html: `<h3 style="text-align: center"><span style="font-size: 26px"><strong>Product Description</strong></span></h3>
<table><thead><tr><th><div>Attribute</div></th><th><div>Details</div></th></tr></thead><tbody><tr><td><div>Ports</div></td><td><div>USB-C PD ×2, USB-A ×1</div></td></tr><tr><td><div>Max Power Output</div></td><td><div>65W (USB-C)</div></td></tr><tr><td><div>GaN Tech</div></td><td><div>Yes (3rd Gen)</div></td></tr><tr><td><div>Safety Protocols</div></td><td><div>Overheat, Overvoltage, Surge</div></td></tr><tr><td><div>Weight</div></td><td><div>130g</div></td></tr><tr><td><div>Plug Type</div></td><td><div>US Foldable</div></td></tr></tbody></table>
<p>Delightfully charming and thoughtfully crafted, the <strong>Blossom Baby Girl Soft Sole Shoes</strong> are the perfect blend of comfort, cuteness, and practicality for your little one’s first steps...</p>
<h3><strong>Key Benefits</strong></h3>
<ul><li><p>🌸 <strong>Adorable Design</strong>: Bright floral detail adds playful charm</p></li><li><p>👶 <strong>Baby-Friendly Materials</strong>: Soft, breathable fabric</p></li><li><p>🦶 <strong>Flexible Soles</strong>: Encourages healthy foot development</p></li><li><p>💡 <strong>Easy to Wear</strong>: Hook-and-loop closure</p></li><li><p>🧼 <strong>Low Maintenance</strong>: Spot-clean friendly</p></li></ul>
<hr><h3><strong>Care Instructions</strong></h3>
<ul><li><p>Spot clean with a damp cloth</p></li><li><p>Air dry naturally</p></li><li><p>Do not bleach or iron</p></li></ul>
<h3><strong>Ideal For</strong></h3>
<ul><li><p>Everyday casual wear</p></li><li><p>Baby photoshoots</p></li><li><p>Baby shower gifts</p></li></ul>
<div class="se-component se-image-container __se__float-left"><figure style="width: 300px"><img src="https://images.pexels.com/photos/2587370/pexels-photo-2587370.jpeg" alt="Baby Shoe 1" style="width: 300px; height: 360px;"></figure></div>
<div class="se-component se-image-container __se__float-left"><figure style="width: 300px"><img src="https://images.pexels.com/photos/27525334/pexels-photo-27525334/free-photo-of-a-person-holding-a-bottle-of-lipstick.jpeg" alt="Baby Shoe 2" style="width: 300px; height: 360px;"></figure></div>`,
	},
	{
		name: "পণ্যের বিস্তারিত টেমপ্লেট (Bangla)",
		html: `<h3 style="text-align: center"><span style="font-size: 26px"><strong>পণ্যের বিবরণ</strong></span></h3>
<table><thead><tr><th>বৈশিষ্ট্য</th><th>বিবরণ</th></tr></thead><tbody><tr><td>পোর্ট</td><td>USB-C PD ×2, USB-A ×1</td></tr><tr><td>সর্বোচ্চ পাওয়ার আউটপুট</td><td>65W (USB-C)</td></tr><tr><td>GaN প্রযুক্তি</td><td>হ্যাঁ (3য় প্রজন্ম)</td></tr><tr><td>নিরাপত্তা ব্যবস্থা</td><td>ওভারহিট, ওভারভোল্টেজ, সার্জ</td></tr><tr><td>ওজন</td><td>130 গ্রাম</td></tr><tr><td>প্লাগ টাইপ</td><td>ফোল্ডেবল ইউএস</td></tr></tbody></table>
<p><strong>Blossom Baby Girl Soft Sole Shoes</strong> একটি নরম, আরামদায়ক এবং স্টাইলিশ শিশুদের জুতা যা হাঁটার শুরুর সময় সঠিক সমর্থন প্রদান করে।</p>
<h3><strong>মূল বৈশিষ্ট্য</strong></h3>
<ul><li>আকর্ষণীয় ফ্লোরাল ডিজাইন</li><li>নরম ও শিশুবান্ধব কাপড়</li><li>সুস্থ পায়ের বিকাশে সহায়ক</li><li>ভেলক্রো স্ট্র্যাপ দিয়ে সহজে পরিধানযোগ্য</li><li>সহজ পরিষ্কারযোগ্য</li></ul>
<h3><strong>পরিচর্যার নির্দেশিকা</strong></h3>
<ul><li>ভেজা কাপড় দিয়ে স্পট ক্লিন করুন</li><li>প্রাকৃতিকভাবে শুকান</li><li>ব্লিচ বা আয়রন করবেন না</li></ul>
<h3><strong>উপযুক্ত ব্যবহার</strong></h3>
<ul><li>দৈনন্দিন ব্যবহার</li><li>ছবির সেশন</li><li>নবজাতকের উপহার</li></ul>
<div class="se-component se-image-container __se__float-left"><figure style="width: 300px"><img src="https://images.pexels.com/photos/27462658/pexels-photo-27462658.jpeg" alt="শিশুদের জুতা" style="width: 300px; height: 360px;"></figure></div>
<div class="se-component se-image-container __se__float-left"><figure style="width: 376px;"><img src="https://images.pexels.com/photos/6527701/pexels-photo-6527701.jpeg" alt="শিশুদের জুতা" style="width: 376px; height: 360px;"></figure></div>`,
	},
	{
		name: "Blog Template (EN)",
		html: `<h1 style="text-align: center"><strong>How We Crafted Our Baby Shoes</strong></h1>
<p>Designing for babies isn't just about cuteness — it's about comfort, support, and safety. Our journey began with research and a clear vision...</p>
<h3><strong>🔍 The Inspiration</strong></h3>
<p>Nature, clouds, sunshine, and joy — these elements inspired our color palette and material choice.</p>
<h3><strong>🧵 Materials Used</strong></h3>
<ul><li>Organic Cotton Fabric</li><li>Natural Rubber Sole</li><li>Non-toxic Dyes</li></ul>
<h3><strong>📷 Gallery</strong></h3>
<div><img src="https://images.pexels.com/photos/3771645/pexels-photo-3771645.jpeg" alt="Design Session" style="width: 100%; max-width: 600px; height: auto;" /></div>
<p>Our design team worked closely with parents to ensure the perfect fit for every baby’s needs.</p>`,
	},
	{
		name: "ব্লগ টেমপ্লেট (Bangla)",
		html: `<h1 style="text-align: center"><strong>আমাদের শিশুদের জুতার নকশার পেছনের গল্প</strong></h1>
<p>শিশুদের জন্য পণ্য তৈরি করার সময় আমরা প্রথমেই লক্ষ্য রাখি নিরাপত্তা ও আরামের দিকে। এরপর আসে ডিজাইন।</p>
<h3><strong>🎨 অনুপ্রেরণা</strong></h3>
<p>আমরা রঙ হিসেবে বেছে নিয়েছি আকাশের নীল, সূর্যের হলুদ এবং সবুজ পাতার প্রাণবন্ততা।</p>
<h3><strong>🧵 উপাদান</strong></h3>
<ul><li>জৈব তুলা</li><li>প্রাকৃতিক রাবার সোল</li><li>নন-টক্সিক ডাই</li></ul>
<h3><strong>📸 ছবি</strong></h3>
<div><img src="https://images.pexels.com/photos/754953/pexels-photo-754953.jpeg" alt="ডিজাইন টিম কাজ করছে" style="width: 100%; max-width: 600px; height: auto;" /></div>
<p>অভিভাবকদের সাথে আলোচনার পর আমরা সর্বোত্তম মান নিশ্চিত করেছি।</p>`,
	},
];

const TextEditor: React.FC<TextEditorProps> = ({
	disable = false,
	onChange,
	defaultValue,
	width = "100%",
	height = "auto",
	autoFocus = false,
	name = "my-editor",
	placeholder = "Please type here...",
	variant = "simple",
}) => {
	const editor = useRef<SunEditorCore | null>(null);
	const [uploadedImages, setUploadedImages] = React.useState<string[]>([]);
	const [content, setContent] = React.useState(defaultValue || "");
	const contentRef = useRef(defaultValue || "");

	const getSunEditorInstance = (sunEditor: SunEditorCore) => {
		editor.current = sunEditor;
	};

	// Restore editor content on visibility change (tab switch)
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible" && editor.current) {
				// Restore content from ref when tab becomes visible
				const currentEditorContent = editor.current.getContents(true);
				if (currentEditorContent !== contentRef.current && contentRef.current) {
					editor.current.setContents(contentRef.current);
				}
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	// Upload image to storage API
	const uploadImage = useCallback(
		async (file: File): Promise<string | null> => {
			try {
				const formData = new FormData();
				formData.append("file", file);
				formData.append("folder", "images");

				const response = await fetch("/api/storage/upload", {
					method: "POST",
					body: formData,
				});

				const data = await response.json();

				if (!response.ok || !data.success) {
					console.error("Image upload failed:", data.message);
					return null;
				}

				return data.data.url;
			} catch (error) {
				console.error("Image upload error:", error);
				return null;
			}
		},
		[]
	);

	// Delete image from storage API
	const deleteImage = useCallback(
		async (imageUrl: string): Promise<boolean> => {
			try {
				// Extract filename and folder from URL (e.g., /storage/images/uuid.jpg)
				const urlParts = imageUrl.split("/");
				const filename = urlParts[urlParts.length - 1];
				const folder = urlParts[urlParts.length - 2];

				if (!filename || !folder) return false;

				const response = await fetch("/api/storage/delete", {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ filename, folder }),
				});

				const data = await response.json();
				return response.ok && data.success;
			} catch (error) {
				console.error("Image deletion error:", error);
				return false;
			}
		},
		[]
	);

	const handleImageUploadBefore = (
		files: File[],
		_info: object,
		uploadHandler: (response: {
			result: { url: string; name: string }[];
			errorMessage?: string;
		}) => void
	): boolean => {
		(async () => {
			const file = files[0];
			const uploadedUrl = await uploadImage(file);

			if (uploadedUrl) {
				// Track uploaded image for potential deletion
				setUploadedImages((prev) => [...prev, uploadedUrl]);

				uploadHandler({
					result: [
						{
							url: uploadedUrl,
							name: file.name,
						},
					],
				});
			} else {
				uploadHandler({
					result: [],
					errorMessage: "Failed to upload image. Please try again.",
				});
			}
		})();
		return true;
	};

	const handleChange = (newContent: string) => {
		setContent(newContent);
		contentRef.current = newContent;
		if (onChange) {
			onChange(newContent);
		}
	};

	// Clean up deleted images when content changes
	useEffect(() => {
		if (!content || uploadedImages.length === 0) return;

		// Find images that were uploaded but no longer exist in content
		const imagesToDelete = uploadedImages.filter((imageUrl) => {
			// Skip base64 images
			if (imageUrl.includes("base64")) return false;
			// Check if image URL is still in content
			return !content.includes(imageUrl);
		});

		// Delete orphaned images
		imagesToDelete.forEach(async (imageUrl) => {
			const deleted = await deleteImage(imageUrl);
			if (deleted) {
				setUploadedImages((prev) => prev.filter((img) => img !== imageUrl));
			}
		});
	}, [content, uploadedImages, deleteImage]);

	return (
		<div className="sun-editor-wrapper">
			<SunEditor
				name={name}
				width={width}
				height={height}
				disable={disable}
				autoFocus={autoFocus}
				placeholder={placeholder}
				defaultValue={defaultValue}
				setAllPlugins
				getSunEditorInstance={getSunEditorInstance}
				onImageUploadBefore={handleImageUploadBefore}
				setOptions={{
					resizingBar: true,
					resizeEnable: true,
					imageResizing: true,
					katex,
					buttonList: buttonListVariants[variant],
					templates: templatesList,
					font: [
						"Montserrat",
						"Malgun Gothic",
					],
					addTagsWhitelist: "math",
				}}
				onChange={handleChange}
			/>
		</div>
	);
};

export default TextEditor;

export const PreviewEditor = ({ children }: { children: string }) => {
	return (
		<div className="sun-editor-preview sun-editor-editable bg-transparent!">
			<div dangerouslySetInnerHTML={{ __html: children }} />
		</div>
	);
};
