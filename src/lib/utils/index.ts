import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility types expected by shadcn-svelte dropdown components
export type WithoutChild<T> = Omit<T, "child">;
export type WithoutChildren<T> = Omit<T, "children">;
export type WithoutChildrenOrChild<T> = Omit<T, "child" | "children">;
export type WithElementRef<T> = T & { ref?: HTMLElement | null };
