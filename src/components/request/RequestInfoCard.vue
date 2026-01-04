<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ALL_STATUSES, ALL_PRIORITIES } from '../../constants';
import type { SupportRequest } from '../../types';

const props = defineProps<{
  request: SupportRequest;
}>();

const emit = defineEmits<{
  (e: 'update', field: 'status' | 'priority'): void;
}>();

const router = useRouter();

const formatDateTime = (isoString: string) => {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const searchTag = (tag: string) => {
  router.push({ path: '/', query: { search: tag } });
};
</script>

<template>
  <section class="bg-white p-6 rounded-xl shadow-sm border border-slate-200" aria-labelledby="request-title">
    <div class="mb-2">
      <h2 id="request-title" class="text-2xl font-bold text-slate-800 leading-tight">
        {{ request.title }}
        <span class="text-slate-400 font-normal ml-2 text-xl">#{{ request.id }}</span>
      </h2>
    </div>

    <div class="flex items-center gap-2 text-slate-500 text-sm mb-6">
      <span class="font-medium text-slate-600">{{ request.customer }}</span>
      <span aria-hidden="true" class="text-slate-300">•</span>
      <time :datetime="request.createdAt">{{ formatDateTime(request.createdAt) }}</time>
    </div>

    <div class="flex flex-wrap gap-2 mb-8" role="group" aria-label="Request Tags">
      <button
        v-for="tag in request.tags"
        :key="tag"
        @click="searchTag(tag)"
        class="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md hover:bg-slate-200 hover:text-slate-900 transition cursor-pointer border border-transparent hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        :aria-label="`Filter by tag ${tag}`"
      >
        #{{ tag }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-xl border border-slate-100">
      <div>
        <label for="status-select" class="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide"
          >Status</label
        >
        <div class="relative">
          <select
            id="status-select"
            v-model="request.status"
            @change="emit('update', 'status')"
            class="w-full appearance-none bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block p-2.5 pr-10 transition-all cursor-pointer font-medium"
          >
            <option v-for="status in ALL_STATUSES" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label for="priority-select" class="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide"
          >Priority</label
        >
        <div class="relative">
          <select
            id="priority-select"
            v-model="request.priority"
            @change="emit('update', 'priority')"
            class="w-full appearance-none bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block p-2.5 pr-10 transition-all cursor-pointer font-medium"
          >
            <option v-for="priority in ALL_PRIORITIES" :key="priority" :value="priority">
              {{ priority }}
            </option>
          </select>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
