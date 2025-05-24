<template>
  <div class="book-card">
    <img
      v-if="coverId"
      :src="`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`"
      alt="Portada"
    />
    <div v-else class="no-cover">Sin portada</div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  coverId: [String, Number]
})
</script>

<style scoped>
.book-card {
  width: 120px;
  min-width: 120px;
  height: 200px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #0001;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 8px;
  overflow: hidden;
  padding: 0.5em;
}
img {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 0.5em;
}
.no-cover {
  width: 100px;
  height: 140px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  border-radius: 6px;
  margin-bottom: 0.5em;
}
.title {
  font-size: 1em;
  text-align: center;
  margin-top: 0.2em;
  color: #222;
}
</style>