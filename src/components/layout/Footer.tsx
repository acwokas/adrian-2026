import { Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 md:py-16">
      <div className="container-wide">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <p className="text-sm font-medium text-foreground">Adrian Watkins</p>
            <a
              href="https://www.linkedin.com/in/adrianwatkins"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">Senior Commercial, Strategic and Operational Leader</p>
          <p className="text-xs text-muted-foreground">
            © Adrian Watkins. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
