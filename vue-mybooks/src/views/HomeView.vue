<template>
  <BookSearchContainer />
  <BookCarousel :books="books" />
</template>

<script setup>
  import BookSearchContainer from '../components/search/BookSearchContainer.vue'
  import BookCarousel from '../components/carousel/BookCarousel.vue'

  const books = [
  { key: 1, title: 'Libro 1', cover_i: 8231856 },
  { key: 2, title: 'Libro 2', cover_i: 8231857 },
  { key: 3, title: 'Libro 3', cover_i: 8231858 },
  { key: 4, title: 'Libro 4', cover_i: 8231859 },
  { key: 5, title: 'Libro 5', cover_i: 8231860 },
  { key: 6, title: 'Libro 6', cover_i: 8231861 }
]
</script>