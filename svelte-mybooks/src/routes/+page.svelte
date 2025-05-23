<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import SearchBar from '$lib/components/SearchBar.svelte';
</script>

<Navbar />

<main>
  <section class="hero">
    <div class="hero-content">
      <h1>Descubre tu próxima aventura literaria</h1>
      <p class="subtitle">Explora, comparte y encuentra tus libros favoritos en MyBooks</p>
      <SearchBar />
    </div>
  </section>
</main>

<style>
  main {
    margin-top: 4rem;
  }

  .hero {
    background-color: #ffffff;
    min-height: calc(100vh - 4rem);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    text-align: center;
    padding: 1rem 2rem;
  }

  .hero-content {
    max-width: 800px;
    margin-top: 2rem;
  }

  h1 {
    font-size: 3.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    font-family: 'Poppins', sans-serif;
    line-height: 1.2;
    letter-spacing: -0.5px;
    color: #5c4033;
  }

  .subtitle {
    font-size: 1.3rem;
    margin-bottom: 2rem;
    color: #5c4033;
    line-height: 1.6;
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }

    .subtitle {
      font-size: 1.2rem;
    }
  }
</style>
