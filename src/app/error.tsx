"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-heading mb-4">Something went wrong!</h1>
          <p className="text-muted-foreground mb-2">
            We encountered an unexpected error. Please try again.
          </p>
          {process.env.NODE_ENV === "development" && error.message && (
            <p className="text-sm text-muted-foreground mt-4 p-4 bg-muted rounded-lg text-left font-mono">
              {error.message}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 border border-border hover:bg-accent transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

