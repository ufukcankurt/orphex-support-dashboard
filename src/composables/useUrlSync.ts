import { useRouter, useRoute } from 'vue-router';
import { watch } from 'vue';
import type { Status, UrlSyncedState } from '../types';
import { DEFAULT_FILTERS, QUERY_KEYS } from '../constants';

export function useUrlSync(store: UrlSyncedState, onFilterChange: () => void) {
  const router = useRouter();
  const route = useRoute();

  watch(
    () => route.query,
    (newQuery) => {
      const newSearch = (newQuery[QUERY_KEYS.SEARCH] as string) || DEFAULT_FILTERS.SEARCH;
      if (store.searchQuery !== newSearch) store.searchQuery = newSearch;

      const newStatus = (newQuery[QUERY_KEYS.STATUS] as Status | 'All') || DEFAULT_FILTERS.STATUS;
      if (store.statusFilter !== newStatus) store.statusFilter = newStatus;

      const newAttention = newQuery[QUERY_KEYS.ATTENTION] === 'true';
      if (store.isAttentionMode !== newAttention) store.isAttentionMode = newAttention;

      const newSort = (newQuery[QUERY_KEYS.SORT] as any) || DEFAULT_FILTERS.SORT_COLUMN;
      if (store.sortColumn !== newSort) store.sortColumn = newSort;

      const newDir = (newQuery[QUERY_KEYS.DIRECTION] as any) || DEFAULT_FILTERS.SORT_DIRECTION;
      if (store.sortDirection !== newDir) store.sortDirection = newDir;
    },
    { immediate: true }
  );

  watch(
    [
      () => store.searchQuery,
      () => store.statusFilter,
      () => store.isAttentionMode,
      () => store.sortColumn,
      () => store.sortDirection,
    ],
    () => {
      onFilterChange();

      router.replace({
        query: {
          ...route.query,
          [QUERY_KEYS.SEARCH]: store.searchQuery || undefined,
          [QUERY_KEYS.STATUS]: store.statusFilter === DEFAULT_FILTERS.STATUS ? undefined : store.statusFilter,
          [QUERY_KEYS.ATTENTION]: store.isAttentionMode ? 'true' : undefined,
          [QUERY_KEYS.SORT]: store.sortColumn === DEFAULT_FILTERS.SORT_COLUMN ? undefined : store.sortColumn,
          [QUERY_KEYS.DIRECTION]:
            store.sortDirection === DEFAULT_FILTERS.SORT_DIRECTION ? undefined : store.sortDirection,
        },
      });
    }
  );
}
