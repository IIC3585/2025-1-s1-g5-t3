<template>
  <div class="stats-card">
    <h3>Estadísticas</h3>
    <ul>
      <li>Total de libros leídos: <b>12</b></li>
      <li>Total de libros por leer: <b>5</b></li>
      <li>Páginas leídas en total: <b>3,200</b></li>
      <li>Tema favorito: <b>Fantasía</b></li>
      <li>Autor favorito: <b>J.K. Rowling</b></li>
    </ul>
  </div>
</template>

<style scoped>
.stats-card {
  background: #fff;
  border: 2px solid #ccc;
  border-radius: 20px;
  padding: 2em 1.5em;
  min-width: 320px;
  min-height: 350px;
  box-shadow: 0 2px 8px #0001;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1.1em;
}
.stats-card h3 {
  margin-bottom: 1em;
  color: #a33;
}
.stats-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.stats-card li {
  margin-bottom: 0.8em;
}
</style>