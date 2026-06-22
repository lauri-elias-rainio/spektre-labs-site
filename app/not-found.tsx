import type { Metadata } from "next";
import { BackLink } from "@/components/back-link";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div>
      <BackLink href="/" className="mb-8">
        Back to Home
      </BackLink>

      <PageHeader
        title="Page not found"
        description="The requested page could not be found."
      />
    </div>
  );
}

