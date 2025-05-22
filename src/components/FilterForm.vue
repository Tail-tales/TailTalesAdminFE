<template>
  <div class="flex flex-col mt-3 sm:flex-row">
    <div class="flex">
      <div v-for="(filter, index) in filters" :key="index" class="relative">
        <select
          :id="'filter-'+index"
          class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border border-gray-400 rounded-l appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
          :value="filterValues[filter.key]"
          @change="updateFilterValue(filter.key, ($event.target as HTMLSelectElement)?.value)"
          >
          <option v-for="option in filter.options" :key="option" :value="option">{{ option }}</option>
        </select>

        <div
          class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
        >
          <svg
            class="w-4 h-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="relative block mt-2 sm:mt-0">
      <span class="absolute inset-y-0 left-0 flex items-center pl-2">
        <svg
          viewBox="0 0 24 24"
          class="w-4 h-4 text-gray-500 fill-current"
        >
          <path
            d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
          />
        </svg>
      </span>

      <input
        placeholder="Search"
        class="block w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded-l rounded-r appearance-none sm:rounded-l-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
        v-model="localSearchTerm"
        />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Filter {
  key: string;
  label?: string;
  placeholder?: string;
  options: string[];
}

interface Props {
  filters?: Filter[];
  searchTerm?: string;
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => [],
  searchTerm: '',
});


const emit = defineEmits(['update:filters', 'update:searchTerm']);

const filterValues = ref<{ [key: string]: string }>({});
const localSearchTerm = ref(props.searchTerm);


props.filters.forEach((filter) => {
  filterValues.value[filter.key] = filter.options[0] || '';
});

const updateFilterValue = (key: string, value: string) => {
  filterValues.value[key] = value;
  emit('update:filters', { ...filterValues.value });
};

watch(filterValues, (newFilterValues) => {
  emit('update:filters', newFilterValues);
}, { deep: true });

watch(localSearchTerm, (newSearchTerm) => {
  if (newSearchTerm !== props.searchTerm) {
    emit('update:searchTerm', newSearchTerm);
  }
});

watch(() => props.searchTerm, (newPropSearchTerm) => {
  if (newPropSearchTerm !== localSearchTerm.value) {
    localSearchTerm.value = newPropSearchTerm;
  }
});
</script>