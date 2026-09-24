import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string | undefined =>
	twMerge(clsx(inputs)) || undefined;
