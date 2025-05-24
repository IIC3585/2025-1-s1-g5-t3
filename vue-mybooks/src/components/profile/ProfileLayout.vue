<template>
  <div class="profile-layout">
    <div class="left">
      <ProfileStatsCard />
    </div>
    <div class="right">
      <ProfileNavColumn />
    </div>
  </div>
</template>

<script setup>
import ProfileStatsCard from './ProfileStatsCard.vue'
import ProfileNavColumn from './ProfileNavColumn.vue'
</script>

<style scoped>
.profile-layout {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 3em;
  margin: 3em 0;
}
.left {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>