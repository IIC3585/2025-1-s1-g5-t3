<template>
  <div class="recommendations-view">
    <h2>Recomendaciones para ti</h2>
    <RecommendationBlock
      v-for="book in topRatedBooks"
      :key="book.id"
      :book="book"
      :suggestions="getSuggestions(book.topic, book.id)"
    />
  </div>
</template>

<script setup>
import RecommendationBlock from '../components/recommendations/RecommendationBlock.vue'

const userBooks = [
  {
    id: 1,
    title: 'Harry Potter y la piedra filosofal',
    author: 'J.K. Rowling',
    topic: 'Fantasía',
    rating: 5,
    cover: 'https://covers.openlibrary.org/b/id/7984916-L.jpg'
  },
  {
    id: 2,
    title: 'El Hobbit',
    author: 'J.R.R. Tolkien',
    topic: 'Fantasía',
    rating: 4,
    cover: 'https://covers.openlibrary.org/b/id/6979861-L.jpg'
  },
  {
    id: 3,
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    topic: 'Realismo mágico',
    rating: 5,
    cover: 'https://covers.openlibrary.org/b/id/8372216-L.jpg'
  },
  {
    id: 4,
    title: 'Orgullo y prejuicio',
    author: 'Jane Austen',
    topic: 'Romance',
    rating: 2,
    cover: 'https://covers.openlibrary.org/b/id/8228691-L.jpg'
  }
]

// Libros ficticios para sugerencias por tema
const suggestedBooks = [
  // Fantasía
  {
    id: 10,
    title: 'Las crónicas de Narnia',
    author: 'C.S. Lewis',
    topic: 'Fantasía',
    cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg'
  },
  {
    id: 11,
    title: 'Eragon',
    author: 'Christopher Paolini',
    topic: 'Fantasía',
    cover: 'https://covers.openlibrary.org/b/id/8231857-L.jpg'
  },
  {
    id: 12,
    title: 'Percy Jackson y el ladrón del rayo',
    author: 'Rick Riordan',
    topic: 'Fantasía',
    cover: 'https://covers.openlibrary.org/b/id/8231858-L.jpg'
  },
  // Realismo mágico
  {
    id: 20,
    title: 'La casa de los espíritus',
    author: 'Isabel Allende',
    topic: 'Realismo mágico',
    cover: 'https://covers.openlibrary.org/b/id/8231859-L.jpg'
  },
  {
    id: 21,
    title: 'Pedro Páramo',
    author: 'Juan Rulfo',
    topic: 'Realismo mágico',
    cover: 'https://covers.openlibrary.org/b/id/8231860-L.jpg'
  },
  {
    id: 22,
    title: 'El otoño del patriarca',
    author: 'Gabriel García Márquez',
    topic: 'Realismo mágico',
    cover: 'https://covers.openlibrary.org/b/id/8231861-L.jpg'
  },
  // Romance
  {
    id: 30,
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    topic: 'Romance',
    cover: 'https://covers.openlibrary.org/b/id/8231862-L.jpg'
  },
  {
    id: 31,
    title: 'Anna Karenina',
    author: 'León Tolstói',
    topic: 'Romance',
    cover: 'https://covers.openlibrary.org/b/id/8231863-L.jpg'
  },
  {
    id: 32,
    title: 'Cumbres Borrascosas',
    author: 'Emily Brontë',
    topic: 'Romance',
    cover: 'https://covers.openlibrary.org/b/id/8231864-L.jpg'
  }
]

// Filtrar libros del usuario con rating 4 o 5, descendente
const topRatedBooks = userBooks
  .filter(b => b.rating >= 4)
  .sort((a, b) => b.rating - a.rating)

function getSuggestions(topic, excludeId) {
  return suggestedBooks
    .filter(b => b.topic === topic && b.id !== excludeId)
    .slice(0, 3)
}
</script>

<style scoped>
.recommendations-view {
  max-width: 900px;
  margin: 2em auto;
  padding: 1em;
}
</style>