<template>
  <div class="results-container">
    <div v-if="loading">Cargando resultados…</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <ul v-else>
      <li v-for="libro in libros" :key="libro.key" @click="openModal(libro)" class="result-item">
        {{ libro.title }}<span v-if="libro.author_name"> — {{ libro.author_name[0] }}</span>
      </li>
    </ul>
    <BookModal v-if="selectedBook" :book="selectedBook" @close="selectedBook = null" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BookModal from './BookModal.vue'

const props = defineProps({
  libros: Array,
  loading: Boolean,
  error: String
})

const selectedBook = ref(null)
function openModal(book) {
  selectedBook.value = book
}
</script>

<style scoped>
.result-item {
  cursor: pointer;
  transition: background 0.2s;
  padding: 0.3em 0.5em;
  border-radius: 6px;
}
.result-item:hover {
  background: #f8cccc;
}

.results-container {
  width: 800px;
  max-width: 90vw;
  height: 150px;
  overflow-y: auto;
  border: 2px solid #ccc;
  border-radius: 12px;
  padding: 1em;
  margin-top: 1em;
  box-shadow: 0 2px 8px #0001;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>