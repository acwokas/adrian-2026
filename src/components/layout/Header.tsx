import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { TrackedLink } from "@/components/TrackedLink";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "EDGE Framework", path: "/edge" },
  { label: "Tools", path: "/tools" },
  { label: "About", path: "/about" },
  { label: "Speaking", path: "/speaking" },
  { label: "Contact", path: "/contact" },
];

const FONT_SIZE_KEY = "site-font-size";
const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 22;
const DEFAULT_FONT_SIZE = 16;

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_FONT_SIZE;
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem(FONT_SIZE_KEY, fontSize.toString());
  }, [fontSize]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, MAX_FONT_SIZE));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, MIN_FONT_SIZE));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <nav className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <TrackedLink 
            to="/" 
            eventName="nav_logo"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300"
          >
            <img 
              src={logo} 
              alt="Adrian Watkins" 
              className="h-8 md:h-10 w-auto dark:invert"
            />
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
            
            {/* Font Size Controls */}
            <div className="flex items-center gap-1 border border-border/50 rounded-md px-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={decreaseFontSize}
                disabled={fontSize <= MIN_FONT_SIZE}
                aria-label="Decrease font size"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xs text-muted-foreground w-6 text-center">A</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={increaseFontSize}
                disabled={fontSize >= MAX_FONT_SIZE}
                aria-label="Increase font size"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <ThemeToggle />
          </div>

          {/* Mobile Controls - visible on larger mobile screens */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Font Size Controls - hidden on very small screens */}
            <div className="hidden sm:flex items-center gap-1 border border-border/50 rounded-md px-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={decreaseFontSize}
                disabled={fontSize <= MIN_FONT_SIZE}
                aria-label="Decrease font size"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xs text-muted-foreground w-6 text-center">A</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={increaseFontSize}
                disabled={fontSize >= MAX_FONT_SIZE}
                aria-label="Increase font size"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Theme Toggle - hidden on very small screens */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
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
              
              {/* Mobile Font Size Controls */}
              <div className="flex items-center gap-2 py-2">
                <span className="text-sm text-muted-foreground">Font Size:</span>
                <div className="flex items-center gap-1 border border-border/50 rounded-md px-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decreaseFontSize}
                    disabled={fontSize <= MIN_FONT_SIZE}
                    aria-label="Decrease font size"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-xs text-muted-foreground w-6 text-center">A</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={increaseFontSize}
                    disabled={fontSize >= MAX_FONT_SIZE}
                    aria-label="Increase font size"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
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
