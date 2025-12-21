import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";

type EventType = Database['public']['Enums']['event_type'];

interface TrackEventOptions {
  eventType: EventType;
  eventName: string;
  eventData?: Record<string, unknown>;
}

export const trackEvent = async ({ eventType, eventName, eventData = {} }: TrackEventOptions) => {
  try {
    const insertData: Database['public']['Tables']['analytics_events']['Insert'] = {
      event_type: eventType,
      event_name: eventName,
      event_data: eventData as Json,
      page_path: window.location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    };
    
    await supabase.from('analytics_events').insert(insertData);
  } catch (error) {
    // Silently fail - don't break UX for analytics
    console.error('Analytics error:', error);
  }
};

export const useAnalytics = () => {
  const trackClick = (eventName: string, eventData?: Record<string, unknown>) => {
    trackEvent({ eventType: 'click', eventName, eventData });
  };

  const trackCTAClick = (eventName: string, eventData?: Record<string, unknown>) => {
    trackEvent({ eventType: 'cta_click', eventName, eventData });
  };

  const trackExternalLink = (eventName: string, url: string) => {
    trackEvent({ eventType: 'external_link', eventName, eventData: { url } });
  };

  const trackPageView = (pageName: string) => {
    trackEvent({ eventType: 'page_view', eventName: pageName });
  };

  return { trackClick, trackCTAClick, trackExternalLink, trackPageView };
};
