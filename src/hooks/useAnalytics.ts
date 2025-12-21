import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

type EventType = 'click' | 'page_view' | 'cta_click' | 'external_link';

interface TrackEventOptions {
  eventType: EventType;
  eventName: string;
  eventData?: Record<string, unknown>;
}

// Generate or retrieve session ID
const getSessionId = (): string => {
  const existingSessionId = sessionStorage.getItem('analytics_session_id');
  if (existingSessionId) {
    return existingSessionId;
  }
  
  const newSessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  sessionStorage.setItem('analytics_session_id', newSessionId);
  return newSessionId;
};

export const trackEvent = async ({ eventType, eventName, eventData = {} }: TrackEventOptions) => {
  try {
    const sessionId = getSessionId();
    
    await supabase.from('analytics_events').insert({
      event_type: eventType,
      event_name: eventName,
      event_data: eventData as Json,
      page_path: window.location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      session_id: sessionId,
    });
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
