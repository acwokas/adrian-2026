import { Link, LinkProps } from "react-router-dom";
import { trackEvent } from "@/hooks/useAnalytics";
import { ReactNode } from "react";

interface TrackedLinkProps extends LinkProps {
  eventName: string;
  children: ReactNode;
}

export function TrackedLink({ eventName, children, onClick, ...props }: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEvent({ eventType: 'click', eventName, eventData: { to: props.to.toString() } });
    onClick?.(e);
  };

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}

interface TrackedExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  eventName: string;
  children: ReactNode;
}

export function TrackedExternalLink({ eventName, children, onClick, href, ...props }: TrackedExternalLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEvent({ eventType: 'external_link', eventName, eventData: { url: href } });
    onClick?.(e);
  };

  return (
    <a {...props} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
