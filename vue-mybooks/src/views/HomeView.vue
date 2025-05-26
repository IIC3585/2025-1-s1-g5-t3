<template>
  <Hero />
  <BookSearchContainer />

  <div class="results-container">
    <!-- Mis libros leídos -->
    <section v-if="readBooks.length > 0" class="book-section">
      <h2 class="section-title">Mis libros leídos</h2>
      <BookCarousel
        :books="readBooks"
        @book-click="goToBook"
      />
    </section>

    <!-- Mis libros recomendados -->
    <section v-if="recommendedBooks.length > 0" class="book-section">
      <h2 class="section-title">Mis libros recomendados</h2>
      <BookCarousel
        :books="recommendedBooks"
        @book-click="goToBook"
      />
    </section>

    <!-- Libros que quiero leer -->
    <section v-if="wantToReadBooks.length > 0" class="book-section">
      <h2 class="section-title">Libros que quiero leer</h2>
      <BookCarousel
        :books="wantToReadBooks"
        @book-click="goToBook"
      />
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBookStore } from '../stores/bookStore'
import BookSearchContainer from '../components/search/BookSearchContainer.vue'
import BookCarousel from '../components/carousel/BookCarousel.vue'
import Hero from '../components/search/Hero.vue'

const bookStore = useBookStore()

const readBooks = computed(() => bookStore.readBooks)
const recommendedBooks = computed(() => bookStore.recommendedBooks)
const wantToReadBooks = computed(() => bookStore.wantToReadBooks)

function goToBook(book) {
  bookStore.openBookModal(book)
}
</script>

<style scoped>
.section-title {
  text-align: center;


  font-family: 'Poppins', sans-serif;
}
.results-container {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Poppins', sans-serif;
}

.book-section {
  margin-top: 3rem;
}

.section-title {
  color: #5c4033;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.4rem;
  margin-bottom: 1rem;
}
</style>
