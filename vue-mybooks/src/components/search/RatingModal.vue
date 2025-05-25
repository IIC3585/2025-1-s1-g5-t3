<template>
  <div v-if="isOpen" class="rating-modal-backdrop" @click.self="closeWithoutRating">
    <div class="rating-modal">
      <h3>¿Qué te pareció este libro?</h3>
      <img v-if="book.cover_i" :src="`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`" alt="Portada" class="cover" />
      <p class="book-title">{{ book.title }}</p>
      
      <div class="star-rating">
        <span 
          v-for="star in 5" 
          :key="star" 
          class="star" 
          :class="{ 'filled': star <= currentRating, 'hovered': star <= hoverRating }"
          @click="setRating(star)"
          @mouseenter="hoverRating = star"
          @mouseleave="hoverRating = 0"
        >
          ★
        </span>
      </div>
      <div class="rating-text">{{ getRatingText(currentRating) }}</div>
      
      <div class="buttons">
        <button class="skip-btn" @click="closeWithoutRating">Valorar después</button>
        <button class="submit-btn" @click="submitRating" :disabled="currentRating === 0">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  book: Object,
  isOpen: Boolean
})

const emit = defineEmits(['close', 'rate'])

const currentRating = ref(0)
const hoverRating = ref(0)

function getRatingText(rating) {
  switch(rating) {
    case 0: return 'Selecciona tu valoración';
    case 1: return 'No me gustó';
    case 2: return 'Está bien';
    case 3: return 'Me gustó';
    case 4: return 'Me gustó mucho';
    case 5: return 'Excelente';
    default: return '';
  }
}

function setRating(rating) {
  currentRating.value = rating
}

function submitRating() {
  emit('rate', { bookKey: props.book.key, rating: currentRating.value })
  emit('close')
}

function closeWithoutRating() {
  emit('close')
}
</script>

<style scoped>
.rating-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  animation: fadeIn 0.3s;
}

.rating-modal {
  background: white;
  padding: 2em;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.cover {
  width: 100px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin: 1em 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.book-title {
  font-weight: bold;
  margin-bottom: 1em;
  font-size: 1.1em;
}

.star-rating {
  display: flex;
  gap: 0.5em;
  margin: 1em 0;
}

.star {
  font-size: 2.5em;
  cursor: pointer;
  color: #ddd;
  transition: all 0.2s;
}

.star.filled {
  color: #ffcc00;
}

.star.hovered {
  color: #ffdd55;
  transform: scale(1.1);
}

.rating-text {
  height: 1.5em;
  margin-bottom: 1.5em;
  font-style: italic;
  color: #666;
}

.buttons {
  display: flex;
  gap: 1em;
  margin-top: 1em;
}

.skip-btn, .submit-btn {
  padding: 0.7em 1.5em;
  border-radius: 8px;
  border: none;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.2s;
}

.skip-btn {
  background: #eee;
  color: #666;
}

.skip-btn:hover {
  background: #ddd;
}

.submit-btn {
  background: #f8cccc;
  color: #a33;
}

.submit-btn:hover:not(:disabled) {
  background: #f6bbbb;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>