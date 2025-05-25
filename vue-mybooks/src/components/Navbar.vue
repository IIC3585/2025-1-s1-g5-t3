<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

function goTo(tab) {
  if (tab === 'home') router.push('/')
  else if (tab === 'profile') router.push('/profile')
  else if (tab === 'recommendations') router.push('/recommendations')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- IZQUIERDA: Logo -->
      <a
        href="#"
        class="logo"
        @click.prevent="goTo('home')"
      >
        <span class="logo-text">MyBooks</span>
      </a>

      <!-- DERECHA: Links -->
      <div class="nav-links">
        <a
          href="#"
          class="nav-link"
          :class="{ active: route.name === 'profile' }"
          @click.prevent="goTo('profile')"
        >
          Perfil
        </a>
        <a
          href="#"
          class="nav-link"
          :class="{ active: route.name === 'recommendations' }"
          @click.prevent="goTo('recommendations')"
        >
          Recomendaciones
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #f5f0e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between; /* Distribuye logo a la izquierda, links a la derecha */
  align-items: center;
}

/* LOGO */
.logo {
  text-decoration: none;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: 600;
  color: #5c4033;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.5px;
}

/* LINKS */
.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #5c4033;
  font-size: 1rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  padding: 0.5rem 0;
  position: relative;
}

/* Sin efecto de hover */
.nav-link:hover {
  color: #5c4033;
}

.nav-link.active {
  color: #3c2a21;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #3c2a21;
  transform: scaleX(1);
  transition: transform 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #3c2a21;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

/* Desactivado: ya no mostramos línea al pasar el mouse */
.nav-link:hover::after {
  transform: scaleX(0);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .nav-links {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .nav-link {
    width: 100%;
    padding: 0.5rem 0;
  }
}
</style>
