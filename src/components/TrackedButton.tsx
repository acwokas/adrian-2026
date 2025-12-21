import { Button, ButtonProps } from "@/components/ui/button";
import { trackEvent } from "@/hooks/useAnalytics";
import { forwardRef } from "react";

interface TrackedButtonProps extends ButtonProps {
  eventName: string;
  eventData?: Record<string, unknown>;
  isCTA?: boolean;
}

export const TrackedButton = forwardRef<HTMLButtonElement, TrackedButtonProps>(
  ({ eventName, eventData, isCTA = false, onClick, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      trackEvent({ 
        eventType: isCTA ? 'cta_click' : 'click', 
        eventName, 
        eventData 
      });
      onClick?.(e);
    };

    return (
      <Button ref={ref} {...props} onClick={handleClick}>
        {children}
      </Button>
    );
  }
);

TrackedButton.displayName = "TrackedButton";
