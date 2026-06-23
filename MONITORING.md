# Analytics & Monitoring Setup Guide

## Google Analytics 4 (GA4)

### Setup
1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new GA4 property
3. Get your **Measurement ID** (format: G-XXXXXXXXXX)
4. Add to `frontend/.env`:
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### Events Tracked
- **Page Views**: Route/page navigations
- **Core Web Vitals**: `web_vitals` (`LCP`, `FID`, `CLS`)

## Sentry Error Tracking

### Setup
1. Go to [Sentry.io](https://sentry.io)
2. Create new projects (JavaScript for frontend, Node.js for backend)
3. Get your DSN for each project
4. Add to environment files:
   ```
   VITE_SENTRY_DSN=https://xxxxx@yyyyy.ingest.sentry.io/zzzzz (frontend)
   SENTRY_DSN=https://xxxxx@yyyyy.ingest.sentry.io/zzzzz (backend)
   ```

### Features
- Frontend runtime error capture
- Backend request/error capture
- Session replay on frontend errors
- Trace and profiling sampling

## Performance Monitoring

### Core Web Vitals Tracked
- **LCP** (Largest Contentful Paint): <= 2.5s
- **FID** (First Input Delay): <= 100ms
- **CLS** (Cumulative Layout Shift): <= 0.1

### Backend Monitoring
- API response times
- Slow request detection (> 1s)
- Sentry warning capture for slow requests

## Dashboards

### GA4 Dashboard
- [Real-time Overview](https://analytics.google.com)
- [Audience Insights](https://analytics.google.com)
- [Conversion Tracking](https://analytics.google.com)

### Sentry Dashboard
- [Issues Overview](https://sentry.io)
- [Performance Monitoring](https://sentry.io)
- [Release Health](https://sentry.io)
