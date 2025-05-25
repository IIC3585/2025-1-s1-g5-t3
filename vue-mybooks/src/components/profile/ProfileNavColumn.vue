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
.profile-nav-col {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Igual que el gap:1rem del original */
  width: 350px;
  position: sticky;
  top: 6rem;
}

/* Estilos para los botones, replicando .nav-button */
.profile-nav-col a,
.profile-nav-col button {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #f5f0e6;
  border-radius: 12px;
  text-decoration: none;
  color: #5c4033;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 1px solid rgba(92, 64, 51, 0.1);
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.08);
  cursor: pointer;
}

.profile-nav-col a:hover,
.profile-nav-col button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(92, 64, 51, 0.12);
  background: #ebe4d6;
}

/* Si quieres añadir iconos dentro del botón (igual que .button-icon) */
.button-icon {
  font-size: 1.5rem;
}

/* Para el texto dentro del botón */
.button-text {
  font-size: 1.1rem;
  font-family: 'Poppins', sans-serif;
}

/* Responsive según el original */
@media (max-width: 1024px) {
  .profile-nav-col {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }
  .profile-nav-col a,
  .profile-nav-col button {
    flex: 1;
    min-width: 200px;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .profile-nav-col {
    flex-direction: column;
  }
  .profile-nav-col a,
  .profile-nav-col button {
    width: 100%;
  }
}

</style>