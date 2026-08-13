import { Component } from "react";

/**
 * Last line of defence: if any page throws while rendering, show a readable
 * explanation instead of a blank white screen.
 *
 * Most content mistakes never reach here — a JSON syntax error stops the build
 * with the filename and line number, and src/lib/content.js substitutes safe
 * fallbacks for content of the wrong shape. This catches whatever slips past
 * both, and points at the files a non-developer can actually fix.
 */
export default class ContentErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[content] A page failed to render.", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
          Something in the content files
        </p>

        <h1 className="max-w-2xl font-display text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          This page could not be displayed
        </h1>

        <p className="max-w-xl leading-relaxed text-muted-foreground">
          This is almost always a small mistake in one of the files in{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground">
            src/content/
          </code>
          . A missing comma or a stray quote mark is the usual cause.
        </p>

        <ol className="max-w-xl space-y-2 text-left text-sm leading-relaxed text-muted-foreground">
          <li>
            <strong className="text-foreground">1.</strong> Open the content file you edited last.
          </li>
          <li>
            <strong className="text-foreground">2.</strong> Check that every line inside{" "}
            <code className="font-mono text-foreground">{"{ }"}</code> ends with a comma, except the
            final one.
          </li>
          <li>
            <strong className="text-foreground">3.</strong> Check that every{" "}
            <code className="font-mono text-foreground">&quot;</code> has a matching partner.
          </li>
          <li>
            <strong className="text-foreground">4.</strong> Save, then reload this page.
          </li>
        </ol>

        <p className="text-sm text-muted-foreground">
          See <code className="font-mono text-foreground">EDITING.md</code> for worked examples.
        </p>

        <button
          type="button"
          onClick={() => window.location.assign("/")}
          className="mt-2 inline-flex min-h-[44px] items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to the home page
        </button>

        {import.meta.env.DEV && (
          <pre className="mt-4 max-w-2xl overflow-x-auto rounded-xl border border-border bg-card p-4 text-left font-mono text-xs text-muted-foreground">
            {String(this.state.error?.message || this.state.error)}
          </pre>
        )}
      </main>
    );
  }
}
