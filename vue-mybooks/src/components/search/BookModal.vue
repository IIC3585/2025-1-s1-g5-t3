<template>
  <div v-if="book" class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">×</button>
      <div class="modal-body">
        <img v-if="book.cover_i" :src="`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`" alt="Portada" />
        <div class="info">
          <h2>{{ book.title }}</h2>
          <p v-if="book.author_name"><b>Autor:</b> {{ book.author_name[0] }}</p>
          <p v-if="book.first_publish_year"><b>Año:</b> {{ book.first_publish_year }}</p>
          <div class="actions">
            <button
              :class="{ active: readBooks.has(book.key) }"
              @click="toggle(readBooks, book)"
            >{{ readBooks.has(book.key) ? '✓ Leído' : 'Agregar a Leídos' }}</button>
            <button
              :class="{ active: recommendedBooks.has(book.key) }"
              @click="toggle(recommendedBooks, book)"
            >{{ recommendedBooks.has(book.key) ? '✓ Recomendado' : 'Agregar a Recomendados' }}</button>
            <button
              :class="{ active: wantToReadBooks.has(book.key) }"
              @click="toggle(wantToReadBooks, book)"
            >{{ wantToReadBooks.has(book.key) ? '✓ Quiero Leer' : 'Agregar a Quiero Leer' }}</button>
          </div>
          <div v-if="notification" class="notification" :class="notification.type">
            {{ notification.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBookLists } from '../../composables/useBookLists'
import eventBus from '../../utils/eventBus'

const props = defineProps({ book: Object })
const emit = defineEmits(['close'])

const { readBooks, recommendedBooks, wantToReadBooks } = useBookLists()
const notification = ref(null)

function close() {
  emit('close')
}

function toggle(list, book) {
  let listName = ''
  if (list === readBooks) listName = 'read' 
  else if (list === recommendedBooks) listName = 'recommended'
  else if (list === wantToReadBooks) listName = 'want'
  
  if (list.has(book.key)) {
    list.remove(book.key)
    showNotification('Libro quitado de la lista', 'removed')
    // Notifica que se quitó un libro
    eventBus.emit('book-removed', { listName, book })
  } else {
    list.add(book)
    showNotification('¡Libro añadido a tu lista!', 'added')
    // Notifica que se agregó un libro
    eventBus.emit('book-added', { listName, book })
  }
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
.info { flex: 1; }
img { width: 120px; height: 180px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>