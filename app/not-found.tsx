import { BackLink } from "@/components/back-link";
import { PageHeader } from "@/components/page-header";

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

