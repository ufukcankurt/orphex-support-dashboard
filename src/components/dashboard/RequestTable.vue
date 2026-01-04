<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useRequestStore } from '../../stores/requestStore';
import { checkNeedsAttention } from '../../utils/logic';
import type { SupportRequest } from '../../types';
import { TABLE_COLUMNS } from '../../constants';
import StatusBadge from '../common/StatusBadge.vue';

const store = useRequestStore();
const router = useRouter();

defineProps<{
  requests: SupportRequest[];
}>();

const navigateToDetail = (id: number) => {
  router.push(`/request/${id}`);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
</script>

<template>
  <div class="overflow-x-auto">
    <div v-if="store.error" class="p-12 text-center" role="alert">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-slate-900 mb-1">Something went wrong</h3>
      <p class="text-slate-500 mb-4">{{ store.error }}</p>
      <button
        @click="store.fetchRequests(true)"
        class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
      >
        Try Again ↻
      </button>
    </div>

    <div v-else-if="store.isLoading" class="p-12 text-center text-slate-500">
      <div
        class="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-indigo-600 rounded-full mb-2"
      ></div>
      <p>Loading requests...</p>
    </div>

    <div v-else-if="requests.length === 0" class="p-12 text-center text-slate-500">
      <p class="text-4xl mb-2">📭</p>
      <p>No requests found matching your filters.</p>
      <button
        v-if="store.searchQuery || store.statusFilter !== 'All'"
        @click="store.resetFilters"
        class="mt-4 text-indigo-600 hover:underline text-sm font-medium"
      >
        Clear filters
      </button>
    </div>

    <table v-else class="min-w-full text-left text-sm text-slate-600">
      <thead class="bg-slate-50 border-b border-slate-200">
        <tr>
          <th
            v-for="col in TABLE_COLUMNS"
            :key="col.key"
            scope="col"
            @click="store.toggleSort(col.key)"
            class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 hover:bg-slate-100 transition select-none group"
            :class="[col.align === 'right' ? 'text-right' : 'text-left', col.className]"
          >
            <div class="flex items-center gap-1" :class="{ 'justify-end': col.align === 'right' }">
              {{ col.label }}
              <span v-if="store.sortColumn === col.key" class="text-indigo-600 font-bold ml-1">
                {{ store.sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
              <span v-else class="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity ml-1"> ↕ </span>
            </div>
          </th>
        </tr>
      </thead>

      <tbody class="bg-white">
        <tr
          v-for="req in requests"
          :key="req.id"
          @click="navigateToDetail(req.id)"
          class="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 cursor-pointer transition-colors group"
        >
          <td class="px-6 py-4 align-top">
            <div class="font-medium text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
              {{ req.title }}
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in req.tags"
                :key="tag"
                class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200"
              >
                #{{ tag }}
              </span>
              <span
                v-for="reason in checkNeedsAttention(req)"
                :key="reason"
                class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-600 border border-red-100"
              >
                {{ reason }}
              </span>
            </div>
          </td>

          <td class="px-6 py-4 align-middle hidden md:table-cell">
            <div class="flex items-center gap-2">
              <div
                class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500"
              >
                {{ req.customer.charAt(0) }}
              </div>
              <span class="text-slate-700">{{ req.customer }}</span>
            </div>
          </td>

          <td class="px-6 py-4 align-middle">
            <StatusBadge :status="req.status" />
          </td>

          <td class="px-6 py-4 align-middle">
            <span
              :class="{
                'text-red-600 font-semibold': req.priority === 'High',
                'text-amber-600 font-medium': req.priority === 'Medium',
                'text-slate-500': req.priority === 'Low',
              }"
            >
              {{ req.priority }}
            </span>
          </td>

          <td class="px-6 py-4 align-middle text-right text-slate-400 whitespace-nowrap">
            {{ formatDate(req.createdAt) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
