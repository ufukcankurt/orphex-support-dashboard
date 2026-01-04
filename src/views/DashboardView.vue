<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRequestStore } from '../stores/requestStore';
import { usePagination } from '../composables/usePagination';
import { useUrlSync } from '../composables/useUrlSync';
import { downloadRequestsAsCSV } from '../utils/export';

import DashboardChart from '../components/dashboard/DashboardChart.vue';
import DashboardFilters from '../components/dashboard/DashboardFilters.vue';
import RequestTable from '../components/dashboard/RequestTable.vue';
import PaginationControls from '../components/dashboard/PaginationControls.vue';

const store = useRequestStore();

const {
  currentPage,
  paginatedData: paginatedRequests,
  totalPages,
  nextPage,
  prevPage,
  resetPage,
} = usePagination(
  computed(() => store.filteredRequests),
  10
);

useUrlSync(store, () => resetPage());

onMounted(() => {
  store.fetchRequests();
});

const handleExport = () => {
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadRequestsAsCSV(store.filteredRequests, `orphex_requests_${dateStr}.csv`);
};
</script>

<template>
  <div class="space-y-6 pb-12">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Support Requests</h2>
        <p class="text-slate-500 text-sm">Manage and track customer tickets efficiently</p>
      </div>

      <button
        @click="handleExport"
        class="text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 shadow-sm px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
      >
        <span class="text-lg">📥</span>
        <span>Export CSV</span>
      </button>
    </div>

    <div v-if="store.error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
      <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      <span>{{ store.error }}</span>
      <button @click="store.fetchRequests(true)" class="text-sm underline hover:no-underline font-semibold ml-auto">
        Retry
      </button>
    </div>

    <DashboardChart />
    <DashboardFilters />

    <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <RequestTable :requests="paginatedRequests" :is-loading="store.isLoading" />

      <PaginationControls
        v-if="store.filteredRequests.length > 0 && !store.isLoading"
        class="border-t border-slate-200 bg-white"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-results="store.filteredRequests.length"
        :items-per-page="10"
        @next="nextPage"
        @prev="prevPage"
      />
    </div>
  </div>
</template>
