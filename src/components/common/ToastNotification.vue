<script setup lang="ts">
import { computed } from 'vue';
import type { ToastType } from '../../types';

const props = defineProps<{
  show: boolean;
  message: string;
  type: ToastType;
}>();

const containerClass = computed(() => {
  switch (props.type) {
    case 'status':
      return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'priority':
      return 'bg-amber-50 border-amber-200 text-amber-700';
    case 'comment':
      return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    default:
      return 'bg-slate-50 border-slate-200 text-slate-700';
  }
});

const iconContainerClass = computed(() => {
  switch (props.type) {
    case 'status':
      return 'bg-blue-100 text-blue-600';
    case 'priority':
      return 'bg-amber-100 text-amber-600';
    case 'comment':
      return 'bg-emerald-100 text-emerald-600';
    default:
      return 'bg-slate-100 text-slate-500';
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transform ease-out duration-400 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-[-8px]"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 sm:translate-x-[-8px]"
    >
      <div
        v-if="show"
        role="alert"
        aria-live="assertive"
        class="fixed bottom-5 left-5 z-[9999] flex items-center w-full max-w-xs p-3 rounded-xl shadow-md border"
        :class="containerClass"
      >
        <div
          class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full"
          :class="iconContainerClass"
          aria-hidden="true"
        >
          <span v-if="type === 'comment'" class="text-sm">💬</span>
          <span v-else-if="type === 'priority'" class="text-sm">🔥</span>
          <span v-else class="text-sm">🔄</span>
        </div>

        <div class="ml-3 text-sm font-medium">{{ message }}</div>
      </div>
    </Transition>
  </Teleport>
</template>
