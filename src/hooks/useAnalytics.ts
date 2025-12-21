import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

type EventType = 'click' | 'page_view' | 'cta_click' | 'external_link' | 'form_start' | 'form_submit';

interface TrackEventOptions {
  eventType: EventType;
  eventName: string;
  eventData?: Record<string, unknown>;
}

interface LocationData {
  country: string;
  countryCode: string;
  region: string | null;
  city: string | null;
}

// Cache location data to avoid repeated API calls
let cachedLocation: LocationData | null = null;
let locationFetchPromise: Promise<LocationData> | null = null;

const getVisitorLocation = async (): Promise<LocationData> => {
  if (cachedLocation) return cachedLocation;
  
  if (locationFetchPromise) return locationFetchPromise;
  
  locationFetchPromise = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-visitor-location');
      if (error) throw error;
      cachedLocation = data as LocationData;
      return cachedLocation;
    } catch (error) {
      console.error('Failed to get location:', error);
      cachedLocation = { country: 'Unknown', countryCode: 'XX', region: null, city: null };
      return cachedLocation;
    }
  })();
  
  return locationFetchPromise;
};

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
    const location = await getVisitorLocation();
    
    await supabase.from('analytics_events').insert({
      event_type: eventType as 'click' | 'page_view' | 'cta_click' | 'external_link',
      event_name: eventName,
      event_data: { ...eventData, location } as unknown as Json,
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

  const trackFormStart = (formName: string) => {
    trackEvent({ eventType: 'form_start', eventName: `${formName}_start` });
  };

  const trackFormSubmit = (formName: string, success: boolean) => {
    trackEvent({ eventType: 'form_submit', eventName: `${formName}_submit`, eventData: { success } });
  };

  return { trackClick, trackCTAClick, trackExternalLink, trackPageView, trackFormStart, trackFormSubmit };
};
