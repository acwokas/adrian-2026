import { Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 md:py-16">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-sm font-medium text-foreground">Adrian Watkins</p>
            <p className="text-sm text-muted-foreground">Senior Commercial, Strategic and Operational Leader</p>
            <p className="text-xs text-muted-foreground">
              © Adrian Watkins. All rights reserved.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <a
              href="https://www.linkedin.com/in/adrianwatkins"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
