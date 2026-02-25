import { Suspense } from "react";
import CreateLeadPage from "./CreateLeadClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CreateLeadPage />
    </Suspense>
  );
}
