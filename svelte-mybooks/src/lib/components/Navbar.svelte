<script lang="ts">
  import { page } from '$app/stores';
</script>

<nav class="navbar">
  <div class="navbar-container">
    <a href="/" class="logo">
      <span class="logo-text">MyBooks</span>
    </a>
    
    <div class="nav-links">
      <a 
        href="/profile" 
        class="nav-link" 
        class:active={$page.url.pathname === '/profile'}
      >
        Perfil
      </a>
      <a 
        href="/recomendations" 
        class="nav-link"
        class:active={$page.url.pathname === '/recomendations'}
      >
        Recomendaciones
      </a>
    </div>
  </div>
</nav>

<style>
  .navbar {
    background-color: #f5f0e6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    padding: 1rem 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }

  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    text-decoration: none;
  }

  .logo-text {
    font-size: 1.8rem;
    font-weight: 600;
    color: #5c4033;
    font-family: 'Poppins', sans-serif;
    letter-spacing: -0.5px;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
  }

  .nav-link {
    text-decoration: none;
    color: #5c4033;
    font-size: 1rem;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
    padding: 0.5rem 0;
    position: relative;
    transition: color 0.3s ease;
  }

  .nav-link:hover {
    color: #3c2a21;
  }

  .nav-link.active {
    color: #3c2a21;
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #3c2a21;
    transform: scaleX(1);
    transition: transform 0.3s ease;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #3c2a21;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  .nav-link:hover::after {
    transform: scaleX(1);
  }
</style> 