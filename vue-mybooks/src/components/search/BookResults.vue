<template>
  <div class="results-container">
    <div v-if="loading">Cargando resultados…</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <ul v-else>
      <li v-for="libro in libros" :key="libro.key">
        {{ libro.title }}<span v-if="libro.author_name"> — {{ libro.author_name[0] }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  libros: Array,
  loading: Boolean,
  error: String
})
</script>

<style scoped>
.results-container {
  width: 800px;
  max-width: 90vw;
  height: 150px;
  overflow-y: auto;
  border: 2px solid #ccc;
  border-radius: 12px;
  padding: 1em;
  margin-top: 1em;
  background: #fff;
  box-shadow: 0 2px 8px #0001;
}
.error {
  color: red;
  margin-bottom: 1em;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 0.75em;
}
</style>