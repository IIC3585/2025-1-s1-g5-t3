<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  
  export let selectedType: 'book' | 'author' = 'book';
  
  const dispatch = createEventDispatcher<{
    change: { type: 'book' | 'author' };
  }>();

  let isOpen = false;

  function handleTypeChange(type: 'book' | 'author') {
    selectedType = type;
    dispatch('change', { type });
    isOpen = false;
  }

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      isOpen = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isOpen = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<div class="dropdown-container">
  <button
    type="button"
    class="dropdown-button"
    on:click={toggleDropdown}
    aria-expanded={isOpen}
    aria-haspopup="listbox"
  >
    <span>{selectedType === 'book' ? 'Libro' : 'Autor'}</span>
    <svg 
      class="dropdown-icon" 
      class:open={isOpen}
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </button>

  {#if isOpen}
    <div 
      class="dropdown-menu"
      role="listbox"
      transition:fly={{ y: -10, duration: 200 }}
    >
      <button
        type="button"
        class="dropdown-option"
        class:active={selectedType === 'book'}
        on:click={() => handleTypeChange('book')}
        role="option"
        aria-selected={selectedType === 'book'}
      >
        Libro
      </button>
      <button
        type="button"
        class="dropdown-option"
        class:active={selectedType === 'author'}
        on:click={() => handleTypeChange('author')}
        role="option"
        aria-selected={selectedType === 'author'}
      >
        Autor
      </button>
    </div>
  {/if}
</div>

<style>
  .dropdown-container {
    position: relative;
    min-width: 120px;
  }

  .dropdown-button {
    width: 100%;
    padding: 0.75rem 1rem;
    background: #f5f0e6;
    border: 1px solid rgba(92, 64, 51, 0.1);
    border-radius: 8px;
    color: #5c4033;
    font-family: 'Poppins', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(92, 64, 51, 0.1);
  }

  .dropdown-button:hover {
    background: #ebe4d8;
  }

  .dropdown-icon {
    transition: transform 0.3s ease;
  }

  .dropdown-icon.open {
    transform: rotate(180deg);
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(92, 64, 51, 0.15);
    border: 1px solid rgba(92, 64, 51, 0.1);
    z-index: 1000;
    overflow: hidden;
  }

  .dropdown-option {
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: transparent;
    color: #5c4033;
    font-family: 'Poppins', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
  }

  .dropdown-option:hover {
    background: #f5f0e6;
  }

  .dropdown-option.active {
    background: #5c4033;
    color: white;
  }

  @media (max-width: 768px) {
    .dropdown-container {
      min-width: 100px;
    }

    .dropdown-button {
      padding: 0.6rem 0.75rem;
      font-size: 0.9rem;
    }

    .dropdown-option {
      padding: 0.6rem 0.75rem;
      font-size: 0.9rem;
    }
  }
</style> 