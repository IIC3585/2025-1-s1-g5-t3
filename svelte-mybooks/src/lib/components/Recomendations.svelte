<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let recommendations: any[] = [];
  const dispatch = createEventDispatcher();

  function handleBookClick(book: any) {
    const transformedBook = {
      title: book.title ?? '',
      author_name: book.authors?.map((author: any) => author.name) ?? [],
      cover_i: book.cover_id ?? book.cover_i ?? undefined,
      first_publish_year: book.first_publish_year ?? undefined,
      key: book.key ?? '',
      subject: book.subject?.slice(0, 5) ?? undefined,
      publisher: book.publisher ?? undefined,
      language: book.language ?? undefined,
      number_of_pages_median: book.number_of_pages_median ?? undefined,
      rating: book.rating ?? undefined
    };
    dispatch('bookClick', transformedBook);
  }

  function handleKeydown(event: KeyboardEvent, book: any) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleBookClick(book);
    }
  }
</script>

<div class="recomendations">
  <h3>Te podrían gustar:</h3>
  <div class="recomendation-list">
    {#each recommendations as rec}
      <button 
        class="recomendation-item" 
        on:click={() => handleBookClick(rec)}
        on:keydown={(e) => handleKeydown(e, rec)}
      >
        <div class="cover-container">
          {#if rec.cover_id}
            <img src={`https://covers.openlibrary.org/b/id/${rec.cover_id}-M.jpg`} alt={`Portada de ${rec.title}`} />
          {:else}
            <div class="no-cover">Sin portada</div>
          {/if}
        </div>
        <div class="rec-info">
          <div class="rec-title">{rec.title}</div>
          <div class="rec-author">{rec.authors && rec.authors[0]?.name}</div>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .recomendations {
    flex: 1;
  }
  .recomendation-list {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    margin-top: 1rem;
  }
  .recomendation-item {
    cursor: pointer;
    background: #f5f0e6;
    border-radius: 10px;
    padding: 1rem;
    width: 140px;
    text-align: center;
    transition: box-shadow 0.2s;
    border: none;
    font-family: inherit;
  }
  .recomendation-item:hover {
    box-shadow: 0 4px 16px rgba(92,64,51,0.13);
  }
  .cover-container {
    width: 100px;
    height: 150px;
    margin: 0 auto 0.5rem auto;
    background: #fff;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cover-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .no-cover {
    color: #5c4033;
    font-size: 0.9rem;
  }
  .rec-title {
    font-weight: 600;
    color: #5c4033;
    margin-bottom: 0.3rem;
    font-size: 1rem;
  }
  .rec-author {
    color: #8d4a2c;
    font-size: 0.95rem;
  }
</style> 