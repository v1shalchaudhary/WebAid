import { notFound } from "next/navigation";
import { getAdminSession } from "@/lib/admin";

// Runs on the server before the admin page is ever sent to the browser.
// Anyone who isn't the admin gets a normal 404, as if the page doesn't exist.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await getAdminSession())) {
    notFound();
  }
  return <>{children}</>;
}
