import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * Merges and combines multiple class names into a single string.
 * Uses clsx to conditionally combine class names, then uses twMerge to resolve Tailwind CSS conflicts.
 * @param {...(string|object|array)} inputs - Class names, objects with boolean values, or arrays of class names
 * @returns {string} The merged class name string with Tailwind conflicts resolved
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
