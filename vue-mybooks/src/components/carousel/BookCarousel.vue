<template>
  <div class="carousel-container">
    <button class="arrow" @click="prev" :disabled="startIndex === 0">&#8592;</button>
    <div class="carousel">
      <BookCard
        v-for="(book, idx) in visibleBooks"
        :key="book.key || idx"
        :title="book.title"
        :cover-id="book.cover_i"
      />
    </div>
    <button class="arrow" @click="next" :disabled="startIndex + visibleCount >= books.length">&#8594;</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BookCard from './BookCard.vue'

const props = defineProps({
  books: {
    type: Array,
    required: true
  }
})

const visibleCount = 3
const startIndex = ref(0)

const visibleBooks = computed(() =>
  props.books.slice(startIndex.value, startIndex.value + visibleCount)
)

function prev() {
  if (startIndex.value > 0) startIndex.value--
}
function next() {
  if (startIndex.value + visibleCount < props.books.length) startIndex.value++
}
</script>

<style scoped>
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2em 0;
  gap: 1em;
}
.carousel {
  display: flex;
  overflow: hidden;
  padding: 1em 0;
}
.arrow {
  font-size: 2em;
  background: #fff;
  border: 2px solid #ccc;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.arrow:not(:disabled):hover {
  background: #f8cccc;
  border-color: #f8cccc;
}
</style>