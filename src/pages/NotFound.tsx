import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="section-spacing">
        <div className="container-narrow text-center">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-light text-muted-foreground">404</h1>
            <h2>Page not found</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              The page you are looking for does not exist or has been moved.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/">
                <ArrowLeft size={16} />
                Back to home
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
