import type { AppRole } from "@/lib/api/types";

/** Landing route for a role. Safe to import from client components. */
export function homePathForRole(role: AppRole): string {
  switch (role) {
    case "customer":
      return "/customer";
    case "cashier":
      return "/staff";
    case "admin":
      return "/admin";
    case "owner":
      return "/owner";
    default:
      return "/customer";
  }
}
