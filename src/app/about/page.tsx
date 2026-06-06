import { permanentRedirect } from "next/navigation";

// The English marketing homepage moved back to the root (/). Keep /about as a
// permanent redirect so old links still work.
export default function AboutRedirect() {
  permanentRedirect("/");
}
