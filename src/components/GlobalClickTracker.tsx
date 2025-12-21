import { useEffect } from "react";
import { trackEvent } from "@/hooks/useAnalytics";

export function GlobalClickTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Skip tracking for admin pages
      if (window.location.pathname.startsWith('/admin')) return;
      
      // Get click position as percentage of viewport
      const x = Math.round((event.clientX / window.innerWidth) * 100);
      const y = Math.round((event.clientY / window.innerHeight) * 100);
      
      // Get element info
      const elementTag = target.tagName?.toLowerCase() || 'unknown';
      const elementText = target.textContent?.slice(0, 50) || '';
      const elementId = target.id || undefined;
      const elementClass = target.className?.toString().slice(0, 100) || undefined;
      
      // Only track interactive elements or significant clicks
      const interactiveElements = ['a', 'button', 'input', 'select', 'textarea', 'label'];
      const isInteractive = interactiveElements.includes(elementTag) || 
                           target.closest('a, button') !== null ||
                           target.getAttribute('role') === 'button';
      
      if (isInteractive) {
        trackEvent({
          eventType: 'click',
          eventName: `click_${elementTag}`,
          eventData: {
            clickPosition: { 
              x, 
              y, 
              viewportWidth: window.innerWidth, 
              viewportHeight: window.innerHeight 
            },
            elementTag,
            elementText,
            elementId,
            elementClass,
          },
        });
      }
    };

    document.addEventListener('click', handleClick, { passive: true });
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
}
