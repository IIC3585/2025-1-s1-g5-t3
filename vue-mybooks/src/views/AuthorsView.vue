<template>
  <div class="section-view">
    
    <div class="header-row">
      <BackToProfile />
      <h2>Autores</h2>
      <div class="spacer"></div>
    </div>
    
    <div v-if="!hasBooks" class="empty-state">
      <p>No hay libros agregados a tus colecciones.</p>
      <p>Agrega algunos libros para ver tus autores aquí.</p>
    </div>
    
    <div v-else class="authors-grid">
      <div v-for="(books, author) in booksByAuthor" :key="author" class="author-section">
        <h3 class="author-name">{{ author }}</h3>
        <div class="author-books">
          <div v-for="book in books" :key="book.key" class="book-card" @click="openBookModal(book)">
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
    </div>

    <BookModal />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BackToProfile from '../components/profile/BackToProfile.vue'
import { useBookStore } from '../stores/bookStore'
import BookModal from '../components/search/BookModal.vue' // Importa el componente modal

const bookStore = useBookStore()

// Obtener todos los libros únicos agrupados por autor
const booksByAuthor = computed(() => {
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
  
  // 3. Agrupar por autor
  const groupedByAuthor = {}
  
  uniqueBooks.forEach(book => {
    if (book.author_name && book.author_name.length > 0) {
      const author = book.author_name[0]
      if (!groupedByAuthor[author]) {
        groupedByAuthor[author] = []
      }
      groupedByAuthor[author].push(book)
    } else {
      // Libros sin autor conocido
      const author = 'Autor desconocido'
      if (!groupedByAuthor[author]) {
        groupedByAuthor[author] = []
      }
      groupedByAuthor[author].push(book)
    }
  })
  
  return groupedByAuthor
})

// Verificar si hay libros
const hasBooks = computed(() => 
  Object.keys(booksByAuthor.value).length > 0
)

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
  /* Este div vacío mantiene el título centrado cuando BackToProfile está a la izquierda */
  width: 80px; /* Ajustar según el ancho aproximado del botón de retorno */
}

.section-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1em 2em;
}

.empty-state {
  text-align: center;
  margin: 3em 0;
  color: #666;
  font-style: italic;
}

.authors-grid {
  display: flex;
  flex-direction: column;
  gap: 2.5em;
  margin-top: 2em;
}

.author-section {
  background: #fff;
  border-radius: 12px;
  padding: 1.5em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.author-name {
  color: #a33;
  font-size: 1.5em;
  margin-bottom: 1em;
  padding-bottom: 0.5em;
  border-bottom: 2px solid #f8cccc;
}

.author-books {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5em;
}

.book-card {
  width: 200px;
  background: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
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
  margin-bottom: 0.5em;
  font-size: 0.95em;
  line-height: 1.3;
  height: 2.6em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
</style>