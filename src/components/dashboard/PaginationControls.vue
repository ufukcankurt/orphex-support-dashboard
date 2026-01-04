<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
  totalResults: number;
  itemsPerPage: number;
}>();

defineEmits<{
  (e: 'next'): void;
  (e: 'prev'): void;
}>();
</script>

<template>
  <div
    class="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-b-xl"
  >
    <div class="text-sm text-slate-500">
      Showing
      <span class="font-medium text-slate-700">{{
        totalResults === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
      }}</span>
      to
      <span class="font-medium text-slate-700">{{ Math.min(currentPage * itemsPerPage, totalResults) }}</span>
      of
      <span class="font-medium text-slate-700">{{ totalResults }}</span>
      results
    </div>

    <div class="flex gap-2">
      <button
        @click="$emit('prev')"
        :disabled="currentPage === 1"
        class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
      >
        Previous
      </button>

      <button
        @click="$emit('next')"
        :disabled="currentPage === totalPages || totalPages === 0"
        class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
      >
        Next
      </button>
    </div>
  </div>
</template>
