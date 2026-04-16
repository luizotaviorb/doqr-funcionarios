import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCPF(value: string, previous = ""): string {
  if (value.length < previous.length) return value;
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatPhone(value: string, previous = ""): string {
  if (value.length < previous.length) return value;
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export function formatDate(value: string, previous = ""): string {
  if (value.length < previous.length) return value;
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2");
}

export function formatISODate(isoString: string): string {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}
