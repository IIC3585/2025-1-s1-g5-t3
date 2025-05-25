<script lang="ts">
  export let likedBook: any;
</script>

<div class="liked-book">
  <h2>Porque te gustó <span class="highlight">{likedBook.title}</span></h2>
  <div class="cover-container">
    {#if likedBook.cover_i}
      <img src={`https://covers.openlibrary.org/b/id/${likedBook.cover_i}-M.jpg`} alt={`Portada de ${likedBook.title}`} />
    {:else}
      <div class="no-cover">Sin portada</div>
    {/if}
  </div>
</div>

<style>
  .liked-book {
    min-width: 180px;
    text-align: center;
  }
  .highlight {
    color: #8d4a2c;
    font-weight: 600;
  }
  .cover-container {
    margin-top: 1rem;
    width: 120px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f0e6;
    border-radius: 8px;
    overflow: hidden;
  }
  .cover-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .no-cover {
    color: #5c4033;
    font-size: 1rem;
  }
</style> 