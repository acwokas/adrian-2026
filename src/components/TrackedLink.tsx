import { Link, LinkProps, useNavigate } from "react-router-dom";
import { trackEvent } from "@/hooks/useAnalytics";
import { ReactNode, forwardRef, useCallback } from "react";

interface TrackedLinkProps extends LinkProps {
  eventName: string;
  children: ReactNode;
}

export function TrackedLink({ eventName, children, onClick, to, ...props }: TrackedLinkProps) {
  const navigate = useNavigate();
  
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackEvent({ eventType: 'click', eventName, eventData: { to: to.toString() } });
    onClick?.(e);
    navigate(to);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [eventName, onClick, navigate, to]);

  return (
    <Link {...props} to={to} onClick={handleClick}>
      {children}
    </Link>
  );
}

interface TrackedExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  eventName: string;
  children: ReactNode;
}

export const TrackedExternalLink = forwardRef<HTMLAnchorElement, TrackedExternalLinkProps>(
  ({ eventName, children, onClick, href, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      trackEvent({ eventType: 'external_link', eventName, eventData: { url: href } });
      onClick?.(e);
    };

    return (
      <a ref={ref} {...props} href={href} onClick={handleClick}>
        {children}
      </a>
    );
  }
);

TrackedExternalLink.displayName = "TrackedExternalLink";
