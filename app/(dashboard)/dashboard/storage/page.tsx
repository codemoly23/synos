"use client";

import { useState } from "react";
import { StorageManager, MediaPicker } from "@/components/storage";
import type { StorageFile, StorageFolder } from "@/lib/storage/client";

export default function StoragePage() {
	// Example state for MediaPicker demo
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [selectedDocument, setSelectedDocument] = useState<string | null>(
		null
	);

	const handleUpload = (file: StorageFile) => {
		console.log("File uploaded:", file);
	};

	const handleDelete = (filename: string, folder: StorageFolder) => {
		console.log("File deleted:", filename, "from", folder);
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					File Storage
				</h1>
				<p className="text-gray-600">
					Upload, manage, and organize your images and documents.
				</p>
			</div>

			{/* Media Picker Demo */}
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<h2 className="text-xl font-bold text-gray-900 mb-4">
					Media Picker
				</h2>
				<p className="text-sm text-gray-600 mb-6">
					Use the MediaPicker component in forms to select files from your
					library or upload new ones.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Image Picker */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Featured Image
						</label>
						<MediaPicker
							type="image"
							value={selectedImage}
							onChange={setSelectedImage}
							placeholder="Click to select image"
							galleryTitle="Select Featured Image"
						/>
						{selectedImage && (
							<p className="mt-2 text-xs text-gray-500 truncate">
								URL: {selectedImage}
							</p>
						)}
					</div>

					{/* Document Picker */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Product PDF
						</label>
						<MediaPicker
							type="document"
							value={selectedDocument}
							onChange={setSelectedDocument}
							placeholder="Click to select document"
							galleryTitle="Select Product Document"
						/>
						{selectedDocument && (
							<p className="mt-2 text-xs text-gray-500 truncate">
								URL: {selectedDocument}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Storage Manager */}
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<h2 className="text-xl font-bold text-gray-900 mb-4">
					Full Storage Manager
				</h2>
				<StorageManager
					defaultTab="images"
					onUpload={handleUpload}
					onDelete={handleDelete}
				/>
			</div>

			{/* Usage Info */}
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<h2 className="text-xl font-bold text-gray-900 mb-4">
					Usage Information
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="font-semibold text-gray-800 mb-2">Images</h3>
						<ul className="text-sm text-gray-600 space-y-1">
							<li>Supported formats: JPG, PNG, WebP, GIF</li>
							<li>Maximum file size: 5MB</li>
							<li>Publicly accessible after upload</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold text-gray-800 mb-2">
							Documents
						</h3>
						<ul className="text-sm text-gray-600 space-y-1">
							<li>Supported formats: PDF, DOC, DOCX</li>
							<li>Maximum file size: 20MB</li>
							<li>Publicly accessible after upload</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
