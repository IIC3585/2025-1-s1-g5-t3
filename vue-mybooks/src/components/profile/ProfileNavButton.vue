<template>
  <button class="profile-nav-btn" @click="go">
    <slot />
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({ to: String })
const router = useRouter()
function go() {
  router.push(props.to)
}
</script>

<style scoped>
.profile-nav-btn {
  width: 100%;
  padding: 1.2em 0;
  margin-bottom: 1.5em;
  font-size: 1.2em;
  background: #fff;
  border: 2px solid #ccc;
  border-radius: 20px;
  color: #222;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, border 0.2s, color 0.2s;
}
.profile-nav-btn:hover {
  background: #f8cccc;
  border-color: #f8cccc;
  color: #a33;
}
</style>