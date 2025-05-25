<script lang="ts">
  import LikedBook from './LikedBook.svelte';
  import Recomendations from './Recomendations.svelte';
  import { createEventDispatcher } from 'svelte';
  export let likedBook: any;
  export let recommendations: any[] = [];
  const dispatch = createEventDispatcher();
  function handleBookClick(event: CustomEvent) {
    dispatch('bookClick', event.detail);
  }
</script>

<div class="recomendation-card">
  <LikedBook {likedBook} />
  <Recomendations {recommendations} on:bookClick={handleBookClick} />
</div>

<style>
  .recomendation-card {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    padding: 2rem;
    margin-bottom: 2rem;
    align-items: flex-start;
  }
</style> 