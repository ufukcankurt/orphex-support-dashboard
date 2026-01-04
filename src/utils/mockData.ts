import type { SupportRequest, Comment } from '../types';
import { ALL_STATUSES, ALL_PRIORITIES } from '../constants';
import { REAL_NAMES, TITLES, TAGS_POOL, CUSTOMER_MESSAGES, AGENT_MESSAGES } from '../constants/mockData';

const getRandom = <T>(arr: T[] | readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateMockData = (count: number): SupportRequest[] => {
  const requests: SupportRequest[] = [];

  for (let i = 1; i <= count; i++) {
    const randomTitleBase = getRandom(TITLES);
    const randomName = getRandom(REAL_NAMES);
    const status = getRandom(ALL_STATUSES);
    const priority = getRandom(ALL_PRIORITIES);

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    const createdAtString = date.toISOString();

    const numTags = Math.floor(Math.random() * 3) + 1;
    const requestTags: string[] = [];
    for (let t = 0; t < numTags; t++) {
      const tag = getRandom(TAGS_POOL);
      if (!requestTags.includes(tag)) requestTags.push(tag);
    }

    const comments: Comment[] = [];
    let lastCommentAt: string | null = null;

    if (Math.random() > 0.4) {
      const numComments = Math.floor(Math.random() * 3) + 1;
      let lastDate = new Date(date);

      for (let c = 0; c < numComments; c++) {
        lastDate.setHours(lastDate.getHours() + 2);

        const isAgent = c % 2 !== 0;
        const author = isAgent ? 'Support Agent' : 'Customer';
        const messagePool = isAgent ? AGENT_MESSAGES : CUSTOMER_MESSAGES;

        comments.push({
          id: i * 1000 + c,
          text: getRandom(messagePool),
          author,
          createdAt: lastDate.toISOString(),
        });
      }
      lastCommentAt = lastDate.toISOString();
    }

    requests.push({
      id: i,
      title: `${randomTitleBase}`,
      customer: randomName,
      status,
      priority,
      createdAt: createdAtString,
      updatedAt: createdAtString,
      lastCommentAt,
      tags: requestTags,
      comments,
    });
  }

  // We explicitly add these specific records to validate the "Needs Attention" logic.
  // Since random generation might not cover all conditions, these hardcoded entries ensure we can test:
  const lastId = count;

  requests.push(
    {
      id: lastId + 1,
      title: 'Server Database Sync Error',
      customer: 'Thomas Anderson',
      status: 'New',
      priority: 'High',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      lastCommentAt: null,
      tags: ['server', 'urgent'],
      comments: [],
    },
    {
      id: lastId + 2,
      title: 'Mobile Login Timeout',
      customer: 'Sarah Connor',
      status: 'In Progress',
      priority: 'Low',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      lastCommentAt: null,
      tags: ['mobile', 'bug'],
      comments: [],
    },
    {
      id: lastId + 3,
      title: 'Billing Cycle Update',
      customer: 'Walter White',
      status: 'In Progress',
      priority: 'High',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
      lastCommentAt: new Date().toISOString(),
      tags: ['billing'],
      comments: [
        {
          id: 9999,
          text: 'I am checking the logs right now.',
          author: 'Support Agent',
          createdAt: new Date().toISOString(),
        },
      ],
    }
  );

  return requests;
};
