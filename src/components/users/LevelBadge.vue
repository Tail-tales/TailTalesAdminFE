<template>
    <span
        :class="`relative inline-block px-3 py-1 font-semibold text-${levelColor}-900 leading-tight`"
    >
        <span
        aria-hidden
        :class="`absolute inset-0 bg-${levelColor}-200 opacity-50 rounded-full`"
        ></span>
        <span class="relative">{{ level }}</span>
    </span>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
level: {
    type: String,
    required: true,
},
levelColor: {
    type: String,
    required: true,
},
});
</script>