import { createFileRoute } from "@tanstack/react-router";
import { AdminApp } from "@/components/admin/admin-app";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getSitePayload } from "@/lib/cms/functions";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin")({
  loader: () => getSitePayload(),
  component: AdminRoute,
});

function AdminRoute() {
  const { user, isPending } = useCurrentUserState();
  const data = Route.useLoaderData();

  if (isPending) {
    return (
      <div className="min-h-screen bg-cream p-8">
        <Skeleton className="h-14 w-full" />
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  return <AdminApp initialContent={data.content} />;
}
