<template>
  <div class="recommendations-view">
    <h2>Recomendaciones para ti</h2>
    
    <div v-if="loading" class="loading">
      <p>Cargando recomendaciones...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="topRatedBooks.length === 0" class="empty">
      <p>Añade libros con valoraciones altas (4-5 estrellas) para ver recomendaciones personalizadas.</p>
    </div>
    
    <template v-else>
      <RecommendationBlock
        v-for="book in topRatedBooks"
        :key="book.key"
        :book="formatBook(book)"
        :suggestions="recomendacionesPorLibro[book.key] || []"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RecommendationBlock from '../components/recommendations/RecommendationBlock.vue'
import { useBookStore } from '../stores/bookStore'
import { buscarLibrosPorTema } from '../services/openLibrary'

// Usar el store en lugar de datos estáticos
const bookStore = useBookStore()

const loading = ref(false)
const error = ref(null)
const recomendacionesPorLibro = ref({})

// Filtra libros con rating alto del store
const topRatedBooks = computed(() => {
  return bookStore.readBooks
    .filter(book => book.rating >= 4)
    .sort((a, b) => b.rating - a.rating);
})

// Formatea los libros para que coincidan con el formato esperado por RecommendationBlock
function formatBook(book) {
  return {
    id: book.key,
    title: book.title,
    author: book.author_name ? book.author_name[0] : 'Desconocido',
    topic: getBookTopic(book),
    rating: book.rating,
    cover: book.cover_i 
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : 'https://covers.openlibrary.org/b/id/10909258-L.jpg' // Imagen por defecto
  };
}

// Extrae un tema/género del libro
function getBookTopic(book) {
  if (book.subject && book.subject.length > 0) {
    return book.subject[0];
  }
  
  // Algunos libros tienen el campo 'genre' en OpenLibrary
  if (book.genre && book.genre.length > 0) {
    return book.genre[0];
  }
  
  // Si no hay tema definido, usa el título para recomendar libros similares
  return book.title;
}

// Carga recomendaciones para todos los libros con alta valoración
async function cargarRecomendaciones() {
  if (topRatedBooks.value.length === 0) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    for (const book of topRatedBooks.value) {
      const tema = getBookTopic(book);
      const sugerencias = await buscarLibrosPorTema(tema, book.key);
      
      // Formatea las sugerencias
      const formattedSugerencias = sugerencias.map(sugerencia => ({
        id: sugerencia.key,
        title: sugerencia.title,
        author: sugerencia.author_name ? sugerencia.author_name[0] : 'Desconocido',
        cover: sugerencia.cover_i 
          ? `https://covers.openlibrary.org/b/id/${sugerencia.cover_i}-L.jpg`
          : 'https://covers.openlibrary.org/b/id/10909258-L.jpg'
      }));
      
      recomendacionesPorLibro.value[book.key] = formattedSugerencias;
    }
  } catch (err) {
    console.error('Error al cargar recomendaciones:', err);
    error.value = 'No pudimos cargar las recomendaciones. Intenta más tarde.';
  } finally {
    loading.value = false;
  }
}

// Cargar recomendaciones cuando se monta el componente
onMounted(cargarRecomendaciones);
</script>

<style scoped>
.recommendations-view {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 2rem 1rem;
  font-family: 'Poppins', sans-serif;
}

.recommendations-view > h2 {
  font-size: 2.2rem;
  color: #5c4033;
  margin-bottom: 2.5rem;
  text-align: center;
}

.loading, .error, .empty {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 3rem;
  color: #5c4033;
}

.error {
  /* mantiene rojo para error */
  color: #a33;
  border: 1px solid #f8cccc;
  padding: 1.5rem;
  border-radius: 12px;
  background: #fff;
  margin-top: 3rem;
}

.empty {
  font-style: italic;
  color: #5c4033;
  margin-top: 3rem;
  padding: 1rem;
}
</style>
