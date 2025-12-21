import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface RecordedEvent {
  type: 'mouse' | 'click' | 'scroll' | 'navigation';
  timestamp: number;
  x?: number;
  y?: number;
  scrollX?: number;
  scrollY?: number;
  path?: string;
  target?: string;
}

const getSessionId = (): string => {
  const existingSessionId = sessionStorage.getItem('analytics_session_id');
  if (existingSessionId) return existingSessionId;
  
  const newSessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  sessionStorage.setItem('analytics_session_id', newSessionId);
  return newSessionId;
};

export function SessionRecorder() {
  const eventsRef = useRef<RecordedEvent[]>([]);
  const startTimeRef = useRef<number>(Date.now());
  const lastMouseMoveRef = useRef<number>(0);
  const currentPathRef = useRef<string>(window.location.pathname);
  const recordingIdRef = useRef<string | null>(null);

  const saveEvents = useCallback(async () => {
    if (eventsRef.current.length === 0) return;
    
    const sessionId = getSessionId();
    const events = [...eventsRef.current];
    eventsRef.current = [];

    try {
      if (!recordingIdRef.current) {
        // Create new recording
        const { data, error } = await supabase
          .from('session_recordings')
          .insert({
            session_id: sessionId,
            page_path: currentPathRef.current,
            events: events as unknown as Json,
            user_agent: navigator.userAgent,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
          })
          .select('id')
          .single();
        
        if (!error && data) {
          recordingIdRef.current = data.id;
        }
      } else {
        // Append to existing recording
        const { data: existing } = await supabase
          .from('session_recordings')
          .select('events')
          .eq('id', recordingIdRef.current)
          .single();
        
        if (existing) {
          const existingEvents = (existing.events as unknown as RecordedEvent[]) || [];
          await supabase
            .from('session_recordings')
            .update({ 
              events: [...existingEvents, ...events] as unknown as Json,
              ended_at: new Date().toISOString(),
            })
            .eq('id', recordingIdRef.current);
        }
      }
    } catch (error) {
      console.error('Error saving session recording:', error);
    }
  }, []);

  useEffect(() => {
    // Skip recording on admin pages
    if (window.location.pathname.startsWith('/admin')) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      // Throttle mouse moves to every 100ms
      if (now - lastMouseMoveRef.current < 100) return;
      lastMouseMoveRef.current = now;
      
      eventsRef.current.push({
        type: 'mouse',
        timestamp: now - startTimeRef.current,
        x: Math.round((e.clientX / window.innerWidth) * 100),
        y: Math.round((e.clientY / window.innerHeight) * 100),
      });
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      eventsRef.current.push({
        type: 'click',
        timestamp: Date.now() - startTimeRef.current,
        x: Math.round((e.clientX / window.innerWidth) * 100),
        y: Math.round((e.clientY / window.innerHeight) * 100),
        target: target.tagName?.toLowerCase(),
      });
    };

    const handleScroll = () => {
      eventsRef.current.push({
        type: 'scroll',
        timestamp: Date.now() - startTimeRef.current,
        scrollX: Math.round(window.scrollX),
        scrollY: Math.round(window.scrollY),
      });
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Save events periodically
    const saveInterval = setInterval(saveEvents, 5000);

    // Save events before unload
    const handleBeforeUnload = () => {
      saveEvents();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(saveInterval);
      saveEvents();
    };
  }, [saveEvents]);

  // Track navigation changes
  useEffect(() => {
    const path = window.location.pathname;
    if (path !== currentPathRef.current && !path.startsWith('/admin')) {
      eventsRef.current.push({
        type: 'navigation',
        timestamp: Date.now() - startTimeRef.current,
        path: path,
      });
      currentPathRef.current = path;
    }
  }, []);

  return null;
}
