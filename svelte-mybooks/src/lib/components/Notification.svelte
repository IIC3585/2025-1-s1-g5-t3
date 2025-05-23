<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  
  export let message: string;
  export let type: 'success' | 'error' = 'success';
  export let duration = 3000;
  export let onClose: () => void;

  let timeout: NodeJS.Timeout;

  $: if (message) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      onClose();
    }, duration);
  }

  function handleClose() {
    clearTimeout(timeout);
    onClose();
  }
</script>

{#if message}
  <button 
    type="button"
    class="notification" 
    class:success={type === 'success'} 
    class:error={type === 'error'}
    transition:fly={{ y: -20, duration: 300 }}
    on:click={handleClose}
  >
    <span class="icon">{type === 'success' ? '✓' : '✕'}</span>
    <span class="message">{message}</span>
  </button>
{/if}

<style>
  .notification {
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: 'Poppins', sans-serif;
    font-size: 0.95rem;
    cursor: pointer;
    z-index: 2000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    min-width: 250px;
    border: none;
    background: inherit;
    color: inherit;
    text-align: left;
  }

  .success {
    background: #4caf50;
    color: white;
  }

  .error {
    background: #f44336;
    color: white;
  }

  .icon {
    font-size: 1.2rem;
  }

  .message {
    flex: 1;
  }

  @media (max-width: 768px) {
    .notification {
      left: 1rem;
      right: 1rem;
      min-width: auto;
    }
  }
</style> 