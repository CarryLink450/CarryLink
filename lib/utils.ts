import { users } from "@/data/mockData";
import type { User } from "@/types";

export const brandName = "CarryLink";

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}

export function findUser(id: string) {
  return users.find((user) => user.id === id) ?? users[0];
}

export function findUserFromList(id: string, list: User[]) {
  return list.find((user) => user.id === id) ?? list[0] ?? users[0];
}
