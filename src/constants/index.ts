import type { Priority, Status } from '../types';

export const ALL_STATUSES: Status[] = ['New', 'In Progress', 'Waiting on Customer', 'Done'];
export const ALL_PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

export const PRIORITY_WEIGHTS: Record<Priority, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

export const STATUS_WEIGHTS: Record<Status, number> = {
  New: 4,
  'Waiting on Customer': 3,
  'In Progress': 2,
  Done: 1,
};

export const TABLE_COLUMNS = [
  {
    key: 'title',
    label: 'Title',
    align: 'left',
    className: 'w-[45%] min-w-[200px]',
  },
  {
    key: 'customer',
    label: 'Customer',
    align: 'left',
    className: 'hidden md:table-cell w-[20%]',
  },
  {
    key: 'status',
    label: 'Status',
    align: 'left',
    className: 'w-[15%]',
  },
  {
    key: 'priority',
    label: 'Priority',
    align: 'left',
    className: 'w-[10%]',
  },
  {
    key: 'createdAt',
    label: 'Created',
    align: 'right',
    className: 'w-[10%] whitespace-nowrap',
  },
];

export const STATUS_COLORS: Record<Status, string> = {
  New: '#3b82f6',
  'In Progress': '#f59e0b',
  'Waiting on Customer': '#a855f7',
  Done: '#10b981',
};

export const DEFAULT_FILTERS = {
  SEARCH: '',
  STATUS: 'All' as const,
  ATTENTION_MODE: false,
  SORT_COLUMN: 'createdAt',
  SORT_DIRECTION: 'desc' as const,
};

export const QUERY_KEYS = {
  SEARCH: 'search',
  STATUS: 'status',
  ATTENTION: 'attention',
  SORT: 'sort',
  DIRECTION: 'dir',
};
