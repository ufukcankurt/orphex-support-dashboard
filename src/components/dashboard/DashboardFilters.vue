<script setup lang="ts">
import { useRequestStore } from '../../stores/requestStore';
import { ALL_STATUSES } from '../../constants';

const store = useRequestStore();
</script>

<template>
  <div
    class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between transition-all"
  >
    <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <div class="relative w-full md:w-72">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        <label for="search-input" class="sr-only">Search requests</label>
        <input
          id="search-input"
          v-model="store.searchQuery"
          type="text"
          placeholder="Search title, customer or tag..."
          class="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
        />

        <button
          v-if="store.searchQuery"
          @click="store.searchQuery = ''"
          aria-label="Clear search"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-3.5 h-3.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="relative w-full sm:w-48">
        <label for="status-filter" class="sr-only">Filter by status</label>

        <select
          id="status-filter"
          v-model="store.statusFilter"
          :disabled="store.isAttentionMode"
          class="w-full appearance-none pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
        >
          <option value="All">All Statuses</option>
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

    <div
      class="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end border-slate-100"
    >
      <div class="flex items-center gap-2 cursor-pointer" @click="store.isAttentionMode = !store.isAttentionMode">
        <span class="text-sm font-medium text-slate-700 select-none">Needs Attention</span>

        <span
          v-if="store.stats.attentionCount > 0"
          class="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full"
        >
          {{ store.stats.attentionCount }}
        </span>
      </div>

      <button
        type="button"
        role="switch"
        :aria-checked="store.isAttentionMode"
        @click="store.isAttentionMode = !store.isAttentionMode"
        :class="store.isAttentionMode ? 'bg-red-500' : 'bg-slate-200'"
        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        <span class="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          :class="store.isAttentionMode ? 'translate-x-5' : 'translate-x-0'"
          class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        />
      </button>
    </div>
  </div>
</template>
