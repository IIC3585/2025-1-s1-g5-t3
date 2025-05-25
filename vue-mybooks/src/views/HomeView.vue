<template>
  <BookSearchContainer />
  <div class="carousel-section">
    <h2>Mis colecciones</h2>
    <div class="carousel-selector">
      <button
        v-for="option in options"
        :key="option.key"
        :class="{ active: selectedList === option.key }"
        @click="setSelectedList(option.key)"
      >
        {{ option.label }}
      </button>
    </div>
    <BookCarousel :books="currentBooks" @book-click="goToBook" />
    <p v-if="currentBooks.length === 0" class="empty-list-help">
      Añade libros a tu lista usando el buscador de arriba
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStore } from '../stores/bookStore'
import BookSearchContainer from '../components/search/BookSearchContainer.vue'
import BookCarousel from '../components/carousel/BookCarousel.vue'

const router = useRouter()
const bookStore = useBookStore()

const options = [
  { key: 'read', label: 'Leídos' },
  { key: 'recommended', label: 'Recomendados' },
  { key: 'want', label: 'Quiero leer' }
]

// Usar el estado y getters del store
const selectedList = computed(() => bookStore.selectedList)
const currentBooks = computed(() => bookStore.currentBooks)

function setSelectedList(listName) {
  bookStore.setSelectedList(listName)
}

function goToBook(book) {
  bookStore.openBookModal(book)
}
</script>

<style scoped>
.carousel-section {
  margin-top: 3em;
}

.carousel-selector {
  display: flex;
  justify-content: center;
  gap: 1.5em;
  margin: 1em 0;
}

.carousel-selector button {
  padding: 0.7em 2em;
  border-radius: 8px;
  border: 2px solid #ccc;
  background: #fff;
  color: #222;
  font-size: 1.1em;
  cursor: pointer;
  transition: background 0.2s, border 0.2s, color 0.2s;
}

.carousel-selector button.active,
.carousel-selector button:hover {
  background: #f8cccc;
  border-color: #f8cccc;
  color: #a33;
}

.empty-list-help {
  text-align: center;
  color: #666;
  font-style: italic;
  margin-top: -1em;
}
</style>