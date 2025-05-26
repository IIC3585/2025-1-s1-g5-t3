<template>
  <div class="profile-container">
    <Navbar />

    <main class="profile-content">
      <h1>Mi Perfil de Lectura</h1>

      <div class="profile-layout">
        <div class="stats-section">
          <ProfileStatsCard />
        </div>

        <div class="navigation-section">
          <ProfileNavColumn />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from '../Navbar.vue';
import ProfileStatsCard from './ProfileStatsCard.vue';
import ProfileNavColumn from './ProfileNavColumn.vue';
</script>

<style scoped>
.profile-container {
  padding-top: 5rem;
  min-height: 100vh;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
  font-size: 2.5rem;
  color: #5c4033;
  margin-bottom: 3rem;
  text-align: center;
  font-weight: 600;
  position: relative;
  padding-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.5px;
}

h1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: #5c4033;
  border-radius: 2px;
}

.profile-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  align-items: start;
}

.navigation-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 6rem;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .navigation-section {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding-top: 4rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .navigation-section {
    flex-direction: column;
  }
}
</style>
