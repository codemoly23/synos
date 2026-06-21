"use client";

import type React from "react";
import { MediaPicker } from "@/components/storage/media-picker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ImagePickerWithDimensionsProps {
	label: string;
	hint: string;
	value?: string | null;
	onChange: (url: string | null) => void;
	placeholder?: string;
	galleryTitle?: string;
	disabled?: boolean;
	/** Set false for gallery/before-after fields that only need hint text */
	showDimensions?: boolean;
	widthInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
	heightInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export function ImagePickerWithDimensions({
	label,
	hint,
	value,
	onChange,
	placeholder,
	galleryTitle,
	disabled,
	showDimensions = true,
	widthInputProps,
	heightInputProps,
}: ImagePickerWithDimensionsProps) {
	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			<p className="text-xs text-muted-foreground">{hint}</p>
			<MediaPicker
				type="image"
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				disabled={disabled}
				galleryTitle={galleryTitle}
			/>
			{showDimensions && (
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1.5">
						<Label className="text-xs text-muted-foreground">Width (px)</Label>
						<Input
							type="number"
							placeholder="e.g. 1920"
							{...widthInputProps}
							disabled={disabled}
						/>
					</div>
					<div className="space-y-1.5">
						<Label className="text-xs text-muted-foreground">Height (px)</Label>
						<Input
							type="number"
							placeholder="e.g. 800"
							{...heightInputProps}
							disabled={disabled}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
