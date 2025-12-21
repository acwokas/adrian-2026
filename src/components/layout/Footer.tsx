import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 md:py-16">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Part of the{" "}
              <a
                href="https://you.withthepowerof.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-accent transition-colors"
              >
                you.withthepowerof.ai
              </a>{" "}
              ecosystem
            </p>
          </div>

          <a
            href="https://aiinasia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            AIinASIA.com
            <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Adrian Watkins. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
