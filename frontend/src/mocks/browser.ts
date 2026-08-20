import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configured as onUnhandledRequest: 'bypass' so real network requests for
// static assets, HMR, etc. are not blocked. Mock handlers only intercept
// the API endpoints declared in handlers.ts.
export const worker = setupWorker(...handlers);
