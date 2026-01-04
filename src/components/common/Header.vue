<script setup lang="ts">
import { useRequestStore } from '../../stores/requestStore';

const store = useRequestStore();

const handleLogoClick = () => {
  store.resetFilters();
};
</script>

<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" @click="handleLogoClick" class="flex items-center gap-3 group focus:outline-none">
        <div
          class="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-lg shadow-sm group-hover:bg-indigo-700 transition-colors"
        >
          <span class="font-bold text-lg leading-none">O</span>
        </div>

        <div class="flex flex-col">
          <span
            class="text-xl font-bold text-slate-800 tracking-tight leading-none group-hover:text-indigo-600 transition-colors"
          >
            Orphex
          </span>
          <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider leading-none mt-1">
            Support Dashboard
          </span>
        </div>
      </router-link>
    </div>
  </header>
</template>
