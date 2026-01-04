<script setup lang="ts">
import { computed } from 'vue';
import type { Status } from '../../types';

const props = defineProps<{ status: Status }>();

const badgeStyles: Record<Status, string> = {
  New: 'bg-blue-50 text-blue-700 border-blue-200',
  'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
  'Waiting on Customer': 'bg-purple-50 text-purple-700 border-purple-200',
  Done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const colorClass = computed(() => badgeStyles[props.status] || 'bg-gray-50 text-gray-700 border-gray-200');
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors"
    :class="colorClass"
  >
    <span class="w-1.5 h-1.5 rounded-full bg-current opacity-60" aria-hidden="true"></span>

    {{ status }}
  </span>
</template>
