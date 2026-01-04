import type { SupportRequest } from '../types';

export const createMockRequest = (overrides: Partial<SupportRequest> = {}): SupportRequest => {
  return {
    id: 1,
    title: 'Test Request',
    customer: 'Test User',
    status: 'New',
    priority: 'Low',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastCommentAt: null,
    tags: [],
    comments: [],
    ...overrides,
  };
};
