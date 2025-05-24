<script lang="ts">
  import { onMount } from 'svelte';
  import SearchResults from './SearchResults.svelte';
  import SearchTypeSelector from './SearchTypeSelector.svelte';
  
  let searchQuery = '';
  let books: any[] = [];
  let isLoading = false;
  let searchTimeout: NodeJS.Timeout;
  let searchType: 'book' | 'author' = 'book';

  async function searchBooks() {
    if (!searchQuery.trim()) {
      books = [];
      return;
    }

    isLoading = true;
    try {
      const searchParam = searchType === 'book' ? 'title' : 'author';
      const response = await fetch(
        `https://openlibrary.org/search.json?${searchParam}=${encodeURIComponent(searchQuery.trim())}`
      );
      const data = await response.json();
      books = data.docs.slice(0, 12); // Limitamos a 12 resultados
      console.log('Libros encontrados:', books);
    } catch (error) {
      console.error('Error searching books:', error);
      books = [];
    } finally {
      isLoading = false;
    }
  }

  function handleInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(searchBooks, 500); // Debounce de 500ms
  }

  function handleSearchTypeChange(event: CustomEvent<{ type: 'book' | 'author' }>) {
    searchType = event.detail.type;
    if (searchQuery.trim()) {
      searchBooks();
    }
  }
</script>

<div class="search-wrapper">
  <div class="search-container">
    <div class="search-bar">
      <svg 
        class="search-icon" 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        type="text"
        bind:value={searchQuery}
        on:input={handleInput}
        placeholder={searchType === 'book' ? "Buscar libros..." : "Buscar autores..."}
        class="search-input"
      />
      <SearchTypeSelector 
        selectedType={searchType}
        on:change={handleSearchTypeChange}
      />
    </div>
  </div>

  {#if isLoading}
    <div class="loading">Buscando...</div>
  {/if}

  <SearchResults {books} />
</div>

<style>
  .search-wrapper {
    width: 100%;
  }

  .search-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
  }

  .search-bar {
    position: relative;
    width: 100%;
    max-width: 800px;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    color: #5c4033;
    opacity: 0.7;
  }

  .search-input {
    flex: 1;
    padding: 1rem 1rem 1rem 3rem;
    font-size: 1.1rem;
    font-family: 'Poppins', sans-serif;
    color: #5c4033;
    background-color: #ffffff;
    border: 2px solid #f5f0e6;
    border-radius: 2rem;
    outline: none;
    transition: all 0.3s ease;
  }

  .search-input::placeholder {
    color: #5c4033;
    opacity: 0.5;
  }

  .search-input:focus {
    border-color: #5c4033;
    box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.1);
  }

  .loading {
    text-align: center;
    color: #5c4033;
    margin-top: 1rem;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    .search-bar {
      max-width: 90%;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .search-input {
      font-size: 1rem;
      padding: 0.8rem 1rem 0.8rem 2.5rem;
    }

    .search-icon {
      left: 0.75rem;
    }
  }
</style> 