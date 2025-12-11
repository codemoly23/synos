"use client";

import React, { useEffect, useRef } from "react";
import SunEditor from "suneditor-react";
import SunEditorCore from "suneditor/src/lib/core";
import katex from "katex";
import "suneditor/dist/css/suneditor.min.css";
import "katex/dist/katex.min.css";

// import { convertImageToWebP } from '@/utils/image-utils';
// import { api } from "@/server/api";
import { SunEditorReactProps } from "suneditor-react/dist/types/SunEditorReactProps";
// import { fileDelete } from '@/server/api/fileUpload';

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

// const templatesList = [
//   {
//     name: 'Simple Template',
//     html: `<p>Hello! Start typing your content here...</p>`,
//   },
//   {
//     name: 'Advanced Template',
//     html: `
// <h3 style="text-align: center"><span style="font-size: 26px"><strong>Product Description</strong></span></h3><table><thead><tr><th><div>Attribute</div></th><th><div>Details</div></th></tr></thead><tbody><tr><td><div>Ports</div></td><td><div>USB-C PD ×2, USB-A ×1</div></td></tr><tr><td><div>Max Power Output</div></td><td><div>65W (USB-C)</div></td></tr><tr><td><div>GaN Tech</div></td><td><div>Yes (3rd Gen)</div></td></tr><tr><td><div>Safety Protocols</div></td><td><div>Overheat, Overvoltage, Surge</div></td></tr><tr><td><div>Weight</div></td><td><div>130g</div></td></tr><tr><td><div>Plug Type</div></td><td><div>US Foldable</div></td></tr></tbody></table><p>Delightfully charming and thoughtfully crafted, the  <strong>Blossom Baby Girl Soft Sole Shoes</strong> are the perfect blend of  comfort, cuteness, and practicality for your little one’s first steps.  Designed in a soft pastel <strong>sky blue</strong> fabric with a cheerful  <strong>sunshine yellow</strong> sole, these shoes are adorned with an  embroidered green leaf and a bright  <strong>orange 3D flower applique</strong>, adding a playful pop of color to  your baby's outfit.</p><p>Crafted from breathable cotton-blend fabric and lined with a soft, gentle  interior, these baby shoes ensure maximum comfort for delicate feet. The  flexible sole allows for natural foot movement, making them ideal for babies  who are crawling, cruising, or beginning to walk.</p><p>A convenient <strong>hook-and-loop Velcro strap</strong> makes putting them  on and taking them off quick and easy, while ensuring a secure fit that stays  in place even on the most wiggly little feet.</p><p>Whether you're dressing up for a family gathering or heading to the park,  these shoes offer an adorable finishing touch to any baby outfit — perfect for  everyday wear or gifting.</p><h3><strong>Key Benefits</strong></h3><ul><li><p>🌸 <strong>Adorable Design</strong>: Bright floral detail adds playful      charm to any baby outfit</p></li><li><p>👶 <strong>Baby-Friendly Materials</strong>: Soft, breathable fabric      perfect for sensitive baby skin</p></li><li><p>🦶 <strong>Flexible Soles</strong>: Encourages healthy foot development      for early walkers</p></li><li><p>💡 <strong>Easy to Wear</strong>: Hook-and-loop closure helps parents      dress their baby effortlessly</p></li><li><p>🧼 <strong>Low Maintenance</strong>: Spot-clean friendly, designed for      everyday use</p></li></ul><hr><h3><strong>Care Instructions</strong></h3><ul><li><p>Spot clean with a damp cloth and mild soap</p></li><li><p>Air dry naturally, avoid direct heat or machine drying</p></li><li><p>Do not bleach or iron</p></li></ul><hr><h3><strong>Ideal For</strong></h3><ul><li><p>Everyday casual wear</p></li><li><p>Baby photoshoots and special occasions</p></li><li><p>Baby shower or newborn gifts</p></li></ul><ul><li><p>First walkers and pre-walking stage babies</p></li></ul><p><br></p><div class="se-component se-image-container __se__float-left"><figure style="width: 300px"><img src="https://images.pexels.com/photos/2587370/pexels-photo-2587370.jpeg" alt="" data-rotate="" data-proportion="false" data-size="300px,360px" data-align="left" data-file-name="pexels-photo-2587370.jpeg" data-file-size="0" origin-size="3338,5000" data-origin="," style="            width: 300px;            height: 360px;            transform: rotate(0deg);          "></figure></div><div class="se-component se-image-container __se__float-left"><figure style="width: 300px"><img src="https://images.pexels.com/photos/27525334/pexels-photo-27525334/free-photo-of-a-person-holding-a-bottle-of-lipstick.jpeg" alt="Baby Shoes" data-rotate="" data-proportion="false" data-size="300px,360px" data-align="left" data-file-name="pexels-photo-20205711.jpeg" data-file-size="0" data-origin="," origin-size="3338,5000" style="        width: 300px;        height: 360px;        transform: rotate(0deg);      "></figure></div><div class="se-component se-image-container __se__float-left"><figure style="width: 300px"><img src="https://images.pexels.com/photos/27462658/pexels-photo-27462658.jpeg" alt="" data-rotate="" data-proportion="false" data-size="300px,360px" data-align="left" data-file-name="pexels-photo-2587370.jpeg" data-file-size="0" origin-size="3338,5000" data-origin="," style="        width: 300px;        height: 360px;        transform: rotate(0deg);      "></figure></div><div class="se-component se-image-container __se__float-left"><figure style="width: 376px;"><img src="https://images.pexels.com/photos/6527701/pexels-photo-6527701.jpeg" alt="" data-rotate="" data-proportion="false" data-size="376px,360px" data-align="left" data-file-name="pexels-photo-2587370.jpeg" data-file-size="0" origin-size="3338,5000" data-origin="," style="width: 376px; height: 360px; transform: rotate(0deg);"></figure></div><p><br></p><p><br></p><p><br></p><p></p><p></p><p></p><p></p>`,
//   },
// ];

// const templatesList = [
//   {
//     name: 'Simple Template',
//     html: `<p>Hello! Start typing your content here...</p>`,
//   },
//   {
//     name: 'Advanced Product Template',
//     html: `<!-- Your provided advanced template -->`,
//   },
//   {
//     name: 'Personal Introduction',
//     html: `
// <h2><strong>👋 About Me</strong></h2>
// <p>Hi, I'm <strong>[Your Name]</strong> — a passionate web developer with a love for building delightful user experiences. My journey started with HTML and CSS, and over time I fell in love with JavaScript, React, and backend systems like Node.js and Django.</p>
// <h3>🔧 <strong>Skills Snapshot</strong></h3>
// <ul>
//   <li>Frontend: HTML, CSS, Tailwind, React, Next.js</li>
//   <li>Backend: Node.js, Express, Django</li>
//   <li>Dev Tools: Git, Docker, VS Code</li>
// </ul>
// <p>🌱 Currently learning: GraphQL, AI APIs</p>
// <p>📫 Reach me at <a href="mailto:your@email.com">your@email.com</a></p>
// `,
//   },
//   {
//     name: 'FAQ Template',
//     html: `
// <h2><strong>❓ Frequently Asked Questions</strong></h2>
// <details>
//   <summary><strong>What is your return policy?</strong></summary>
//   <p>We offer a 30-day return policy from the date of purchase. Items must be unused and in original condition.</p>
// </details>
// <details>
//   <summary><strong>Do you offer international shipping?</strong></summary>
//   <p>Yes! We ship worldwide. Shipping costs and times may vary based on location.</p>
// </details>
// <details>
//   <summary><strong>How can I contact support?</strong></summary>
//   <p>Email us at <a href="mailto:support@example.com">support@example.com</a> or call +8801XXXXXXXXX</p>
// </details>
// `,
//   },
//   {
//     name: 'Blog Article Template',
//     html: `
// <h1><strong>🚀 How I Built My First Web App</strong></h1>
// <p>Last year, I set out to build my first full-stack web application. Here's a breakdown of how it went:</p>
// <h3>🧱 <strong>The Stack</strong></h3>
// <ul>
//   <li>Frontend: React + Tailwind CSS</li>
//   <li>Backend: Node.js + Express</li>
//   <li>Database: MongoDB</li>
// </ul>
// <h3>📚 <strong>Lessons Learned</strong></h3>
// <ol>
//   <li>Always plan your data model before coding.</li>
//   <li>Small commits make debugging way easier.</li>
//   <li>User testing is gold.</li>
// </ol>
// <p>Thanks for reading! Drop me a comment or question below 👇</p>
// `,
//   },
//   {
//     name: 'Customer Testimonial',
//     html: `
// <blockquote style="border-left: 4px solid #00b894; padding-left: 16px; font-style: italic;">
//   "I've used dozens of productivity apps, but none have simplified my workflow like this one. Absolute game changer!"
// </blockquote>
// <p><strong>— Ayesha Rahman,</strong> UX Designer at Pixelwave</p>
// <p><em>⭐⭐⭐⭐⭐ Rated 5 out of 5</em></p>
// `,
//   },
// ];

// const templatesList = [
//   {
//     name: 'Simple Template',
//     html: `<p>Hello! Start typing your content here...</p>`,
//   },
//   {
//     name: 'Advanced Product Template (EN)',
//     html: `<h3 style="text-align: center"><span style="font-size: 26px"><strong>Product Description</strong></span></h3><table><thead><tr><th><div>Attribute</div></th><th><div>Details</div></th></tr></thead><tbody><tr><td><div>Ports</div></td><td><div>USB-C PD ×2, USB-A ×1</div></td></tr><tr><td><div>Max Power Output</div></td><td><div>65W (USB-C)</div></td></tr><tr><td><div>GaN Tech</div></td><td><div>Yes (3rd Gen)</div></td></tr><tr><td><div>Safety Protocols</div></td><td><div>Overheat, Overvoltage, Surge</div></td></tr><tr><td><div>Weight</div></td><td><div>130g</div></td></tr><tr><td><div>Plug Type</div></td><td><div>US Foldable</div></td></tr></tbody></table><p>Delightfully charming and thoughtfully crafted, the  <strong>Blossom Baby Girl Soft Sole Shoes</strong> are the perfect blend of  comfort, cuteness, and practicality for your little one’s first steps.  Designed in a soft pastel <strong>sky blue</strong> fabric with a cheerful  <strong>sunshine yellow</strong> sole, these shoes are adorned with an  embroidered green leaf and a bright  <strong>orange 3D flower applique</strong>, adding a playful pop of color to  your baby's outfit.</p><p>Crafted from breathable cotton-blend fabric and lined with a soft, gentle  interior, these baby shoes ensure maximum comfort for delicate feet. The  flexible sole allows for natural foot movement, making them ideal for babies  who are crawling, cruising, or beginning to walk.</p><p>A convenient <strong>hook-and-loop Velcro strap</strong> makes putting them  on and taking them off quick and easy, while ensuring a secure fit that stays  in place even on the most wiggly little feet.</p><p>Whether you're dressing up for a family gathering or heading to the park,  these shoes offer an adorable finishing touch to any baby outfit — perfect for  everyday wear or gifting.</p><h3><strong>Key Benefits</strong></h3><ul><li><p>🌸 <strong>Adorable Design</strong>: Bright floral detail adds playful      charm to any baby outfit</p></li><li><p>👶 <strong>Baby-Friendly Materials</strong>: Soft, breathable fabric      perfect for sensitive baby skin</p></li><li><p>🦶 <strong>Flexible Soles</strong>: Encourages healthy foot development      for early walkers</p></li><li><p>💡 <strong>Easy to Wear</strong>: Hook-and-loop closure helps parents      dress their baby effortlessly</p></li><li><p>🧼 <strong>Low Maintenance</strong>: Spot-clean friendly, designed for      everyday use</p></li></ul><hr><h3><strong>Care Instructions</strong></h3><ul><li><p>Spot clean with a damp cloth and mild soap</p></li><li><p>Air dry naturally, avoid direct heat or machine drying</p></li><li><p>Do not bleach or iron</p></li></ul><hr><h3><strong>Ideal For</strong></h3><ul><li><p>Everyday casual wear</p></li><li><p>Baby photoshoots and special occasions</p></li><li><p>Baby shower or newborn gifts</p></li></ul><ul><li><p>First walkers and pre-walking stage babies</p></li></ul><p><br></p><div class="se-component se-image-container __se__float-left"><figure style="width: 300px"><img src="https://images.pexels.com/photos/2587370/pexels-photo-2587370.jpeg" alt="" data-rotate="" data-proportion="false" data-size="300px,360px" data-align="left" data-file-name="pexels-photo-2587370.jpeg" data-file-size="0" origin-size="3338,5000" data-origin="," style="            width: 300px;            height: 360px;            transform: rotate(0deg);          "></figure></div><div class="se-component se-image-container __se__float-left"><figure style="width: 300px"><img src="https://images.pexels.com/photos/27525334/pexels-photo-27525334/free-photo-of-a-person-holding-a-bottle-of-lipstick.jpeg" alt="Baby Shoes" data-rotate="" data-proportion="false" data-size="300px,360px" data-align="left" data-file-name="pexels-photo-20205711.jpeg" data-file-size="0" data-origin="," origin-size="3338,5000" style="        width: 300px;        height: 360px;        transform: rotate(0deg);      "></figure></div><div class="se-component se-image-container __se__float-left"><figure style="width: 300px"><img src="https://images.pexels.com/photos/27462658/pexels-photo-27462658.jpeg" alt="" data-rotate="" data-proportion="false" data-size="300px,360px" data-align="left" data-file-name="pexels-photo-2587370.jpeg" data-file-size="0" origin-size="3338,5000" data-origin="," style="        width: 300px;        height: 360px;        transform: rotate(0deg);      "></figure></div><div class="se-component se-image-container __se__float-left"><figure style="width: 376px;"><img src="https://images.pexels.com/photos/6527701/pexels-photo-6527701.jpeg" alt="" data-rotate="" data-proportion="false" data-size="376px,360px" data-align="left" data-file-name="pexels-photo-2587370.jpeg" data-file-size="0" origin-size="3338,5000" data-origin="," style="width: 376px; height: 360px; transform: rotate(0deg);"></figure></div><p><br></p><p><br></p><p><br></p><p></p><p></p><p></p><p></p>`,
//   },
//   {
//     name: 'পণ্যের বিবরণ টেমপ্লেট (Bangla)',
//     html: `
// <h2 style="text-align: center"><strong>পণ্যের বিস্তারিত</strong></h2>
// <p><strong>নাম:</strong> ব্লসম বেবি গার্ল সফট সোল জুতো</p>
// <p><strong>বর্ণনা:</strong> শিশুর প্রথম পদক্ষেপকে আরামদায়ক ও স্টাইলিশ করে তুলতে এই জুতো তৈরি করা হয়েছে। নরম তুলার কাপড় ও সুন্দর ফুলের নকশা এটি বিশেষ করে তোলে।</p>
// <h3>🔑 বৈশিষ্ট্যসমূহ:</h3>
// <ul>
//   <li>✅ নরম এবং আরামদায়ক উপাদান</li>
//   <li>✅ হালকা ওজন এবং নমনীয় সোল</li>
//   <li>✅ ভেলক্রো স্ট্র্যাপ যা সহজে পরিধানযোগ্য</li>
//   <li>✅ বাচ্চাদের জন্য নিরাপদ</li>
// </ul>
// <h3>🎯 উপযুক্ত ব্যবহার:</h3>
// <ul>
//   <li>প্রথম পদচারণার সময়</li>
//   <li>উপহার বা ফটোশুট</li>
//   <li>দৈনন্দিন ব্যবহারের জন্য</li>
// </ul>
// `,
//   },
//   {
//     name: 'Product Specification Table (EN)',
//     html: `
// <h3><strong>📦 Product Specifications</strong></h3>
// <table>
//   <thead>
//     <tr><th>Attribute</th><th>Details</th></tr>
//   </thead>
//   <tbody>
//     <tr><td>Material</td><td>Cotton Blend</td></tr>
//     <tr><td>Weight</td><td>130g</td></tr>
//     <tr><td>Color</td><td>Sky Blue / Sunshine Yellow</td></tr>
//     <tr><td>Closure</td><td>Hook & Loop (Velcro)</td></tr>
//     <tr><td>Size Range</td><td>0–12 months</td></tr>
//   </tbody>
// </table>
// `,
//   },
//   {
//     name: 'পণ্যের স্পেসিফিকেশন টেবিল (Bangla)',
//     html: `
// <h3><strong>📋 পণ্যের স্পেসিফিকেশন</strong></h3>
// <table>
//   <thead>
//     <tr><th>বৈশিষ্ট্য</th><th>বিস্তারিত</th></tr>
//   </thead>
//   <tbody>
//     <tr><td>উপাদান</td><td>তুলার সংমিশ্রণ</td></tr>
//     <tr><td>ওজন</td><td>১৩০ গ্রাম</td></tr>
//     <tr><td>রং</td><td>নীল ও হলুদ</td></tr>
//     <tr><td>বন্ধের ধরন</td><td>ভেলক্রো স্ট্র্যাপ</td></tr>
//     <tr><td>পরিমাপ</td><td>০–১২ মাস</td></tr>
//   </tbody>
// </table>
// `,
//   },
//   {
//     name: 'Blog Article Template (EN)',
//     html: `
// <h1><strong>🛠️ How We Designed Our Eco-Friendly Baby Shoes</strong></h1>
// <p>Designing for babies isn't just about cuteness — it's about comfort, support, and sustainability. In this blog, we explore our journey of creating eco-friendly footwear for infants.</p>
// <h3>👣 The Goal</h3>
// <p>We wanted to ensure our product would help babies take their first steps safely while minimizing environmental impact.</p>
// <h3>🌱 Materials Chosen</h3>
// <ul>
//   <li>Organic cotton for softness</li>
//   <li>Natural rubber for flexibility</li>
//   <li>Zero plastic packaging</li>
// </ul>
// <h3>📸 Behind the Scenes</h3>
// <p>Our design team spent months prototyping, testing, and gathering parent feedback. See some of the photos below!</p>
// `,
//   },
//   {
//     name: 'ব্লগ টেমপ্লেট (Bangla)',
//     html: `
// <h1><strong>👣 শিশুর প্রথম জুতার নকশার পেছনের গল্প</strong></h1>
// <p>শিশুর জন্য জুতো তৈরি করতে গেলে অনেক কিছু মাথায় রাখতে হয় — আরাম, নিরাপত্তা, এবং নান্দনিকতা। আজ জানবো কীভাবে আমরা আমাদের সেরা পণ্যটি তৈরি করেছি।</p>
// <h3>🎯 আমাদের উদ্দেশ্য</h3>
// <p>একটি জুতো তৈরি করা যা আরামদায়ক, নিরাপদ এবং দৃষ্টিনন্দন — সব একসাথে।</p>
// <h3>📦 উপাদানসমূহ</h3>
// <ul>
//   <li>নরম তুলার কাপড়</li>
//   <li>নমনীয় রাবার সোল</li>
//   <li>শিশুবান্ধব রং</li>
// </ul>
// <h3>📷 ছবি ও অভিজ্ঞতা</h3>
// <p>পণ্য তৈরির সময় আমাদের টিমের কিছু মুহূর্ত এখানে দেখুন।</p>
// `,
//   },
//   {
//     name: 'Basic Page Template (EN)',
//     html: `
// <header>
//   <h1 style="text-align: center">Welcome to Our Shop</h1>
// </header>
// <section>
//   <h2>✨ Featured Products</h2>
//   <p>Discover our curated collection of adorable and safe products for your baby.</p>
// </section>
// <section>
//   <h2>📢 Latest Blog</h2>
//   <p>Check out parenting tips, new arrivals, and behind-the-scenes stories from our team.</p>
// </section>
// <footer style="text-align: center">
//   <p>© 2025 Blossom Babywear. All rights reserved.</p>
// </footer>
// `,
//   },
//   {
//     name: 'সম্পূর্ণ পেজ টেমপ্লেট (Bangla)',
//     html: `
// <header>
//   <h1 style="text-align: center">আমাদের দোকানে স্বাগতম</h1>
// </header>
// <section>
//   <h2>🌟 ফিচারড পণ্যসমূহ</h2>
//   <p>নিরাপদ ও আরামদায়ক শিশুপণ্য খুঁজুন আমাদের কালেকশনে।</p>
// </section>
// <section>
//   <h2>📰 সর্বশেষ ব্লগ</h2>
//   <p>নতুন আপডেট, টিপস ও অভিজ্ঞতা পড়ুন আমাদের ব্লগে।</p>
// </section>
// <footer style="text-align: center">
//   <p>© ২০২৫ ব্লসম বেবিওয়্যার। সর্বস্বত্ব সংরক্ষিত।</p>
// </footer>
// `,
//   },
//   {
//     name: 'test',
//     html: `
//     <p>SunEditor</p>

// <div class="se-component se-image-container __se__float-right">
//   <figure style="margin: auto;">
//     <img src="http://suneditor.com/docs/cat.jpg" data-align="right" alt="Tabby" data-rotate="" data-proportion="false" origin-size="640,426" data-origin="640,426" data-file-name="cat.jpg" data-file-size="0" data-size="," data-percentage="auto,auto" style="" data-index="0" data-rotatex="" data-rotatey="" width="" height="">
//     <figcaption>
//       <p>Insert description</p>
//     </figcaption>
//   </figure>
// </div>

// <p>Here is an example of math -&gt;<span class="katex" data-exp="\displaystyle\sum_{i=1}^{k+1}i" data-font-size="1.5em" style="font-size: 24px" contenteditable="false"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mstyle scriptlevel="0" displaystyle="true"><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mrow><mi>k</mi><mo>+</mo><mn>1</mn></mrow></munderover><mi>i</mi></mstyle></mrow><annotation encoding="application/x-tex">\displaystyle\sum_{i=1}^{k+1}i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:3.1137820000000005em;vertical-align:-1.277669em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.8361130000000003em;"><span style="top:-1.872331em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">i</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span style="top:-3.050005em;"><span class="pstrut" style="height:3.05em;"></span><span><span class="mop op-symbol large-op">∑</span></span></span><span style="top:-4.300005em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight" style="margin-right:0.03148em;">k</span><span class="mbin mtight">+</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.277669em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord mathdefault">i</span></span></span></span> 123</p>

// <h3>The Suneditor is based on pure JavaScript, with no dependencies.</h3>

// <pre>
// Suneditor is a lightweight, flexible, customizable WYSIWYG text editor for your web applications.</pre>

// <blockquote>
//   <p>Supports Chrome, Safari, Opera, Firefox, Edge, IE11, Mobile web browser.</p>
// </blockquote>

// <p><strong><span style="color: rgb(255, 94, 0)">SunEditor</span></strong><em><span style="background-color: rgb(250, 237, 125)">distributed under</span></em>&nbsp;the <a href="https://github.com/JiHong88/SunEditor/blob/master/LICENSE.txt" target="_blank">MIT</a> license.</p>

// <hr>

// <p><span style="font-size: 16px"><span style="font-family: Impact">Table</span></span></p>

// <table class="se-table-size-auto">
//   <thead>
//     <tr>
//       <th>
//         <div>Column_1</div>
//       </th>
//       <th>
//         <div>Column_2</div>
//       </th>
//       <th>
//         <div>Column_3</div>
//       </th>
//       <th>
//         <div>Column_4</div>
//       </th>
//       <th>
//         <div>Column_5</div>
//       </th>
//     </tr>
//   </thead>
//   <tbody>
//     <tr>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//     </tr>
//     <tr>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//     </tr>
//     <tr>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//     </tr>
//     <tr>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//     </tr>
//     <tr>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//       <td>
//         <div><br>
//         </div>
//       </td>
//     </tr>
//   </tbody>
// </table>

// <p><br>
// </p>

// <ul>
//   <li>Pasting from Microsoft Word and Excel.</li>
//   <li>Custom table selection, merge and split.</li>
//   <li>Media embed, images upload.</li>
//   <li>Can use CodeMirror, KaTeX.
//     <ul>
//       <li>And.. many other features :)</li>
//     </ul>
//   </li>
// </ul>

// <p><br>
// </p>

// <p>

// <div style={{display: flex; justify-content: between; background: red;}}>
// <div>
// first
// </div>
// <div>
// second
// </div>
// </div>
// </p>

// `,
//   },
// ];

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
	const [selectedImages, setSelectedImages] = React.useState<string[]>([]);

	const getSunEditorInstance = (sunEditor: SunEditorCore) => {
		editor.current = sunEditor;
	};

	const handleImageUploadBefore = (
		files: File[],
		_info: object,
		uploadHandler: (response: {
			result: { url: any; name: string }[];
			errorMessage?: string;
		}) => void
	): boolean => {
		(async () => {
			const file = files[0];
			// const webpFile = await convertImageToWebP(file);

			// const formData = new FormData();
			// formData.append('file', webpFile, 'image.webp');
			// formData.append('directory', 'editor');

			// const response = await api.post('/admin-file/upload', formData);
			// if (response.success) {
			//   setSelectedImages((prev) => [...prev, response.data]);

			uploadHandler({
				result: [
					{
						url: file,
						name: "thumbnail",
					},
				],
			});
			// }
		})();
		return true;
	};

	// Define custom fonts
	const customFonts = [
		"Noto Sans Bengali",
		"Tiro Bangla",
		"Poppins",
		"Roboto",
		"Lato",
		"Merriweather",
		"Open Sans",
		"Oswald",
		"Raleway",
	];

	const [content, setContent] = React.useState(defaultValue || "");

	const handleChange = (content: string) => {
		if (onChange) {
			setContent(content);
			onChange(content);
		}
	};

	useEffect(() => {
		selectedImages.forEach(async (image) => {
			// Only consider deleting if not found in content
			if (
				content &&
				!content.includes("base64") &&
				!content.includes(image)
			) {
				try {
					// const removedRes = await fileDelete(image);

					setSelectedImages((prev) => prev.filter((img) => img !== image));
				} catch (error) {
					console.error("Image deletion failed:", error);
				}
			}
		});
	}, [content, selectedImages]);

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
