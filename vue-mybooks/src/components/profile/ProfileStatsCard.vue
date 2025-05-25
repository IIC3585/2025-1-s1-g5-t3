<template>
  <div class="stats-card">
    <h3>Estadísticas</h3>
    <ul>
      <li>Total de libros leídos: <b>{{ totalLibrosLeidos }}</b></li>
      <li>Autor favorito: <b>{{ autorFavorito || 'Sin datos suficientes' }}</b></li>
      <li>Género favorito: <b>{{ generoFavorito || 'Sin datos suficientes' }}</b></li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useBookStore } from '../../stores/bookStore'

const bookStore = useBookStore()

// Total de libros leídos
const totalLibrosLeidos = computed(() => bookStore.readBooks.length)

// Autor favorito (el que más aparece en los libros leídos)
const autorFavorito = computed(() => {
  const autores = {}
  
  bookStore.readBooks.forEach(book => {
    if (book.author_name && book.author_name.length > 0) {
      const autor = book.author_name[0]
      autores[autor] = (autores[autor] || 0) + 1
    }
  })
  
  // Encontrar el autor que más aparece
  let maxCount = 0
  let favorito = null
  
  Object.entries(autores).forEach(([autor, count]) => {
    if (count > maxCount) {
      maxCount = count
      favorito = autor
    }
  })
  
  return favorito
})

// Género favorito usando book.subjects
const generoFavorito = computed(() => {
  // Si no hay libros, no calcular nada
  if (bookStore.readBooks.length === 0) return null
  
  const generos = {}
  
  // Usamos book.subjects (con s al final)
  bookStore.readBooks.forEach(book => {
    if (book.subjects && Array.isArray(book.subjects) && book.subjects.length > 0) {
      const genero = book.subjects[0]
      generos[genero] = (generos[genero] || 0) + 1
    } else {
      // Si no hay subjects, usamos la primera palabra del título
      const primeraPalabra = book.title?.split(' ')[0] || 'Otros'
      generos[primeraPalabra] = (generos[primeraPalabra] || 0) + 1
    }
  })
  
  // Encontrar el género más repetido
  let maxCount = 0
  let favorito = null
  
  Object.entries(generos).forEach(([genero, count]) => {
    if (count > maxCount) {
      maxCount = count
      favorito = genero
    }
  })
  
  return favorito
})

// Depuración para ver la estructura real del libro
onMounted(() => {
  console.log("Todos los libros:", bookStore.readBooks)
  // Mostrar las claves de propiedades disponibles en el primer libro
  if (bookStore.readBooks.length > 0) {
    console.log("Propiedades disponibles:", Object.keys(bookStore.readBooks[0]))
    console.log("Subjects:", bookStore.readBooks[0].subjects)
  }
})
</script>

<style scoped>
.stats-card {
  background: #fff;
  border: 2px solid #ccc;
  border-radius: 20px;
  padding: 2em 1.5em;
  min-width: 320px;
  min-height: 230px; /* Reducida porque ahora tenemos menos elementos */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1.1em;
}
.stats-card h3 {
  margin-bottom: 1em;
  color: #a33;
}
.stats-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}
.stats-card li {
  margin-bottom: 1.2em;
  padding-bottom: 0.8em;
  border-bottom: 1px solid #f0f0f0;
}
.stats-card li:last-child {
  border-bottom: none;
}
</style>