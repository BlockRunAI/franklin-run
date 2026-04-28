import { redirect } from "next/navigation";

export default function BlogIndexRedirect() {
  redirect("/blog/en");
}
