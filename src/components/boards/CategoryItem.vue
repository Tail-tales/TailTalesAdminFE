<template>
    <li class="ml-4 mt-2">
      <div class="group flex items-center justify-between bg-white border p-2 rounded hover:bg-gray-100">
        <div v-if="!isEditing" @dblclick="startEdit" class="flex items-center gap-1">
            <svg
                v-if="isRoot"
                class="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                />
            </svg>
            <span>{{ category.name }}</span>
        </div>
        <input
          v-else
          v-model="editName"
          @blur="confirmEdit"
          @keyup.enter.stop="confirmEdit"
          class="border px-1 rounded"
        />
  
        <div class="space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button @click="$emit('add', category.id)">추가</button>
          <button @click="startEdit">수정</button>
          <button @click="$emit('delete', category.id)">삭제</button>
        </div>
      </div>
  
      <ul>
        <draggable
          :list="category.children"
          item-key="id"
          group="categories"
          @update="$emit('reorder', category.id)"
        >
          <template #item="{ element }">
            <CategoryItem
              :category="element"
              @add="$emit('add', element.id)"
              @update="(id, name) => $emit('update', id, name)"
              @delete="$emit('delete', element.id)"
              @reorder="$emit('reorder', element.id)"
            />
          </template>
        </draggable>
      </ul>
    </li>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import draggable from 'vuedraggable'

  interface Category {
  id: number
  name: string
  children: Category[]
}
  
  const props = defineProps<{
    category: Category
    isRoot?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'add', id: number): void
    (e: 'update', id: number, name: string): void
    (e: 'delete', id: number): void
    (e: 'reorder', parentId: number): void
  }>()
  
  const isEditing = ref(false)
  const editName = ref(props.category.name)
  
  watch(() => props.category.name, (newName) => {
    editName.value = newName
  })
  
  function startEdit() {
    isEditing.value = true
  }
  
  function confirmEdit() {
    isEditing.value = false
    if (editName.value !== props.category.name) {
      console.log('자식 컴포넌트 - update 이벤트 발생:', props.category.id, editName.value);
      emit('update', props.category.id, editName.value)
    }
  }
  </script>
  