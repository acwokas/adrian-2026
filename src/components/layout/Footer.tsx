export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 md:py-16">
      <div className="container-wide">
        <div className="space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Adrian Watkins</p>
            <p className="text-sm text-muted-foreground">Senior Commercial and Operational Leader</p>
          </div>
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
          <p className="text-xs text-muted-foreground pt-4">
            © Adrian Watkins. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
