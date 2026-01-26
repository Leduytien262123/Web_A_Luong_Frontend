<script setup>
const { totalPages, currentPage, pageSizeOptions, defaultPageSize } =
  defineProps({
    total: {
      type: Number,
      default: 0,
    },
    totalPages: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 0,
    },
    pageSizeOptions: {
      type: Array,
      default: () => [10, 20, 30],
    },
    defaultPageSize: {
      type: Number,
      default: 10,
    },
    unit: {
      type: String,
      default: "",
    },
  });

const selectedItem = ref(defaultPageSize);
</script>

<template>
  <div class="text-secondary">
    <div
      class="flex flex-col sm:flex-row flex-wrap sm:items-center justify-start"
      :class="totalPages === 0 ? 'hidden' : 'block'"
    >
      <div class="inline-block text-center md:text-left mr-1">
        <span>Tổng cộng</span>
        <span v-if="total > 0" class="mx-2">{{ total }}</span>
        <span>{{ unit }}</span>
      </div>
      <div class="flex flex-wrap items-center justify-center">
        <button
          :disabled="currentPage === 1"
          class="flex items-center text-[#4E4E4E] text-sm justify-center w-7 h-7 bg-[#F2F2F2] rounded-md m-1.5 page-item"
          @click="$emit('onChangePage', currentPage - 1)"
        >
          <BackItem />
        </button>
        <template v-for="pageNumber in totalPages" :key="pageNumber">
          <button
            v-if="
              totalPages <= 6 ||
              pageNumber === 1 ||
              pageNumber === totalPages ||
              pageNumber === currentPage ||
              pageNumber === currentPage - 1 ||
              pageNumber === currentPage + 1 ||
              (currentPage < 1 + 4 && pageNumber <= 1 + 4) ||
              (currentPage > totalPages - 4 && pageNumber >= totalPages - 4)
            "
            :disabled="pageNumber === currentPage"
            class="flex items-center text-[#4E4E4E] text-sm justify-center w-7 h-7 bg-[#F2F2F2] rounded-md m-1.5 page-item"
            :class="pageNumber === currentPage ? 'text-white bg-[#b68258]' : ''"
            @click="$emit('onChangePage', pageNumber)"
          >
            {{ pageNumber }}
          </button>
          <button
            v-else-if="
              (totalPages > 6 && pageNumber === currentPage - 2) ||
              pageNumber === currentPage + 2 ||
              (currentPage < 1 + 4 && pageNumber === 1 + 4 + 1) ||
              (currentPage > totalPages - 4 &&
                pageNumber === totalPages - 4 - 1)
            "
            class="flex items-center text-[#4E4E4E] text-sm justify-center w-7 h-7 bg-[#F2F2F2] rounded-md m-1.5 page-item"
            @click="$emit('onChangePage', pageNumber)"
          >
            <span>...</span>
          </button>
        </template>
        <button
          :disabled="currentPage === totalPages"
          class="flex items-center text-[#4E4E4E] text-sm justify-center w-7 h-7 bg-[#F2F2F2] rounded-md m-1.5 page-item"
          @click="$emit('onChangePage', currentPage + 1)"
        >
          <DropRightMenu />
        </button>

        <select
          v-model="selectedItem"
          class="py-[1px] ml-1 pl-3 pr-4 rounded-md border min-w-[112px] max-w-[112px] border-gray-200 focus:outline-none appearance-none"
          @change="$emit('onChangePageSize', selectedItem)"
        >
          <option
            v-for="item in pageSizeOptions"
            :key="item"
            :value="item"
            class="text-base"
          >
            {{ item }} / trang
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-item:hover {
  background: #f0dac8;
  color: #b68258;
}
</style>
