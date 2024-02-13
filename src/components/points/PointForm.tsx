import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

const PointSchema = z.object({
	content: z
		.string()
		.min(3, {
			message: "Point must have at least 3 characters.",
		})
		.max(320, {
			message: "Point must not be longer than 320 characters.",
		}),
});

export interface PointFormProps<T extends any> {
	onSubmit: (data: z.infer<typeof PointSchema>) => Promise<T>;
	onCancel: () => void;
	className?: string;
}

export const PointForm = <T extends any>({
	onSubmit,
	onCancel,
	className,
}: PointFormProps<T>) => {
	const form = useForm<z.infer<typeof PointSchema>>({
		resolver: zodResolver(PointSchema),
	});

	const { handleSubmit, control, getValues, reset } = form;

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className={className}>
				<FormField
					control={control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<div className="flex flex-col">
								<FormControl>
									<Textarea
										placeholder="Make your point"
										className="h-32 resize-none"
										onKeyDown={(e) => {
											if (!(e.metaKey || e.ctrlKey)) return;

											if (e.key === "Enter") {
												console.log("Submitting");
												e.preventDefault();
												handleSubmit(onSubmit)();
											}
										}}
										{...field}
									/>
								</FormControl>
								<div
									className={cn(
										"mb-2 mt-1 text-sm",
										(getValues("content")?.length ?? 0) > 320 ?
											"text-red-600"
										:	"text-neutral-500",
									)}
								>
									{getValues("content")?.length ?? 0}/320
								</div>
							</div>

							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex w-full justify-end gap-2">
					<Button
						type="button"
						variant={"tertiary"}
						onClick={() => {
							reset();
							onCancel();
						}}
					>
						Cancel
					</Button>
					<Button type="submit">Publish</Button>
				</div>
			</form>
		</Form>
	);
};
