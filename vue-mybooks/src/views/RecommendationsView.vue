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
      <div v-for="book in topRatedBooks" :key="book.key">
        <RecommendationBlock
          v-if="librosFormateados[book.key]"
          :book="librosFormateados[book.key]"
          :suggestions="recomendacionesPorLibro[book.key] || []"
        />
      </div>
    </template>

    <BookModal />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RecommendationBlock from '../components/recommendations/RecommendationBlock.vue'
import BookModal from '../components/search/BookModal.vue'
import { useBookStore } from '../stores/bookStore'
import { buscarLibrosPorTema, buscarDetalleDeLibro } from '../services/openLibrary'

// Usar el store en lugar de datos estáticos
const bookStore = useBookStore()

const loading = ref(false)
const error = ref(null)
const recomendacionesPorLibro = ref({})
const librosFormateados = ref({})

// Filtra libros con rating alto del store
const topRatedBooks = computed(() => {
  return bookStore.readBooks
    .filter(book => book.rating >= 4)
    .sort((a, b) => b.rating - a.rating);
})

// Formatea los libros para que coincidan con el formato esperado por RecommendationBlock
async function formatBook(book) {
  // Si ya tenemos el libro formateado, lo retornamos
  if (librosFormateados.value[book.key]) {
    return librosFormateados.value[book.key];
  }

  const tema = await getBookTopic(book);
  const libroFormateado = {
    id: book.key,
    title: book.title,
    author: book.author_name ? book.author_name[0] : 'Desconocido',
    topic: tema,
    rating: book.rating,
    cover: book.cover_i 
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : 'https://covers.openlibrary.org/b/id/10909258-L.jpg' // Imagen por defecto
  };

  // Guardamos el libro formateado para futuras referencias
  librosFormateados.value[book.key] = libroFormateado;
  return libroFormateado;
}

// Extrae un tema/género del libro
async function getBookTopic(book) {
  // Si hay subjects disponibles, obtén uno al azar
  const bookDetails = await buscarDetalleDeLibro(book.key);
  if (bookDetails.subjects && bookDetails.subjects.length > 0) {
    // Filtrar solo temas de una palabra
    const singleWordSubjects = bookDetails.subjects.filter(subject => !subject.includes(' '));
    
    if (singleWordSubjects.length > 0) {
      const randomIndex = Math.floor(Math.random() * singleWordSubjects.length);
      console.log('Random Subject:', singleWordSubjects[randomIndex].toLowerCase());
      return singleWordSubjects[randomIndex].toLowerCase();
    }
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
      const libroFormateado = await formatBook(book);
      const tema = libroFormateado.topic;
      console.log('Tema:', tema);
      const sugerencias = await buscarLibrosPorTema(tema, book.key);
      
      // Formatea las sugerencias
      console.log('Sugerencias:', sugerencias);
      const formattedSugerencias = sugerencias.map(sugerencia => ({
        id: sugerencia.key,
        title: sugerencia.title,
        author: sugerencia.authors ? sugerencia.authors[0].name : 'Desconocido',
        cover: sugerencia.cover_id 
          ? `https://covers.openlibrary.org/b/id/${sugerencia.cover_id}-L.jpg`
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
