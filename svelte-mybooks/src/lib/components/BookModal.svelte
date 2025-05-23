<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { readBooks, recommendedBooks, wantToReadBooks } from '$lib/stores/bookLists';
  import Notification from './Notification.svelte';
  
  export let isOpen = false;
  export let book: {
    title: string;
    author_name?: string[];
    cover_i?: number;
    first_publish_year?: number;
    key: string;
    publisher?: string[];
    language?: string[];
    subject?: string[];
    number_of_pages_median?: number;
  } | null = null;

  const dispatch = createEventDispatcher();
  let isInReadList = false;
  let isInRecommendedList = false;
  let isInWantToReadList = false;

  let notificationMessage = '';
  let notificationType: 'success' | 'error' = 'success';

  $: if (book) {
    isInReadList = readBooks.has(book.key);
    isInRecommendedList = recommendedBooks.has(book.key);
    isInWantToReadList = wantToReadBooks.has(book.key);
  }

  function showNotification(message: string, type: 'success' | 'error' = 'success') {
    notificationMessage = message;
    notificationType = type;
  }

  function clearNotification() {
    notificationMessage = '';
  }

  function closeModal() {
    dispatch('close');
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x400?text=No+Image';
  }

  function toggleReadList() {
    if (book) {
      try {
        if (isInReadList) {
          readBooks.remove(book.key);
          showNotification('Libro removido de Leídos');
        } else {
          readBooks.add(book);
          showNotification('Libro agregado a Leídos');
        }
        isInReadList = !isInReadList;
      } catch (error) {
        showNotification('Error al actualizar la lista', 'error');
      }
    }
  }

  function toggleRecommendedList() {
    if (book) {
      try {
        if (isInRecommendedList) {
          recommendedBooks.remove(book.key);
          showNotification('Libro removido de Recomendados');
        } else {
          recommendedBooks.add(book);
          showNotification('Libro agregado a Recomendados');
        }
        isInRecommendedList = !isInRecommendedList;
      } catch (error) {
        showNotification('Error al actualizar la lista', 'error');
      }
    }
  }

  function toggleWantToReadList() {
    if (book) {
      try {
        if (isInWantToReadList) {
          wantToReadBooks.remove(book.key);
          showNotification('Libro removido de Quiero Leer');
        } else {
          wantToReadBooks.add(book);
          showNotification('Libro agregado a Quiero Leer');
        }
        isInWantToReadList = !isInWantToReadList;
      } catch (error) {
        showNotification('Error al actualizar la lista', 'error');
      }
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<Notification 
  message={notificationMessage}
  type={notificationType}
  onClose={clearNotification}
/>

{#if isOpen && book}
  <div 
    class="modal-backdrop" 
    on:click={handleBackdropClick}
    on:keydown={handleKeydown}
    role="button"
    tabindex="0"
    transition:fade={{ duration: 200 }}
  >
    <div class="modal-content" transition:slide={{ duration: 200 }}>
      <button class="close-button" on:click={closeModal}>×</button>
      
      <div class="modal-body">
        <div class="book-cover-large">
          {#if book.cover_i}
            <img 
              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`} 
              alt={`Portada de ${book.title}`}
              on:error={handleImageError}
            />
          {:else}
            <div class="no-cover-large">Sin portada</div>
          {/if}
        </div>

        <div class="book-details">
          <h2 class="book-title">{book.title}</h2>
          
          {#if book.author_name}
            <p class="book-author">
              <span class="label">Autor:</span> {book.author_name.join(', ')}
            </p>
          {/if}

          {#if book.first_publish_year}
            <p class="book-year">
              <span class="label">Año de publicación:</span> {book.first_publish_year}
            </p>
          {/if}

          {#if book.publisher}
            <p class="book-publisher">
              <span class="label">Editorial:</span> {book.publisher.join(', ')}
            </p>
          {/if}

          {#if book.language}
            <p class="book-language">
              <span class="label">Idioma:</span> {book.language.join(', ')}
            </p>
          {/if}

          {#if book.number_of_pages_median}
            <p class="book-pages">
              <span class="label">Páginas:</span> {book.number_of_pages_median}
            </p>
          {/if}

          {#if book.subject}
            <div class="book-subjects">
              <span class="label">Temas:</span>
              <div class="subjects-list">
                {#each book.subject.slice(0, 5) as subject}
                  <span class="subject-tag">{subject}</span>
                {/each}
              </div>
            </div>
          {/if}

          <div class="book-actions">
            <button 
              class="action-button" 
              class:active={isInReadList}
              on:click={toggleReadList}
            >
              {isInReadList ? '✓ Leído' : 'Agregar a Leídos'}
            </button>
            <button 
              class="action-button" 
              class:active={isInRecommendedList}
              on:click={toggleRecommendedList}
            >
              {isInRecommendedList ? '✓ Recomendado' : 'Agregar a Recomendados'}
            </button>
            <button 
              class="action-button" 
              class:active={isInWantToReadList}
              on:click={toggleWantToReadList}
            >
              {isInWantToReadList ? '✓ Quiero Leer' : 'Agregar a Quiero Leer'}
            </button>
          </div>
        </div>
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
    z-index: 1000;
    padding: 1rem;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
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
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    padding: 2rem;
  }

  .book-cover-large {
    width: 100%;
    height: 400px;
    background: #f5f0e6;
    border-radius: 8px;
    overflow: hidden;
  }

  .book-cover-large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .no-cover-large {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5c4033;
    font-size: 1rem;
  }

  .book-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .book-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #5c4033;
    margin: 0 0 1rem 0;
    line-height: 1.3;
  }

  .label {
    font-weight: 600;
    color: #5c4033;
  }

  .book-author,
  .book-year,
  .book-publisher,
  .book-language,
  .book-pages {
    color: #5c4033;
    margin: 0;
    line-height: 1.5;
  }

  .book-subjects {
    margin-top: 0.5rem;
  }

  .subjects-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .subject-tag {
    background: #f5f0e6;
    color: #5c4033;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.9rem;
  }

  .book-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #f5f0e6;
  }

  .action-button {
    padding: 0.75rem 1rem;
    border: 2px solid #5c4033;
    border-radius: 0.5rem;
    background: transparent;
    color: #5c4033;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
  }

  .action-button:hover {
    background: #f5f0e6;
  }

  .action-button.active {
    background: #5c4033;
    color: white;
  }

  @media (max-width: 768px) {
    .modal-body {
      grid-template-columns: 1fr;
    }

    .book-cover-large {
      height: 300px;
    }

    .book-title {
      font-size: 1.5rem;
    }

    .book-actions {
      margin-top: 1rem;
      padding-top: 1rem;
    }
  }
</style> 