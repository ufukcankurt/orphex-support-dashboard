import { describe, it, expect } from 'vitest';
import { checkNeedsAttention } from '../utils/logic';
import { createMockRequest } from './test-utils';

describe('Logic: Needs Attention Calculation', () => {
  it('returns empty if status is Done', () => {
    const req = createMockRequest({
      status: 'Done',
      priority: 'High',
      updatedAt: new Date(Date.now() - 864000000).toISOString(),
    });
    expect(checkNeedsAttention(req)).toEqual([]);
  });

  it('flags High Priority requests with no recent activity', () => {
    const req = createMockRequest({
      status: 'In Progress',
      priority: 'High',
      updatedAt: new Date(Date.now() - 432000000).toISOString(),
    });
    const result = checkNeedsAttention(req);
    expect(result).toContain('High Priority');
    expect(result).toContain('No recent activity');
  });

  it('ignores High Priority requests if activity is recent', () => {
    const req = createMockRequest({
      status: 'In Progress',
      priority: 'High',
      updatedAt: new Date().toISOString(),
    });
    expect(checkNeedsAttention(req)).toEqual([]);
  });

  it('flags Aging requests (>7 days) with no recent activity', () => {
    const tenDaysAgo = new Date(Date.now() - 864000000).toISOString();
    const req = createMockRequest({
      status: 'New',
      priority: 'Low',
      createdAt: tenDaysAgo,
      updatedAt: tenDaysAgo,
    });
    const result = checkNeedsAttention(req);
    expect(result).toContain('Aging Request');
    expect(result).toContain('No recent activity');
  });

  it('ignores standard Low priority requests', () => {
    const req = createMockRequest({
      status: 'New',
      priority: 'Low',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    expect(checkNeedsAttention(req)).toEqual([]);
  });
});
