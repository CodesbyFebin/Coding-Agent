import { describe, it, expect } from 'vitest';
import { userFacingMessage } from '../lib/api';

// userFacingMessage is the boundary between raw interceptor errors and what
// the user reads. These tests pin its mapping so auth failures stay honest:
// credential errors surface the server's wording, but a missing backend
// never leaks "Request failed with status code 405" to the screen.
describe('userFacingMessage', () => {
  const withStatus = (message: string, status?: number, body?: unknown) => {
    const e = new Error(message) as Error & { status?: number; body?: unknown };
    if (status !== undefined) {e.status = status;}
    if (body !== undefined) {e.body = body;}
    return e;
  };

  it('surfaces the server message for a 401 credential error', () => {
    const e = withStatus('Request failed', 401, { message: 'Invalid email or password.' });
    expect(userFacingMessage(e, 'Login failed')).toBe('Invalid email or password.');
  });

  it("falls back to the error's own message when a 401 body has no message", () => {
    const e = withStatus('Invalid credentials', 401);
    expect(userFacingMessage(e, 'Login failed')).toBe('Invalid credentials');
  });

  it('maps a 405 (static host, no backend) to an honest unreachable message', () => {
    const e = withStatus('Request failed with status code 405', 405);
    expect(userFacingMessage(e, 'Login failed')).toBe(
      'Unable to reach the server. Please try again later.'
    );
  });

  it('maps a 404 to the unreachable message', () => {
    const e = withStatus('Request failed with status code 404', 404);
    expect(userFacingMessage(e, 'Login failed')).toBe(
      'Unable to reach the server. Please try again later.'
    );
  });

  it('maps a 503 to the unreachable message', () => {
    const e = withStatus('Service Unavailable', 503);
    expect(userFacingMessage(e, 'Login failed')).toBe(
      'Unable to reach the server. Please try again later.'
    );
  });

  it('maps a network error (status 0) to the unreachable message', () => {
    const e = withStatus('Network Error', 0);
    expect(userFacingMessage(e, 'Login failed')).toBe(
      'Unable to reach the server. Please try again later.'
    );
  });

  it('passes through a plain message with no status', () => {
    const e = withStatus('Invalid credentials');
    expect(userFacingMessage(e, 'Login failed')).toBe('Invalid credentials');
  });

  it('uses the fallback when nothing else applies', () => {
    const e = withStatus('');
    expect(userFacingMessage(e, 'Registration failed')).toBe('Registration failed');
  });
});
