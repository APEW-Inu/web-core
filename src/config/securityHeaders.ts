import { IS_PRODUCTION } from '@/config/constants'

/**
 * CSP Header notes:
 * For safe apps we have to allow img-src * and frame-src *
 * connect-src * because the RPCs are configurable (config service)
 * style-src unsafe-inline for our styled components
 * script-src unsafe-eval is needed by next.js in dev mode, otherwise only self
 *            unsafe-inline is needed for gtm https://developers.google.com/tag-platform/tag-manager/web/csp
 * frame-ancestors can not be set via meta tag
 */
export const ContentSecurityPolicy = `
 default-src 'self';
 connect-src 'self' *;
 script-src 'self' https://www.google-analytics.com https://ssl.google-analytics.com 'unsafe-inline' https://*.getbeamer.com https://www.googletagmanager.com ${
   !IS_PRODUCTION ? "'unsafe-eval'" : ''
 };
 frame-src *;
 style-src 'self' 'unsafe-inline' https://*.getbeamer.com https://*.googleapis.com;
 font-src 'self' data:; 
 worker-src 'self' blob:;
 img-src * data:;
`
  .replace(/\s{2,}/g, ' ')
  .trim()

export const StrictTransportSecurity = 'max-age=31536000; includeSubDomains'
