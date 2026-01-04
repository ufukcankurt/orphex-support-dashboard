<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue';
import type { SupportRequest } from '../../types';

const props = defineProps<{
  comments: SupportRequest['comments'];
}>();

const emit = defineEmits<{
  (e: 'add-comment', text: string): void;
}>();

const newCommentText = ref('');
const isSubmitting = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

const handleSubmit = async () => {
  if (!newCommentText.value.trim()) return;

  isSubmitting.value = true;

  emit('add-comment', newCommentText.value);
  await new Promise((r) => setTimeout(r, 600));

  newCommentText.value = '';
  isSubmitting.value = false;
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const formatDateTime = (isoString: string) => {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

watch(
  () => props.comments.length,
  () => {
    scrollToBottom();
  }
);

onMounted(() => {
  scrollToBottom();
});
</script>

<template>
  <section
    class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-[600px] flex flex-col"
    aria-labelledby="chat-heading"
  >
    <h3 id="chat-heading" class="font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Internal Comments</h3>

    <ul
      ref="chatContainer"
      class="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 list-none m-0 p-0 scroll-smooth"
      role="list"
    >
      <li v-if="comments.length === 0" class="text-center text-slate-400 text-sm mt-10">No comments yet.</li>

      <li
        v-for="comment in comments"
        :key="comment.id"
        class="flex flex-col"
        :class="comment.author === 'Support Agent' ? 'items-end' : 'items-start'"
      >
        <div
          class="max-w-[85%] p-3 rounded-xl text-sm shadow-sm"
          :class="
            comment.author === 'Support Agent'
              ? 'bg-indigo-50 text-indigo-900 rounded-br-none border border-indigo-100'
              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
          "
        >
          <p>{{ comment.text }}</p>
        </div>
        <span class="text-[10px] text-slate-400 mt-1 px-1">
          {{ comment.author }} • <time :datetime="comment.createdAt">{{ formatDateTime(comment.createdAt) }}</time>
        </span>
      </li>
    </ul>

    <div class="pt-2 border-t border-slate-100">
      <label for="comment-input" class="sr-only">Add an internal note</label>

      <textarea
        id="comment-input"
        v-model="newCommentText"
        @keydown="handleKeydown"
        placeholder="Add an internal note..."
        class="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none h-20 mb-2"
      ></textarea>

      <button
        @click="handleSubmit"
        :disabled="isSubmitting || !newCommentText.trim()"
        class="w-full bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span
          v-if="isSubmitting"
          class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
          aria-hidden="true"
        ></span>
        {{ isSubmitting ? 'Sending...' : 'Send Comment' }}
      </button>
    </div>
  </section>
</template>
