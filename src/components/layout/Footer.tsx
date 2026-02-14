import { Linkedin } from "lucide-react";
import { TrackedExternalLink, TrackedLink } from "@/components/TrackedLink";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Tools", path: "/tools" },
  { label: "EDGE Framework", path: "/edge" },
  { label: "About", path: "/about" },
  { label: "Speaking & Workshops", path: "/speaking" },
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
            <p className="text-sm text-muted-foreground text-balance max-w-[280px] mx-auto md:mx-0 md:max-w-none">Creator, EDGE Framework for Applied Intelligence</p>
            <p className="text-sm text-muted-foreground text-balance max-w-[280px] mx-auto md:mx-0 md:max-w-none">SVP Commercial Operations &amp; Governance, SQREEM Technologies</p>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-3 text-xs text-muted-foreground">
              <span>© 2026 Adrian Watkins</span>
              <span className="text-border">·</span>
              <TrackedLink
                to="/privacy"
                eventName="footer_privacy_policy"
                className="hover:text-foreground transition-colors underline"
              >
                Privacy Policy
              </TrackedLink>
            </div>
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
