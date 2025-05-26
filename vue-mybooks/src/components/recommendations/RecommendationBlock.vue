<template>
  <div class="recommendation-block">
    <div class="main-book">
      <h3>Porque te gustó <span class="book-title">{{ book.title }}</span></h3>
      <div class="book-info">
        <div class="cover">
          <img :src="book.cover" alt="cover" />
        </div>
        <div>
          <div><b>Autor:</b> {{ book.author }}</div>
          <div v-if="book.topic"><b>Tema:</b> {{ book.topic }}</div>
          <div><b>Rating:</b> {{ book.rating }} ⭐</div>
        </div>
      </div>
    </div>
    <div class="suggestions">
      <div class="suggestion-title">Te podrían gustar:</div>
      <div v-if="suggestions.length === 0" class="no-suggestions">
        Cargando sugerencias...
      </div>
      <div v-else class="suggested-books">

        <div 
          v-for="s in suggestions" 
          :key="s.id" 
          class="suggested-book"
          @click="openBookModal(s)"

        >
          <img :src="s.cover" alt="cover" />
          <div class="suggested-title">{{ s.title }}</div>
          <div class="suggested-author">{{ s.author }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useBookStore } from '../../stores/bookStore'

const props = defineProps({

  book: {
    type: Object,
    required: true
  },
  suggestions: {
    type: Array,
    default: () => []
  }
})


const bookStore = useBookStore()

function openBookModal(book) {
  // Convertir el libro sugerido al formato esperado por el modal
  console.log('Book:', book);
  const bookForModal = {
    key: book.id,
    title: book.title,
    author_name: [book.author],
    cover_i: book.cover.split('/').pop().split('-')[0],
    first_publish_year: null // Agregamos este campo que espera el modal
  }
  console.log('Book for modal:', bookForModal);
  bookStore.openBookModal(bookForModal)
}

</script>

<style scoped>
.recommendation-block {
  display: flex;
  align-items: flex-start;
  gap: 2em;
  margin-bottom: 3em;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px #0001;
  padding: 2em;
}
.main-book {
  flex: 1;
  min-width: 220px;
}
.book-title {
  color: #a33;
}
.book-info {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-top: 1em;
}
.cover img {
  width: 90px;
  height: 130px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #f8cccc;
  background: #eee;
}
.suggestions {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.suggestion-title {
  font-weight: bold;
  margin-bottom: 1em;
  color: #333;
}
.suggested-books {
  display: flex;
  gap: 1.5em;
}
.suggested-book {
  width: 110px;
  text-align: center;

  cursor: pointer;
  transition: transform 0.2s;
}
.suggested-book:hover {
  transform: translateY(-5px);

}
.suggested-book img {
  width: 90px;
  height: 130px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #ccc;
  background: #eee;
}
.suggested-title {
  font-size: 1em;
  margin-top: 0.5em;
  color: #222;
}
.suggested-author {
  font-size: 0.95em;
  color: #666;
}
.no-suggestions {
  font-style: italic;
  color: #999;
  padding: 1em 0;
}


</style>
