<template>
  <div class="search-bar">
    <select v-model="selectedFilter">
      <option value="all">Todos</option>
      <option value="title">Título</option>
      <option value="author">Autor</option>
    </select>
    <input
      v-model="searchQuery"
      @keyup.enter="onSearch"
      :placeholder="placeholder"
    />
    <button @click="onSearch">Buscar</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  modelValue: String,
  filter: String,
  placeholder: { type: String, default: 'Escribe el título o autor' }
})
const emit = defineEmits(['update:modelValue', 'update:filter', 'search'])

const searchQuery = ref(props.modelValue || '')
const selectedFilter = ref(props.filter || 'all')

watch(searchQuery, val => emit('update:modelValue', val))
watch(selectedFilter, val => emit('update:filter', val))

function onSearch() {
  emit('search')
}
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 1em;
  justify-content: center;
  align-items: center;
}

input, select {
  padding: 0.75em 1em;
  font-size: 1.1em;
  border-radius: 8px;
  border: 2px solid #ccc;
  background: #fff;
  outline: none;
  transition: border 0.2s;
}

input:focus, select:focus {
  border: 2px solid #f8cccc;
}

button {
  padding: 0.75em 2em;
  font-size: 1.1em;
  border-radius: 8px;
  border: 2px solid #ccc;
  background: #fff;
  transition: background 0.2s;
  cursor: pointer;
}

button:hover {
  background: #f8cccc;
}
</style>