<template>
  <div class="results-container">
    <div v-if="loading">Cargando resultados…</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <ul v-else>
      <li v-for="libro in libros" :key="libro.key" @click="openModal(libro)" class="result-item">
        {{ libro.title }}<span v-if="libro.author_name"> — {{ libro.author_name[0] }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useBookStore } from '../../stores/bookStore'

const props = defineProps({
  libros: Array,
  loading: Boolean,
  error: String
})

const bookStore = useBookStore()

function openModal(book) {
  bookStore.openBookModal(book)
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

  border-radius: 12px;
  padding: 1em;
  margin-top: 1em;

}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>