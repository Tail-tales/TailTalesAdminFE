<template>
    <div class="flex items-center">
        <div
        v-for="n in 5"
        :key="n"
        class="relative cursor-pointer"
        :class="{ 'cursor-default': readonly }"
        @click="!readonly ? setRating(calculateRatingValue(n, isHalf(n))) : () => {}"
        @mousemove="!readonly ? hoverRating = n : () => {}"
        @mouseleave="!readonly ? hoverRating = rating : () => {}"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2 Z"
            :fill="isFilled(n) ? 'gold' : '#cacaca'"
          />
        </svg>
      </div>
      <span class="ml-2 text-sm text-gray-600">{{ displayedRating }} / 5</span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  interface Props {
    initialRating?: number;
    readonly?: boolean;
  }
  
  const props = defineProps<Props>();
  
  const rating = ref(props.initialRating || 0);
  const hoverRating = ref(0);
  
  const displayedRating = computed(() => {
    return rating.value.toFixed(1);
  });
  
  const setRating = (value: number) => {
    rating.value = value;
  };
  
  const isHalf = (n: number): boolean => {
    return hoverRating.value === n && rating.value === n - 0.5;
  };
  
  const calculateRatingValue = (starIndex: number, isHalfHovering: boolean): number => {
    if (isHalfHovering) {
      return starIndex - 0.5;
    }
    return starIndex;
  };
  
  const isFilled = (starIndex: number): boolean => {
    return rating.value >= starIndex || hoverRating.value >= starIndex;
  };
  </script>
  
