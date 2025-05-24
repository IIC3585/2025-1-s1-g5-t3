<template>
  <div class="carousel-container">
    <button class="arrow" @click="prev" :disabled="startIndex === 0">&#8592;</button>
    <div class="carousel">
      <BookCard
        v-for="(book, idx) in visibleBooks"
        :key="book.key || idx"
        :title="book.title"
        :cover-id="book.cover_i"
        @click="handleClick(book)"
        style="cursor:pointer"
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
const emit = defineEmits(['book-click'])

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
function handleClick(book) {
  emit('book-click', book)
}
</script>