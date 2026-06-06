import { permanentRedirect } from "next/navigation";

// The chat app lives at /chat. Keep /try as a permanent redirect so old
// links still work.
export default function TryRedirect() {
  permanentRedirect("/chat");
}
