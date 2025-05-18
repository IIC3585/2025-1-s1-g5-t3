<template>
  <div>
    <h2>Buscar libros</h2>

    <div class="search-bar">
      <input
        v-model="query"
        @keyup.enter="ejecutarBusqueda"
        placeholder="Escribe el título o autor"
      />
      <button @click="ejecutarBusqueda">Buscar</button>
    </div>

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
import { ref } from 'vue'
import { buscarLibros } from '../services/openLibrary'

const query = ref('')
const libros = ref([])
const loading = ref(false)
const error = ref(null)

async function ejecutarBusqueda() {
  if (!query.value.trim()) {
    error.value = 'Introduce un término de búsqueda válido.'
    return
  }

  loading.value = true
  error.value = null

  try {
    libros.value = await buscarLibros(query.value)
  } catch (e) {
    error.value = 'Error al obtener datos de la API.'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 1em;
  display: flex;
  gap: 0.5em;
}

.search-bar input {
  flex: 1;
  padding: 0.5em;
  font-size: 1em;
}

.search-bar button {
  padding: 0.5em 1em;
  font-size: 1em;
  cursor: pointer;
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


