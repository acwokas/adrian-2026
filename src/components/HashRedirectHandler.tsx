import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Map of old hash routes to new paths
const hashRedirects: Record<string, { path: string; externalUrl?: string }> = {
  "#about-me": { path: "/" },
  "#resume": { path: "/executive-cv" },
  "#portfolio": { path: "/about" },
  "#new-ai-blog": { path: "/", externalUrl: "https://www.aiinasia.com" },
  "#posts": { path: "/", externalUrl: "https://you.withthepowerof.ai" },
  "#connect": { path: "/contact" },
};

export function HashRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    
    if (hash && hashRedirects[hash]) {
      const redirect = hashRedirects[hash];
      
      // Open external URL in new tab if specified
      if (redirect.externalUrl) {
        window.open(redirect.externalUrl, "_blank", "noopener,noreferrer");
      }
      
      // Navigate to the internal path
      navigate(redirect.path, { replace: true });
    }
  }, [location.hash, navigate]);

  return null;
}