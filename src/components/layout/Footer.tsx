import { Linkedin, Mail, Globe } from "lucide-react";
import { TrackedExternalLink, TrackedLink } from "@/components/TrackedLink";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "EDGE Framework", path: "/edge" },
  { label: "Tools", path: "/tools" },
  { label: "About", path: "/about" },
  { label: "Speaking", path: "/speaking" },
  { label: "Contact", path: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/30">
      {/* Main footer content */}
      <div className="container-wide py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">

          {/* Column 1 - Brand & Description */}
          <div className="space-y-4 text-center md:text-left md:col-span-1">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <span className="text-lg font-semibold text-foreground">Adrian Watkins</span>
                <TrackedExternalLink
                  href="https://www.linkedin.com/in/adrianwatkins"
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="linkedin_footer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </TrackedExternalLink>
              </div>
              <p className="text-sm text-muted-foreground">
                Creator, EDGE Framework for Applied Intelligence
              </p>
            </div>

            <p className="text-sm italic text-muted-foreground/70">
              Structuring intelligence from curiosity to capability
            </p>

            <p className="text-xs text-muted-foreground/50">
              SVP Commercial Operations &amp; Governance, SQREEM Technologies
            </p>
          </div>

          {/* Column 2 - Navigation */}
          <div className="text-center md:text-left">
            <h4 className="text-xs uppercase tracking-widest text-accent font-medium mb-5">
              Navigate
            </h4>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <TrackedLink
                  key={link.path}
                  to={link.path}
                  eventName={`footer_nav_${link.label.toLowerCase().replace(/\s/g, '_')}`}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {link.label}
                </TrackedLink>
              ))}
            </nav>
          </div>

          {/* Column 3 - Connect */}
          <div className="text-center md:text-left">
            <h4 className="text-xs uppercase tracking-widest text-accent font-medium mb-5">
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              <TrackedExternalLink
                href="mailto:me@adrianwatkins.com"
                eventName="footer_email"
                className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center justify-center md:justify-start gap-2"
              >
                <Mail size={14} className="shrink-0" />
                me@adrianwatkins.com
              </TrackedExternalLink>

              <TrackedExternalLink
                href="https://www.linkedin.com/in/adrianwatkins"
                target="_blank"
                rel="noopener noreferrer"
                eventName="linkedin_footer_connect"
                className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center justify-center md:justify-start gap-2"
              >
                <Linkedin size={14} className="shrink-0" />
                linkedin.com/in/adrianwatkins
              </TrackedExternalLink>

              <TrackedExternalLink
                href="https://adrianwatkins.com"
                target="_blank"
                rel="noopener noreferrer"
                eventName="footer_website"
                className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center justify-center md:justify-start gap-2"
              >
                <Globe size={14} className="shrink-0" />
                adrianwatkins.com
              </TrackedExternalLink>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-border/20">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground/50">
            © 2026 Adrian Watkins
          </span>
          <TrackedLink
            to="/privacy"
            eventName="footer_privacy_policy"
            className="text-xs text-muted-foreground/50 hover:text-accent transition-colors"
          >
            Privacy Policy
          </TrackedLink>
        </div>
      </div>
    </footer>
  );
}
