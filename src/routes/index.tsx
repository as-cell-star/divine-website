import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/site/home";
import { getSitePayload } from "@/lib/cms/functions";

export const Route = createFileRoute("/")({
  loader: () => getSitePayload(),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  return <HomePage data={data} />;
}
