export type Status = 'New' | 'In Progress' | 'Waiting on Customer' | 'Done';
export type Priority = 'Low' | 'Medium' | 'High';
export type ToastType = 'status' | 'priority' | 'comment';

export type SortableColumn = 'title' | 'customer' | 'status' | 'priority' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface Comment {
  id: number;
  text: string;
  author: string;
  createdAt: string;
}

export interface SupportRequest {
  id: number;
  title: string;
  customer: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  lastCommentAt: string | null;
  tags: string[];
  comments: Comment[];
}

export interface AttentionResult {
  isNeedsAttention: boolean;
  reasons: string[];
}

export interface UrlSyncedState {
  searchQuery: string;
  statusFilter: Status | 'All';
  isAttentionMode: boolean;
  sortColumn: SortableColumn;
  sortDirection: SortDirection;
}
