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
    <a
      :class="{ active: route.name === 'home' }"
      @click.prevent="goTo('home')"
      href="#"
    >Home</a>
    <a
      :class="{ active: route.name === 'profile' }"
      @click.prevent="goTo('profile')"
      href="#"
    >Profile</a>
    <a
      :class="{ active: route.name === 'recommendations' }"
      @click.prevent="goTo('recommendations')"
      href="#"
    >Recommendations</a>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  gap: 2.5em;
  justify-content: center;
}

a {
  padding: 1em 2em;
  font-size: 1.2em;
  transition: background 0.2s, color 0.2s;
  text-decoration: none;
  color: #222;
  font-weight: 500;
  display: inline-block;
}

a.active, a:hover {
  background: #f8cccc;
  color: #a33;
}
</style>