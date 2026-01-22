import { Linkedin } from "lucide-react";
import { TrackedExternalLink, TrackedLink } from "@/components/TrackedLink";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "What I Do", path: "/what-i-do" },
  { label: "How I Work", path: "/how-i-work" },
  { label: "Experience", path: "/experience" },
  { label: "Executive CV", path: "/executive-cv" },
  { label: "Contact", path: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 md:py-16">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          {/* Left column */}
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <p className="text-sm font-medium text-foreground">Adrian Watkins</p>
              <TrackedExternalLink
                href="https://www.linkedin.com/in/adrianwatkins"
                target="_blank"
                rel="noopener noreferrer"
                eventName="linkedin_footer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </TrackedExternalLink>
            </div>
            <p className="text-sm text-muted-foreground text-balance max-w-[200px] mx-auto md:mx-0 md:max-w-none">Senior Commercial, Strategic and Operational Leader</p>
            <p className="text-xs text-muted-foreground">
              © 2026 Adrian Watkins. All rights reserved.
            </p>
            <TrackedLink
              to="/privacy"
              eventName="footer_privacy_policy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Privacy Policy
            </TrackedLink>
          </div>

          {/* Right column - Navigation */}
          <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-center md:text-right md:justify-items-end">
            {navLinks.map((link) => (
              <TrackedLink
                key={link.path}
                to={link.path}
                eventName={`footer_nav_${link.label.toLowerCase().replace(/\s/g, '_')}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                {link.label}
              </TrackedLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
