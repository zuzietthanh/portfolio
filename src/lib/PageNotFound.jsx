import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PageNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">404</p>
      <h1 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-foreground">
        This page doesn't exist
      </h1>
      <p className="text-muted-foreground max-w-md">
        The link may be out of date, or the page may have been renamed.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-4 w-4" />
        Back home
      </Link>
    </main>
  );
}
