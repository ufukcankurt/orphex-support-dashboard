import type { SupportRequest } from '../types';

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export const checkNeedsAttention = (req: SupportRequest): string[] => {
  if (req.status === 'Done') return [];

  const now = new Date().getTime();
  const created = new Date(req.createdAt).getTime();

  const lastCommentTime = req.lastCommentAt ? new Date(req.lastCommentAt).getTime() : 0;
  const lastUpdateTime = new Date(req.updatedAt).getTime();
  const lastActivityTime = Math.max(lastUpdateTime, lastCommentTime);

  const daysSinceActivity = Math.floor((now - lastActivityTime) / ONE_DAY_MS);
  const daysSinceCreation = Math.floor((now - created) / ONE_DAY_MS);

  if (daysSinceActivity <= 3) return [];

  const isHighPriority = req.priority === 'High';
  const isAging = daysSinceCreation > 7;

  if (isHighPriority || isAging) {
    const reasons: string[] = [];

    if (isHighPriority) reasons.push('High Priority');
    if (isAging) reasons.push('Aging Request');

    reasons.push('No recent activity');

    return reasons;
  }

  return [];
};
