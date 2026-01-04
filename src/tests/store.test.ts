import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';
import { useRequestStore } from '../stores/requestStore';
import { createMockRequest } from './test-utils';

describe('Store: Request Store Operations', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with empty state', () => {
    const store = useRequestStore();
    expect(store.requests).toEqual([]);
    expect(store.filteredRequests).toEqual([]);
  });

  it('filters requests by search query correctly', () => {
    const store = useRequestStore();

    store.requests = [
      createMockRequest({ id: 1, title: 'Apple Issue' }),
      createMockRequest({ id: 2, title: 'Banana Issue' }),
    ];

    store.searchQuery = 'Banana';
    expect(store.filteredRequests).toHaveLength(1);
    expect(store.filteredRequests[0]?.title).toBe('Banana Issue');
  });

  it('sorts requests by priority descending (High -> Low)', () => {
    const store = useRequestStore();

    store.requests = [
      createMockRequest({ id: 1, priority: 'Low' }),
      createMockRequest({ id: 2, priority: 'High' }),
      createMockRequest({ id: 3, priority: 'Medium' }),
    ];

    store.sortColumn = 'priority';
    store.sortDirection = 'desc';

    const sorted = store.filteredRequests;
    expect(sorted[0]?.priority).toBe('High');
    expect(sorted[1]?.priority).toBe('Medium');
    expect(sorted[2]?.priority).toBe('Low');
  });
});
