import { Suspense } from "react";
import LoginPageClient from "./login-client";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="mx-auto min-h-screen max-w-md px-6 py-12" />}>
      <LoginPageClient />
    </Suspense>
  );
}
