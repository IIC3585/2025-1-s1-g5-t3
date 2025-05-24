<template>
  <div class="profile-nav-col">
    <ProfileNavButton to="/authors">Autores</ProfileNavButton>
    <ProfileNavButton to="/topics">Temas</ProfileNavButton>
    <ProfileNavButton to="/mybooks">Mis libros</ProfileNavButton>
  </div>
</template>

<script setup>
import ProfileNavButton from './ProfileNavButton.vue'
</script>

<style scoped>
.profile-nav-col {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  width: 350px;
}
</style>