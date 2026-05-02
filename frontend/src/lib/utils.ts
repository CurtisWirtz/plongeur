import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simply capitalizes the first letter on error reports
export function capitalized(str: string): string {
  // get the first character and capitalize it
  const firstChar: string = str[0][0].toUpperCase()
  // concatenate the capitalized first character with the rest of the string
  return firstChar + str[0].slice(1);
}