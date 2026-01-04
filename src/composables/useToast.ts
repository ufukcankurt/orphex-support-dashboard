import { ref } from 'vue';
import type { ToastType } from '../types';

const show = ref(false);
const message = ref('');
const type = ref<ToastType>('status');

let timeoutId: number | undefined;

export function useToast() {
  const trigger = (msg: string, t: ToastType = 'status') => {
    if (timeoutId) clearTimeout(timeoutId);

    message.value = msg;
    type.value = t;
    show.value = true;

    timeoutId = setTimeout(() => {
      show.value = false;
    }, 4000);
  };

  return {
    show,
    message,
    type,
    trigger,
  };
}
