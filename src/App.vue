<script setup lang="ts">
import Header from './components/common/Header.vue';
import ToastNotification from './components/common/ToastNotification.vue';
import { useToast } from './composables/useToast';

const { show, message, type } = useToast();
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900">
    <Header />

    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>

    <ToastNotification :show="show" :message="message" :type="type" />
  </div>
</template>
