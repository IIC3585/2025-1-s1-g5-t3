<template>
  <div class="section-view">
    <div class="header-row">
      <BackToProfile />
      <h2>Mis Libros</h2>
      <div class="spacer"></div>
    </div>
    
    <div v-if="!hasBooks" class="empty-state">
      <p>No has agregado ningún libro a tus colecciones.</p>
      <p>Usa el buscador para encontrar y añadir libros.</p>
    </div>
    
    <div v-else>
      <div class="books-grid">
        <div 
          v-for="book in allUniqueBooks" 
          :key="book.key" 
          class="book-card" 
          @click="openBookModal(book)"
        >
          <div class="book-cover">
            <img 
              v-if="book.cover_i" 
              :src="`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`" 
              alt="Portada"
            />
            <div v-else class="no-cover">Sin portada</div>
          </div>
          <div class="book-info">
            <div class="book-title">{{ book.title }}</div>
            <div class="book-author">{{ book.author_name ? book.author_name[0] : 'Autor desconocido' }}</div>
            <div v-if="book.rating" class="book-rating">
              {{ "★".repeat(book.rating) }}<span class="empty-stars">{{ "★".repeat(5 - book.rating) }}</span>
            </div>
            <div class="book-lists">
              <span v-if="isInList('readBooks', book.key)" class="list-tag read">Leído</span>
              <span v-if="isInList('recommendedBooks', book.key)" class="list-tag recommended">Recomendado</span>
              <span v-if="isInList('wantToReadBooks', book.key)" class="list-tag want">Quiero leer</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BookModal />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BackToProfile from '../components/profile/BackToProfile.vue'
import { useBookStore } from '../stores/bookStore'
import BookModal from '../components/search/BookModal.vue'

const bookStore = useBookStore()

// Obtener todos los libros únicos de todas las colecciones
const allUniqueBooks = computed(() => {
  // 1. Combinar todos los libros de las tres colecciones
  const allBooks = [
    ...bookStore.readBooks,
    ...bookStore.recommendedBooks,
    ...bookStore.wantToReadBooks
  ]
  
  // 2. Eliminar duplicados usando un Set para las claves
  const uniqueBooks = []
  const uniqueKeys = new Set()
  
  allBooks.forEach(book => {
    if (!uniqueKeys.has(book.key)) {
      uniqueKeys.add(book.key)
      uniqueBooks.push(book)
    }
  })
  
  return uniqueBooks
})

// Verificar si hay libros
const hasBooks = computed(() => allUniqueBooks.value.length > 0)

// Verificar si un libro está en una lista específica
function isInList(listName, bookKey) {
  const list = bookStore[listName]
  return list.some(book => book.key === bookKey)
}

// Abrir el modal del libro
function openBookModal(book) {
  bookStore.openBookModal(book)
}
</script>

<style scoped>
.header-row {
  display: flex;
  align-items: center;
  margin-bottom: 1.5em;
}

.header-row h2 {
  flex-grow: 1;
  text-align: center;
  margin: 0;
}

.spacer {
  width: 80px;
}

.section-view {
  max-width: 1400px; /* Mayor ancho para acomodar 6 libros */
  margin: 0 auto;
  padding: 1em 2em;
}

.empty-state {
  text-align: center;
  margin: 3em 0;
  color: #666;
  font-style: italic;
  background: white;
  padding: 2em;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.book-card {
  background: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.book-cover {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-cover {
  color: #999;
  font-style: italic;
}

.book-info {
  padding: 1em;
}

.book-title {
  font-weight: bold;
  margin-bottom: 0.3em;
  font-size: 0.95em;
  line-height: 1.3;
  height: 2.6em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.book-author {
  font-size: 0.85em;
  color: #666;
  margin-bottom: 0.5em;
  font-style: italic;
}

.book-rating {
  margin-bottom: 0.5em;
  color: #ffcc00;
  font-size: 0.9em;
}

.empty-stars {
  color: #ddd;
}

.book-lists {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em;
}

.list-tag {
  font-size: 0.7em;
  padding: 0.2em 0.5em;
  border-radius: 4px;
  color: white;
}

.list-tag.read {
  background: #5a9;
}

.list-tag.recommended {
  background: #95a;
}

.list-tag.want {
  background: #a95;
}

/* Responsive - asegurarnos que siempre se muestren 6 libros en pantallas grandes */
@media (min-width: 1400px) {
  .books-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

/* En tablets, mostrar 4 libros por fila */
@media (max-width: 1200px) {
  .books-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* En móviles, mostrar 2 libros por fila */
@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>