import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";

const REDIRECT_DELAY = 5; // seconds

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(REDIRECT_DELAY);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Auto-redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location.pathname, navigate]);

  return (
    <Layout>
      <SEOHead 
        title="Page Not Found"
        description="The page you are looking for does not exist. Redirecting to Adrian Watkins' homepage for executive advisory and fractional leadership services."
        canonical="/404"
        noIndex
      />
      <section className="section-spacing">
        <div className="container-narrow text-center">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-light text-muted-foreground">404</h1>
            <h2>Page not found</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              The page you are looking for does not exist or has been moved.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to homepage in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/">
                <ArrowLeft size={16} />
                Go to homepage now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;