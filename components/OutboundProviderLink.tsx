'use client';

import type { ReactNode } from 'react';
import posthog from 'posthog-js';
import { outboundClickProperties, type OutboundPlacement } from '@/lib/analytics';

// A provider link on a server-rendered page that still reports `affiliate_click`. The anchor it
// renders is the same one the pages had before (same href, target, rel and classes), so the HTML
// that crawlers see does not change; only the click handler is new.
export function OutboundProviderLink({
  href,
  rel,
  className,
  placement,
  provider,
  isAffiliate,
  corridor,
  children,
}: {
  href: string;
  rel: string;
  className: string;
  placement: OutboundPlacement;
  provider: { slug: string; name: string };
  isAffiliate: boolean;
  corridor?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel={rel}
      className={className}
      onClick={() =>
        posthog.capture('affiliate_click', outboundClickProperties(placement, provider, isAffiliate, corridor))
      }
    >
      {children}
    </a>
  );
}
