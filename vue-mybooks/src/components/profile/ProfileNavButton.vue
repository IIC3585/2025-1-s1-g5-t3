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
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #f5f0e6;
  border-radius: 12px;
  border: 1px solid rgba(92, 64, 51, 0.1);
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.08);
  color: #5c4033;
  font-weight: 600;
  font-size: 1.1rem;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-nav-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(92, 64, 51, 0.12);
  background: #ebe4d6;
  border-color: rgba(92, 64, 51, 0.3);
  color: #5c4033;
}
</style>
