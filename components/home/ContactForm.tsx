"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	company: z.string().optional(),
	phone: z.string().min(10, {
		message: "Please enter a valid phone number.",
	}),
	message: z.string().min(10, {
		message: "Message must be at least 10 characters.",
	}),
});

export function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	// const { toast } = useToast(); // Assuming toast is set up, otherwise we'll just alert or console log

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			company: "",
			phone: "",
			message: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);
		// Simulate API call
		setTimeout(() => {
			console.log(values);
			setIsSubmitting(false);
			form.reset();
			alert("Message sent successfully! We'll get back to you soon.");
		}, 2000);
	}

	return (
		<div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-100 shadow-xl border border-border/50 p-8">
			<div className="mb-8 text-center">
				<h3 className="text-2xl font-bold text-secondary mb-2">
					Get in Touch
				</h3>
				<p className="text-slate-600">
					Fill out the form below and our team will get back to you within
					24 hours.
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 text-secondary"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input
											placeholder="John Doe"
											{...field}
											className="bg-white border border-slate-100 shadow-sm"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="john@example.com"
											className="bg-white border border-slate-100 shadow-sm"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input
											placeholder="+1 (555) 000-0000"
											className="bg-white border border-slate-100 shadow-sm"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="company"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Company (Optional)</FormLabel>
									<FormControl>
										<Input
											placeholder="Hospital / Clinic Name"
											className="bg-white border border-slate-100 shadow-sm"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Message</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Tell us about your equipment needs..."
										className="resize-none min-h-[120px] bg-white border border-slate-100 shadow-sm"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full bg-primary hover:bg-primary-hover text-white h-12 text-base font-medium rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Sending...
							</>
						) : (
							<>
								Send Message
								<Send className="ml-2 h-4 w-4" />
							</>
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}
