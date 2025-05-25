<template>
  <div v-if="book" class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">×</button>
      <div class="modal-body">
        <div class="image-column">
          <img v-if="book.cover_i" :src="`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`" alt="Portada" />
          <div v-else class="no-cover">Sin portada</div>
          <a 
            :href="`https://openlibrary.org${book.key}`" 
            target="_blank" 
            class="external-link"
          >
            Ver en OpenLibrary
          </a>
          <div v-if="isInList('readBooks', book.key)" class="rating-container">
            <p><b>Tu valoración:</b></p>
            <div class="star-rating">
              <span 
                v-for="star in 5" 
                :key="star" 
                class="star" 
                :class="{ 'filled': star <= (bookRating || 0) }"
                @click="rateBook(star)"
              >
                ★
              </span>
            </div>
          </div>
        </div>
        <div class="info">
          <h2>{{ book.title }}</h2>
          <p v-if="book.author_name"><b>Autor:</b> {{ book.author_name[0] }}</p>
          <p v-if="book.first_publish_year"><b>Año:</b> {{ book.first_publish_year }}</p>

          <div class="actions">
            <button
              :class="{ active: isInList('readBooks', book.key) }"
              @click="toggleBook('read', book)"
            >{{ isInList('readBooks', book.key) ? '✓ Leído' : 'Agregar a Leídos' }}</button>
            <button
              :class="{ active: isInList('recommendedBooks', book.key) }"
              @click="toggleBook('recommended', book)"
            >{{ isInList('recommendedBooks', book.key) ? '✓ Recomendado' : 'Agregar a Recomendados' }}</button>
            <button
              :class="{ active: isInList('wantToReadBooks', book.key) }"
              @click="toggleBook('want', book)"
            >{{ isInList('wantToReadBooks', book.key) ? '✓ Quiero Leer' : 'Agregar a Quiero Leer' }}</button>
          </div>
          <div v-if="notification" class="notification" :class="notification.type">
            {{ notification.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <RatingModal
    v-if="showRatingModal"
    :book="book"
    :isOpen="showRatingModal"
    @close="showRatingModal = false"
    @rate="handleRating"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBookStore } from '../../stores/bookStore'
import RatingModal from './RatingModal.vue'

const bookStore = useBookStore()
const book = computed(() => bookStore.selectedBook)
const notification = ref(null)
const showRatingModal = ref(false)

// Obtiene la valoración actual del libro si existe
const bookRating = computed(() => {
  if (book.value && isInList('readBooks', book.value.key)) {
    const foundBook = bookStore.readBooks.find(b => b.key === book.value.key)
    return foundBook ? foundBook.rating : 0
  }
  return 0
})

function close() {
  bookStore.closeBookModal()
}

function isInList(listName, bookKey) {
  const list = bookStore[listName]
  return list ? list.some(book => book.key === bookKey) : false
}

function toggleBook(listName, book) {
  const wasInList = isInList(`${listName}Books`, book.key)
  
  if (wasInList) {
    bookStore.removeBook(book.key, listName)
    showNotification('Libro quitado de la lista', 'removed')
  } else {
    bookStore.addBook(book, listName)
    showNotification('¡Libro añadido a tu lista!', 'added')
    
    // Si se agregó a "leídos", mostramos el modal de valoración
    if (listName === 'read') {
      showRatingModal.value = true
    }
  }
}

function rateBook(rating) {
  if (book.value) {
    bookStore.rateBook(book.value.key, rating)
    showNotification(`Valoración actualizada: ${rating} estrellas`, 'added')
  }
}

function handleRating(data) {
  bookStore.rateBook(data.bookKey, data.rating)
  showNotification(`¡Gracias por tu valoración! (${data.rating} estrellas)`, 'added')
}

function showNotification(message, type) {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 2000)
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(3px);
}
.modal-content {
  background: #fff; border-radius: 12px; padding: 2em; min-width: 320px; max-width: 90vw; position: relative;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}
.close-btn {
  position: absolute; top: 1em; right: 1em; font-size: 1.5em; background: none; border: none; cursor: pointer;
}
.modal-body {
  display: flex; gap: 2em; align-items: flex-start;
}
.image-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.info { flex: 1; }
img { 
  width: 120px; 
  height: 180px; 
  object-fit: cover; 
  border-radius: 8px; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  margin-bottom: 1em;
}
.no-cover {
  width: 120px;
  height: 180px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1em;
}
.external-link {
  text-decoration: none;
  color: #a33;
  font-size: 0.9em;
  padding: 0.5em 0.75em;
  border: 1px solid #f8cccc;
  border-radius: 4px;
  transition: all 0.2s;
  display: block;
  text-align: center;
}
.external-link:hover {
  background: #f8cccc;
}
.actions { margin-top: 1.5em; display: flex; flex-direction: column; gap: 0.7em; }
button.active { background: #f8cccc; color: #a33; border-color: #f8cccc; }
button { padding: 0.7em 1em; border-radius: 8px; border: 2px solid #ccc; background: #fff; cursor: pointer; transition: all 0.2s; }
button:hover { background: #f8cccc; }

.notification {
  margin-top: 1em;
  padding: 0.7em 1em;
  border-radius: 8px;
  font-weight: bold;
  animation: fadeIn 0.3s;
}
.notification.added {
  background: #e8f4e8;
  color: #2a6b2a;
  border: 1px solid #a7d1a7;
}
.notification.removed {
  background: #f4e8e8;
  color: #6b2a2a;
  border: 1px solid #d1a7a7;
}

/* Estilos para el sistema de valoración */
.rating-container {
  margin: 1em 0;
}
.star-rating {
  display: flex;
  gap: 0.3em;
}
.star {
  font-size: 1.5em;
  cursor: pointer;
  color: #ccc;
  transition: color 0.2s;
}
.star:hover {
  color: #ffcc00;
}
.star.filled {
  color: #ffcc00;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>