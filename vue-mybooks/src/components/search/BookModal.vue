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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBookLists } from '../../composables/useBookLists'
const props = defineProps({ book: Object })
const emit = defineEmits(['close'])

const { readBooks, recommendedBooks, wantToReadBooks } = useBookLists()

function close() {
  emit('close')
}

function toggle(list, book) {
  if (list.has(book.key)) {
    list.remove(book.key)
  } else {
    list.add(book)
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; background: #0008; display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal-content {
  background: #fff; border-radius: 12px; padding: 2em; min-width: 320px; max-width: 90vw; position: relative;
}
.close-btn {
  position: absolute; top: 1em; right: 1em; font-size: 1.5em; background: none; border: none; cursor: pointer;
}
.modal-body {
  display: flex; gap: 2em; align-items: flex-start;
}
.info { flex: 1; }
img { width: 120px; height: 180px; object-fit: cover; border-radius: 8px; }
.actions { margin-top: 1.5em; display: flex; flex-direction: column; gap: 0.7em; }
button.active { background: #f8cccc; color: #a33; }
button { padding: 0.7em 1em; border-radius: 8px; border: 2px solid #ccc; background: #fff; cursor: pointer; }
button:hover { background: #f8cccc; }
</style>