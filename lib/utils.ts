import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleCookies = (
  method: string,
  name?: string,
  setItem?: string
): string | boolean => {
  // This method is used to store, get, delete items in cookiess
  try {
    if (method === "get" && name !== undefined) {
      const cookieData = cookies().get(name);
      if (!cookieData) return false;
      const data = cookieData.value;
      return data;
    }

    if (method === "set" && setItem !== undefined && name !== undefined) {
      cookies().set(name, setItem);
      return true;
    }
    if (method === "delete" && name !== undefined) {
      const data = cookies().get(name);
      if (!data) return false;
      cookies().delete(name);
      return true;
    }
    return false;
    // Add more cookies method
  } catch (error) {
    return false;
  }
};
