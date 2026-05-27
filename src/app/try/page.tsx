import { redirect } from "next/navigation";

// The chat app moved to the root (/). Keep /try as a permanent redirect so old
// links still work.
export default function TryRedirect() {
  redirect("/");
}
