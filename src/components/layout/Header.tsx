import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { TrackedLink } from "@/components/TrackedLink";

const navItems = [
  { label: "Home", path: "/" },
  { label: "What I Do", path: "/what-i-do" },
  { label: "How I Work", path: "/how-i-work" },
  { label: "Experience", path: "/experience" },
  { label: "Executive CV", path: "/executive-cv" },
  { label: "Contact", path: "/contact" },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <nav className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <TrackedLink 
            to="/" 
            eventName="nav_logo"
            className="text-xl md:text-2xl font-medium text-foreground hover:text-accent transition-all duration-300 hover:scale-105 origin-left"
          >
            Adrian Watkins
          </TrackedLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <TrackedLink
                key={item.path}
                to={item.path}
                eventName={`nav_${item.label.toLowerCase().replace(/\s/g, '_')}`}
                className={cn(
                  "text-sm transition-colors",
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </TrackedLink>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <TrackedLink
                  key={item.path}
                  to={item.path}
                  eventName={`nav_mobile_${item.label.toLowerCase().replace(/\s/g, '_')}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-sm py-2 transition-colors",
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </TrackedLink>
              ))}
              <div className="pt-2 border-t border-border/50">
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
