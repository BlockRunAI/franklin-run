import { HomePage } from "@/components/HomePage";
import { getHomeDict } from "@/lib/home";

export default function Home() {
  return <HomePage dict={getHomeDict("en")} locale="en" />;
}
