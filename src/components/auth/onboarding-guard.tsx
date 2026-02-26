"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useOnboardingStore } from "@/store/onboarding-store";
import { useHydrated } from "@/lib/use-hydrated";

/**
 * Route guard that enforces onboarding completion.
 * - Not launched + not on /onboarding → redirect to /onboarding
 * - Launched + on /onboarding → redirect to /
 * - Shows loading pulse while hydrating from localStorage
 */
export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const isLaunched = useOnboardingStore((s) => s.isLaunched);
  const router = useRouter();
  const pathname = usePathname();

  const isOnboardingRoute = pathname === "/onboarding";
  const isApiRoute = pathname.startsWith("/api");

  useEffect(() => {
    // Don't redirect during hydration or for API routes
    if (!hydrated || isApiRoute) return;

    if (!isLaunched && !isOnboardingRoute) {
      router.replace("/onboarding");
    } else if (isLaunched && isOnboardingRoute) {
      router.replace("/");
    }
  }, [hydrated, isLaunched, isOnboardingRoute, isApiRoute, router]);

  // While hydrating, show a loading state
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: "0ms" }} />
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: "200ms" }} />
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: "400ms" }} />
          </div>
          <p className="text-muted text-sm font-mono">Initializing Command Center...</p>
        </div>
      </div>
    );
  }

  // During redirect, show loading instead of flashing wrong content
  if (!isLaunched && !isOnboardingRoute && !isApiRoute) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted text-sm font-mono">Redirecting to setup...</p>
      </div>
    );
  }

  if (isLaunched && isOnboardingRoute) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted text-sm font-mono">Loading dashboard...</p>
      </div>
    );
  }

  return <>{children}</>;
}
