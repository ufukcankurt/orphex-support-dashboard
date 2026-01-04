import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SupportRequest, Status, SortableColumn, SortDirection, Comment } from '../types';
import { PRIORITY_WEIGHTS, STATUS_WEIGHTS, DEFAULT_FILTERS } from '../constants';
import { generateMockData } from '../utils/mockData';
import { checkNeedsAttention } from '../utils/logic';

const STORAGE_KEY = 'orphex-requests-v1.0';
const DEFAULT_USER = 'Support Agent';
const FETCH_DELAY = 600;

export const useRequestStore = defineStore('requestStore', () => {
  const requests = ref<SupportRequest[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const isLoaded = ref<boolean>(false);

  const searchQuery = ref(DEFAULT_FILTERS.SEARCH);
  const statusFilter = ref<Status | 'All'>(DEFAULT_FILTERS.STATUS);
  const isAttentionMode = ref(DEFAULT_FILTERS.ATTENTION_MODE);
  const sortColumn = ref<SortableColumn>(DEFAULT_FILTERS.SORT_COLUMN as SortableColumn);
  const sortDirection = ref<SortDirection>(DEFAULT_FILTERS.SORT_DIRECTION);

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests.value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  };

  const fetchRequests = async (force = false) => {
    if (isLoaded.value && !force) return;

    isLoading.value = true;
    error.value = null;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        requests.value = JSON.parse(stored);
      } else {
        await new Promise((resolve) => setTimeout(resolve, FETCH_DELAY));
        requests.value = generateMockData(25);
        saveToStorage();
      }
      isLoaded.value = true;
    } catch (e) {
      error.value = 'Failed to load data. Please try again.';
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  const updateRequest = (updatedItem: SupportRequest) => {
    const index = requests.value.findIndex((r) => r.id === updatedItem.id);
    if (index !== -1) {
      requests.value[index] = {
        ...updatedItem,
        updatedAt: new Date().toISOString(),
      };
      saveToStorage();
    }
  };

  const addComment = (requestId: number, text: string) => {
    const req = requests.value.find((r) => r.id === requestId);
    if (!req) return;

    const newComment: Comment = {
      id: Date.now(),
      text,
      author: DEFAULT_USER,
      createdAt: new Date().toISOString(),
    };

    req.comments.push(newComment);
    req.lastCommentAt = newComment.createdAt;
    req.updatedAt = newComment.createdAt;

    if (req.status === 'New') req.status = 'In Progress';

    saveToStorage();
  };

  const toggleSort = (column: SortableColumn) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.value = column;
      sortDirection.value = column === 'createdAt' ? 'desc' : 'asc';
    }
  };

  const resetFilters = () => {
    searchQuery.value = DEFAULT_FILTERS.SEARCH;
    statusFilter.value = DEFAULT_FILTERS.STATUS;
    isAttentionMode.value = DEFAULT_FILTERS.ATTENTION_MODE;
  };

  const getRequestById = (id: number) => {
    return requests.value.find((r) => r.id === id);
  };

  const filteredRequests = computed(() => {
    let result = [...requests.value];

    if (isAttentionMode.value) {
      result = result.filter((req) => checkNeedsAttention(req).length > 0);
    } else if (statusFilter.value !== 'All') {
      result = result.filter((req) => req.status === statusFilter.value);
    }

    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (req) =>
          req.title.toLowerCase().includes(query) ||
          req.customer.toLowerCase().includes(query) ||
          req.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    result.sort((a, b) => {
      const modifier = sortDirection.value === 'asc' ? 1 : -1;

      if (sortColumn.value === 'priority') {
        return (PRIORITY_WEIGHTS[a.priority] - PRIORITY_WEIGHTS[b.priority]) * modifier;
      }
      if (sortColumn.value === 'status') {
        return (STATUS_WEIGHTS[a.status] - STATUS_WEIGHTS[b.status]) * modifier;
      }
      if (sortColumn.value === 'createdAt') {
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * modifier;
      }

      const valA = String(a[sortColumn.value] || '').toLowerCase();
      const valB = String(b[sortColumn.value] || '').toLowerCase();
      return valA.localeCompare(valB) * modifier;
    });

    return result;
  });

  const stats = computed(() => ({
    total: requests.value.length,
    visible: filteredRequests.value.length,
    attentionCount: requests.value.filter((r) => checkNeedsAttention(r).length > 0).length,
  }));

  return {
    requests,
    isLoading,
    error,
    searchQuery,
    statusFilter,
    isAttentionMode,
    sortColumn,
    sortDirection,
    filteredRequests,
    stats,
    getRequestById,
    toggleSort,
    fetchRequests,
    updateRequest,
    addComment,
    resetFilters,
  };
});
