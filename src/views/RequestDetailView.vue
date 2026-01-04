<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRequestStore } from '../stores/requestStore';
import { useToast } from '../composables/useToast';
import RequestInfoCard from '../components/request/RequestInfoCard.vue';
import RequestChat from '../components/request/RequestChat.vue';

const props = defineProps<{
  id: number;
}>();

const router = useRouter();
const store = useRequestStore();
const toast = useToast();

const request = computed(() => store.getRequestById(props.id));

onMounted(async () => {
  if (store.requests.length === 0) {
    await store.fetchRequests();
  }
});

const handleUpdate = (field: 'status' | 'priority') => {
  if (request.value) {
    store.updateRequest(request.value);

    toast.trigger(
      `${field === 'status' ? 'Status' : 'Priority'} updated successfully.`,
      field === 'status' ? 'status' : 'priority'
    );
  }
};

const handleAddComment = (text: string) => {
  if (!request.value) return;

  store.addComment(props.id, text);
  toast.trigger('Comment posted successfully.', 'comment');
};
</script>

<template>
  <div
    v-if="store.isLoading"
    role="status"
    class="flex flex-col items-center justify-center min-h-[50vh] text-slate-500"
  >
    <svg
      class="animate-spin h-10 w-10 mb-4 text-indigo-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
    <span class="font-medium animate-pulse">Loading request details...</span>
  </div>

  <div v-else-if="!request" role="alert" class="flex flex-col items-center justify-center min-h-[50vh] text-center">
    <div class="text-6xl mb-6">😕</div>
    <h2 class="text-2xl font-bold text-slate-800 mb-2">Request Not Found</h2>
    <p class="text-slate-500 mb-8 max-w-md">
      The request you are looking for does not exist, has been removed, or you don't have permission to view it.
    </p>
    <button
      @click="router.push('/')"
      class="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm focus:ring-4 focus:ring-indigo-100"
    >
      Back to Dashboard
    </button>
  </div>

  <div v-else class="max-w-7xl mx-auto space-y-6 pb-20 fade-in">
    <div class="flex items-center">
      <button
        @click="router.back()"
        class="text-slate-500 hover:text-slate-900 transition flex items-center gap-2 group font-medium text-sm px-3 py-2 rounded-lg hover:bg-slate-100"
        aria-label="Go back"
      >
        <span aria-hidden="true" class="group-hover:-translate-x-1 transition-transform">←</span>
        Back to list
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div class="lg:col-span-2 space-y-6">
        <RequestInfoCard :request="request" @update="handleUpdate" />
      </div>

      <div class="space-y-4 lg:sticky lg:top-24">
        <RequestChat :comments="request.comments" @add-comment="handleAddComment" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
