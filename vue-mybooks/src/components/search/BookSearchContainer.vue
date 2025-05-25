<template>
  <div class="search-container">
    <SearchBar
      v-model="query"
      :filter="filter"
      @update:filter="filter = $event"
      @search="ejecutarBusqueda"
    />
    <BookResults :libros="libros" :loading="loading" :error="error" />
    <BookModal v-if="selectedBook" :book="selectedBook" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { buscarLibros } from '../../services/openLibrary'
import { useBookStore } from '../../stores/bookStore'
import SearchBar from './SearchBar.vue'
import BookResults from './BookResults.vue'
import BookModal from './BookModal.vue'

const query = ref('')
const filter = ref('all')
const libros = ref([])
const loading = ref(false)
const error = ref(null)

const bookStore = useBookStore()
const selectedBook = computed(() => bookStore.selectedBook)

function closeModal() {
  bookStore.closeBookModal()
}

async function ejecutarBusqueda() {
  if (!query.value.trim()) {
    error.value = 'Introduce un término de búsqueda válido.'
    return
  }
  loading.value = true
  error.value = null
  try {
    libros.value = await buscarLibros(query.value, filter.value)
  } catch (e) {
    error.value = 'Error al obtener datos de la API.'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2em;
  position: relative;
}
</style>