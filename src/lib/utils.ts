import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type { ClassArray, ClassDictionary, ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]): string | undefined =>
	twMerge(clsx(inputs)) || undefined;
