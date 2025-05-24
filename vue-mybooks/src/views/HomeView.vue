<template>
  <BookSearchContainer />
  <div class="carousel-section">
    <h2>Mis colecciones</h2>
    <div class="carousel-selector">
      <button
        v-for="option in options"
        :key="option.key"
        :class="{ active: selectedList === option.key }"
        @click="selectedList = option.key"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BookSearchContainer from '../components/search/BookSearchContainer.vue'
import BookCarousel from '../components/carousel/BookCarousel.vue'
import { useBookLists } from '../composables/useBookLists'
import { useRouter } from 'vue-router'
import eventBus from '../utils/eventBus'

const { readBooks, recommendedBooks, wantToReadBooks } = useBookLists()
const router = useRouter()

const options = [
  { key: 'read', label: 'Leídos' },
  { key: 'recommended', label: 'Recomendados' },
  { key: 'want', label: 'Quiero leer' }
]
const selectedList = ref('read')

const currentBooks = computed(() => {
  if (selectedList.value === 'read') return readBooks.books.value
  if (selectedList.value === 'recommended') return recommendedBooks.books.value
  if (selectedList.value === 'want') return wantToReadBooks.books.value
  return []
})

function goToBook(book) {
  window.open(`https://openlibrary.org${book.key}`, '_blank')
}

// Auto-cambiar a la lista donde se añadió un libro
function handleBookAdded(event) {
  // Cambiar automáticamente a la lista donde se añadió el libro
  selectedList.value = event.listName
}

// Configurar los listeners de eventos
onMounted(() => {
  eventBus.on('book-added', handleBookAdded)
})

onUnmounted(() => {
  eventBus.off('book-added', handleBookAdded)
})
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