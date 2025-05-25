<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  export let isOpen = false;
  export let bookKey = '';

  const dispatch = createEventDispatcher<{
    save: { rating: number };
    close: void;
  }>();

  let rating = 0;
  let hoverRating = 0;

  // Reset rating when modal opens for a new book
  $: if (isOpen) {
    rating = 0;
    hoverRating = 0;
  }

  function handleStarClick(value: number) {
    rating = value;
  }

  function handleStarHover(value: number) {
    hoverRating = value;
  }

  function handleStarLeave() {
    hoverRating = 0;
  }

  function handleSave() {
    if (rating > 0) {
      dispatch('save', { rating });
      closeModal();
    }
  }

  function closeModal() {
    dispatch('close');
  }

  function handleBackdropClick(event: MouseEvent | KeyboardEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div 
    class="modal-backdrop" 
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === 'Enter' && handleBackdropClick(e)}
    role="button"
    tabindex="0"
    transition:fade={{ duration: 200 }}
  >
    <div class="modal-content" transition:slide={{ duration: 200 }}>
      <button class="close-button" on:click={closeModal}>×</button>
      
      <div class="modal-body">
        <h2 class="modal-title">Califica este libro</h2>
        
        <div class="stars-container">
          {#each Array(5) as _, i}
            <button
              class="star-button"
              on:click={() => handleStarClick(i + 1)}
              on:mouseenter={() => handleStarHover(i + 1)}
              on:mouseleave={handleStarLeave}
              aria-label={`${i + 1} estrellas`}
            >
              <span class="star {((hoverRating || rating) > i) ? 'filled' : ''}">
                ★
              </span>
            </button>
          {/each}
        </div>

        <div class="rating-text">
          {#if rating > 0}
            {rating} {rating === 1 ? 'estrella' : 'estrellas'}
          {:else}
            Selecciona una calificación
          {/if}
        </div>

        <button 
          class="save-button" 
          on:click={handleSave}
          disabled={rating === 0}
        >
          Guardar calificación
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1100;
    padding: 1rem;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 400px;
    position: relative;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #5c4033;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.3s ease;
  }

  .close-button:hover {
    background-color: #f5f0e6;
  }

  .modal-body {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .modal-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #5c4033;
    margin: 0;
    text-align: center;
  }

  .stars-container {
    display: flex;
    gap: 0.5rem;
  }

  .star-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 2rem;
    color: #ddd;
    transition: transform 0.2s ease;
  }

  .star-button:hover {
    transform: scale(1.1);
  }

  .star {
    display: inline-block;
  }

  .star.filled {
    color: #ffd700;
  }

  .rating-text {
    color: #5c4033;
    font-size: 1.1rem;
    text-align: center;
    min-height: 1.5rem;
  }

  .save-button {
    padding: 0.75rem 1.5rem;
    background: #5c4033;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 100%;
  }

  .save-button:hover:not(:disabled) {
    background: #4a3329;
  }

  .save-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
</style> 