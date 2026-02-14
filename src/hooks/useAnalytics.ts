import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

type EventType = 'click' | 'page_view' | 'cta_click' | 'external_link' | 'form_start' | 'form_submit';

interface TrackEventOptions {
  eventType: EventType;
  eventName: string;
  eventData?: Record<string, unknown>;
}

// Google Analytics helper
const sendToGA = (eventName: string, eventData?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as { gtag: (command: string, ...args: unknown[]) => void }).gtag('event', eventName, eventData);
  }
};

// GA4 Conversion Events - these should be marked as conversions in GA4 dashboard
const GA4_CONVERSION_EVENTS = {
  // Form submission - use GA4 recommended 'generate_lead' event
  form_submit: 'generate_lead',
  // Booking/scheduling clicks
  book_call: 'schedule_appointment',
  // Contact CTA clicks
  contact_cta: 'begin_checkout', // Maps to high-intent action
} as const;

// Send GA4 conversion event with enhanced parameters
const sendConversionToGA = (conversionType: keyof typeof GA4_CONVERSION_EVENTS, customData?: Record<string, unknown>) => {
  const eventName = GA4_CONVERSION_EVENTS[conversionType];
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as { gtag: (command: string, ...args: unknown[]) => void }).gtag('event', eventName, {
      currency: 'USD',
      value: conversionType === 'form_submit' ? 100 : conversionType === 'book_call' ? 150 : 50,
      ...customData,
    });
  }
};

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
    // Send to Google Analytics
    sendToGA(eventName, {
      event_category: eventType,
      page_path: window.location.pathname,
      ...eventData,
    });

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

  const trackClickWithPosition = (eventName: string, event: MouseEvent | React.MouseEvent, eventData?: Record<string, unknown>) => {
    const x = Math.round((event.clientX / window.innerWidth) * 100);
    const y = Math.round((event.clientY / window.innerHeight) * 100);
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    trackEvent({ 
      eventType: 'click', 
      eventName, 
      eventData: { 
        ...eventData, 
        clickPosition: { x, y, viewportWidth, viewportHeight },
        elementTag: (event.target as HTMLElement)?.tagName?.toLowerCase(),
        elementText: (event.target as HTMLElement)?.textContent?.slice(0, 50),
      } 
    });
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
    // Send GA4 conversion event for successful form submissions
    if (success) {
      sendConversionToGA('form_submit', { form_name: formName });
    }
  };

  const trackBookingClick = (source: string) => {
    trackEvent({ eventType: 'cta_click', eventName: 'book_call_click', eventData: { source } });
    sendConversionToGA('book_call', { booking_source: source });
  };

  const trackContactCTA = (source: string) => {
    trackEvent({ eventType: 'cta_click', eventName: 'contact_cta_click', eventData: { source } });
    sendConversionToGA('contact_cta', { cta_source: source });
  };

  const trackWhitepaperDownload = (source: string) => {
    trackEvent({ 
      eventType: 'cta_click', 
      eventName: 'whitepaper_download', 
      eventData: { source, file: 'edge-framework-whitepaper.pdf' } 
    });
  };

  return { 
    trackClick, 
    trackClickWithPosition, 
    trackCTAClick, 
    trackExternalLink, 
    trackPageView, 
    trackFormStart, 
    trackFormSubmit,
    trackBookingClick,
    trackContactCTA,
    trackWhitepaperDownload,
  };
};
