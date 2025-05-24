<template>
  <button class="back-btn" @click="goBack">
    ← Volver al perfil
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goBack() {
  router.push('/profile')
}
</script>

<style scoped>
.back-btn {
  margin-bottom: 2em;
  padding: 0.7em 1.5em;
  font-size: 1em;
  border-radius: 8px;
  border: 2px solid #ccc;
  background: #fff;
  color: #222;
  cursor: pointer;
  transition: background 0.2s, border 0.2s, color 0.2s;
}
.back-btn:hover {
  background: #f8cccc;
  border-color: #f8cccc;
  color: #a33;
}
</style>