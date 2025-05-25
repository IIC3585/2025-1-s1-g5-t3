<template>
  <div class="search-wrapper">
    <div class="search-container">
      <div class="search-bar">
        <svg
          class="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <input
          class="search-input"
          type="text"
          :placeholder="searchType === 'book' ? 'Buscar libros...' : 'Buscar autores...'"
          v-model="searchQuery"
          @input="handleInput"
          @keyup.enter="emitSearch"
        />

        <select v-model="searchType" @change="emitFilterChange">
          <option value="book">Libro</option>
          <option value="author">Autor</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="loading">Buscando...</div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: String,
  filter: {
    type: String,
    default: 'book'
  }
})

const emit = defineEmits(['update:modelValue', 'update:filter', 'search'])

const searchQuery = ref(props.modelValue || '')
const searchType = ref(props.filter || 'book')
const isLoading = ref(false)
let searchTimeout = null

// Sincroniza cambios de prop con estado interno
watch(() => props.modelValue, val => {
  if (val !== searchQuery.value) searchQuery.value = val
})

watch(() => props.filter, val => {
  if (val !== searchType.value) searchType.value = val
})

// Emitir cambios externos
watch(searchQuery, val => emit('update:modelValue', val))
watch(searchType, val => emit('update:filter', val))

function performSearch() {
  if (!searchQuery.value.trim()) {
    isLoading.value = false
    emit('search')
    return
  }
  isLoading.value = true

  // Simulamos fetch con timeout para demo, reemplazar con fetch real si quieres
  setTimeout(() => {
    isLoading.value = false
    emit('search')
  }, 1000)
}

function handleInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    performSearch()
  }, 500)
}

function emitSearch() {
  clearTimeout(searchTimeout)
  performSearch()
}

function emitFilterChange() {
  emit('update:filter', searchType.value)
  if (searchQuery.value.trim()) {
    performSearch()
  }
}

onUnmounted(() => clearTimeout(searchTimeout))
</script>

<style scoped>
.search-wrapper {
  width: 100%;
}

.search-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}

.search-bar {
  position: relative;
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #5c4033;
  opacity: 0.7;
}

.search-input {
  flex: 1;
  padding: 1rem 1rem 1rem 3rem;
  font-size: 1.1rem;
  font-family: 'Poppins', sans-serif;
  color: #5c4033;
  background-color: #ffffff;
  border: 2px solid #f5f0e6;
  border-radius: 2rem;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #5c4033;
  opacity: 0.5;
}

.search-input:focus {
  border-color: #5c4033;
  box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.1);
}

select {
  padding: 0.75em 1em;
  font-size: 1.1em;
  border-radius: 8px;
  border: 2px solid #ccc;
  background: #fff;
  outline: none;
  transition: border 0.2s;
  color: #5c4033;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
}

select:focus {
  border-color: #5c4033;
  box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.1);
}

.loading {
  text-align: center;
  color: #5c4033;
  margin-top: 1rem;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .search-bar {
    max-width: 90%;
    flex-direction: column;
    gap: 0.75rem;
  }

  .search-input {
    font-size: 1rem;
    padding: 0.8rem 1rem 0.8rem 2.5rem;
  }

  .search-icon {
    left: 0.75rem;
  }
}
</style>
