<template>
  <div class="section-view">
    <div class="header-row">
      <BackToProfile />
      <h2>Temas</h2>
      <div class="spacer"></div>
    </div>
    
    <div v-if="loading" class="loading-state">
      <p>Cargando temas...</p>
    </div>
    
    <div v-else-if="!hasReadBooks" class="empty-state">
      <p>No hay libros agregados a tus colecciones.</p>
      <p>Agrega algunos libros para ver tus temas aquí.</p>
    </div>
    
    <div v-else-if="!hasBooks" class="empty-state">
      <p>No se encontraron temas para tus libros.</p>
      <p>Los libros necesitan tener temas asignados para mostrarse aquí.</p>
    </div>
    
    <div v-else class="topics-grid">
      <div v-for="(books, topic) in booksByTopic" :key="topic" class="topic-section">
        <h3 class="topic-name">{{ topic }} ({{ books.length }} libros)</h3>
        <div class="topic-books">
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
    </div>

    <BookModal />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import BackToProfile from '../components/profile/BackToProfile.vue'
import { useBookStore } from '../stores/bookStore'
import BookModal from '../components/search/BookModal.vue'
import { buscarDetalleDeLibro, buscarLibrosPorTema } from '../services/openLibrary'

const bookStore = useBookStore()
const loading = ref(true)
const bookDetails = ref({})
const bookTopics = ref({})
const topicFrequency = ref({})

// Verificar si hay libros leídos
const hasReadBooks = computed(() => bookStore.readBooks.length > 0)

// Función para obtener todos los temas de un libro
async function getBookTopics(book) {
  console.log('Getting topics for book:', book.key, book.title)
  
  // Si ya tenemos los temas guardados, los retornamos
  if (bookTopics.value[book.key]) {
    return bookTopics.value[book.key]
  }
  
  if (!bookDetails.value[book.key]) {
    const details = await buscarDetalleDeLibro(book.key)
    console.log('Details:', details)
    bookDetails.value[book.key] = details
  }
  
  const details = bookDetails.value[book.key]
  let topics = ['Sin clasificación']
  
  if (details?.subjects && details.subjects.length > 0) {
    // Filtrar solo temas de una palabra y limpiar el tema
    topics = details.subjects
      .filter(subject => !subject.includes(' '))
      .map(subject => subject.toLowerCase()
        .replace(/^fiction\s*/, '')
        .replace(/^novels\s*/, '')
        .replace(/^stories\s*/, '')
        .trim()
      )
      .filter(subject => subject)
    
    if (topics.length === 0) {
      topics = ['Sin clasificación']
    }
  }
  
  console.log('Book topics:', book.title, topics)
  // Guardar los temas para este libro
  bookTopics.value[book.key] = topics
  return topics
}

// Cargar detalles de los libros y calcular frecuencia de temas
async function loadBookDetails() {
  console.log('Starting loadBookDetails, readBooks:', bookStore.readBooks)
  loading.value = true
  const readBooks = bookStore.readBooks
  
  if (readBooks.length === 0) {
    console.log('No read books found')
    loading.value = false
    return
  }
  
  // Reiniciar los contadores
  topicFrequency.value = {}
  bookTopics.value = {}
  
  // Cargar detalles y contar frecuencia de temas
  for (const book of readBooks) {
    const topics = await getBookTopics(book)
    console.log('Book topics:', book.title, topics)
    // Contar cada tema del libro
    topics.forEach(topic => {
      topicFrequency.value[topic] = (topicFrequency.value[topic] || 0) + 1
    })
  }
  
  console.log('Final topic frequency:', topicFrequency.value)
  loading.value = false
}

// Obtener los libros agrupados por tema
const booksByTopic = computed(() => {
  console.log('Computing booksByTopic, topicFrequency:', topicFrequency.value)
  // Obtener los 5 temas más frecuentes
  const topTopics = Object.entries(topicFrequency.value)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([topic]) => topic)

  console.log('Top Topics:', topTopics)
  
  // Agrupar libros por tema
  const groupedByTopic = {}
  
  bookStore.readBooks.forEach(book => {
    const topics = bookTopics.value[book.key] || ['Sin clasificación']
    console.log('Book topics in grouping:', book.title, topics)
    
    // Agregar el libro a cada uno de sus temas que esté en los top 5
    topics.forEach(topic => {
      if (topTopics.includes(topic)) {
        if (!groupedByTopic[topic]) {
          groupedByTopic[topic] = []
        }
        // Solo agregar el libro si no está ya en este tema
        if (!groupedByTopic[topic].some(b => b.key === book.key)) {
          groupedByTopic[topic].push(book)
        }
      }
    })
  })
  
  console.log('Final grouped books:', groupedByTopic)
  return groupedByTopic
})

// Verificar si hay libros
const hasBooks = computed(() => {
  const hasTopics = Object.keys(booksByTopic.value).length > 0
  console.log('hasBooks computed:', hasTopics, 'readBooks length:', bookStore.readBooks.length)
  return hasTopics
})

// Verificar si un libro está en una lista específica
function isInList(listName, bookKey) {
  const list = bookStore[listName]
  return list.some(book => book.key === bookKey)
}

// Abrir el modal del libro
function openBookModal(book) {
  bookStore.openBookModal(book)
}

// Cargar detalles cuando se monta el componente
onMounted(loadBookDetails)
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

.topics-grid {
  display: flex;
  flex-direction: column;
  gap: 2.5em;
  margin-top: 2em;
}

.topic-section {
  background: #fff;
  border-radius: 12px;
  padding: 1.5em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.topic-name {
  color: #a33;
  font-size: 1.5em;
  margin-bottom: 1em;
  padding-bottom: 0.5em;
  border-bottom: 2px solid #f8cccc;
}

.topic-books {
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
  margin-bottom: 0.3em;
  font-size: 0.95em;
  line-height: 1.3;
  height: 2.6em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
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

.loading-state {
  text-align: center;
  margin: 3em 0;
  color: #666;
  font-style: italic;
  background: white;
  padding: 2em;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>