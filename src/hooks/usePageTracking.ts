import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "@/hooks/useAnalytics";

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const pageName = location.pathname === "/" ? "home" : location.pathname.slice(1).replace(/\//g, "_");
    trackEvent({ 
      eventType: "page_view", 
      eventName: pageName,
      eventData: { 
        path: location.pathname,
        search: location.search,
        hash: location.hash 
      }
    });
  }, [location.pathname]);
}
