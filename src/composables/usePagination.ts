import { ref, computed, watch, type Ref } from 'vue';

export function usePagination<T>(list: Ref<T[]>, itemsPerPage: number | Ref<number> = 10) {
  const currentPage = ref(1);

  const pageSize = computed(() => {
    return typeof itemsPerPage === 'number' ? itemsPerPage : itemsPerPage.value;
  });

  const totalPages = computed(() => {
    if (list.value.length === 0) return 0;
    return Math.ceil(list.value.length / pageSize.value);
  });

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return list.value.slice(start, end);
  });

  watch(totalPages, (newTotalPages) => {
    if (newTotalPages === 0) {
      currentPage.value = 1;
    } else if (currentPage.value > newTotalPages) {
      currentPage.value = newTotalPages;
    }
  });

  const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
  };

  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
  };

  const resetPage = () => {
    currentPage.value = 1;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  return {
    currentPage,
    paginatedData,
    totalPages,
    nextPage,
    prevPage,
    resetPage,
    goToPage,
  };
}
