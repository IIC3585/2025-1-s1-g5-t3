<template>
  <div class="carousel-container">
    <button class="arrow" @click="prev" :disabled="startIndex === 0">&#8592;</button>
    <div class="carousel" :class="{ highlight: isHighlighted }">
      <div class="books-container">
        <BookCard
          v-for="(book, idx) in visibleBooks"
          :key="book.key || idx"
          :title="book.title || 'Sin título'"
          :cover-id="book.cover_i"
          @click="handleClick(book)"
          class="book-item"
        />
        <div v-if="books.length === 0" class="empty-message">
          No hay libros en esta lista todavía
        </div>
      </div>
    </div>
    <button class="arrow" @click="next" :disabled="startIndex + visibleCount >= books.length">&#8594;</button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import BookCard from './BookCard.vue'
import eventBus from '../../utils/eventBus'

const props = defineProps({
  books: {
    type: Array,
    required: true,
    default: () => []
  }
})
const emit = defineEmits(['book-click'])

const visibleCount = 3
const startIndex = ref(0)
const isHighlighted = ref(false)

// Importante: Observar cambios en la lista de libros
watch(() => props.books, () => {
  // Resetear al principio cuando cambia la lista
  startIndex.value = 0
  highlightCarousel()
}, { deep: true })

const visibleBooks = computed(() =>
  props.books.slice(startIndex.value, startIndex.value + visibleCount)
)

function prev() {
  if (startIndex.value > 0) startIndex.value--
}

function next() {
  if (startIndex.value + visibleCount < props.books.length) startIndex.value++
}

function handleClick(book) {
  emit('book-click', book)
}

// Escuchar cuando se añade un libro para animar el carrusel
function highlightCarousel() {
  isHighlighted.value = true
  setTimeout(() => {
    isHighlighted.value = false
  }, 1000)
}

onMounted(() => {
  eventBus.on('book-added', highlightCarousel)
})

onUnmounted(() => {
  eventBus.off('book-added', highlightCarousel)
})
</script>

<style scoped>
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2em auto;
  max-width: 900px;
  padding: 1em 0;
}

.carousel {
  width: 420px; /* Ancho fijo para 3 libros */
  overflow: hidden;
  background: #f8f8f8;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5em 1em;
  margin: 0 1em;
  transition: box-shadow 0.5s, transform 0.5s;
}

.carousel.highlight {
  box-shadow: 0 0 20px rgba(248, 204, 204, 0.8);
  transform: scale(1.02);
}

.books-container {
  display: flex;
  justify-content: center;
  gap: 1em;
}

.book-item {
  cursor: pointer;
  transition: transform 0.2s;
}

.book-item:hover {
  transform: translateY(-5px);
}

.arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background: #fff;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.arrow:hover:not(:disabled) {
  background: #f8cccc;
  border-color: #f8cccc;
  color: #a33;
}

.arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.empty-message {
  font-size: 1.1em;
  color: #888;
  text-align: center;
  padding: 2em 0;
}
</style>