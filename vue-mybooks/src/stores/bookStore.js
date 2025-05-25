import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useBookStore = defineStore('books', () => {
  // Estado
  const readBooks = ref(loadFromLocalStorage('readBooks', []))
  const recommendedBooks = ref(loadFromLocalStorage('recommendedBooks', []))
  const wantToReadBooks = ref(loadFromLocalStorage('wantToReadBooks', []))
  const selectedList = ref('read')
  const selectedBook = ref(null)

  // Persistencia en localStorage
  watch(readBooks, value => saveToLocalStorage('readBooks', value), { deep: true })
  watch(recommendedBooks, value => saveToLocalStorage('recommendedBooks', value), { deep: true })
  watch(wantToReadBooks, value => saveToLocalStorage('wantToReadBooks', value), { deep: true })

  // Funciones de persistencia
  function loadFromLocalStorage(key, defaultValue) {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  }

  function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  // Getters
  const currentBooks = computed(() => {
    if (selectedList.value === 'read') return readBooks.value
    if (selectedList.value === 'recommended') return recommendedBooks.value
    if (selectedList.value === 'want') return wantToReadBooks.value
    return []
  })

  // Acciones
  function addBook(book, listName) {
    const targetList = getListByName(listName)
    if (targetList && !targetList.value.some(b => b.key === book.key)) {
      targetList.value.push(book)
      selectedList.value = listName
    }
  }

  function removeBook(bookKey, listName) {
    const targetList = getListByName(listName)
    if (targetList) {
      targetList.value = targetList.value.filter(b => b.key !== bookKey)
      selectedList.value = listName
    }
  }

  function setSelectedList(listName) {
    selectedList.value = listName
  }

  function openBookModal(book) {
    selectedBook.value = book
  }

  function closeBookModal() {
    selectedBook.value = null
  }

  // Nueva función para valoración
  function rateBook(bookKey, rating) {
    const book = readBooks.value.find(b => b.key === bookKey)
    if (book) {
      book.rating = rating
      return true
    }
    return false
  }

  // Helper
  function getListByName(listName) {
    switch (listName) {
      case 'read': return readBooks
      case 'recommended': return recommendedBooks
      case 'want': return wantToReadBooks
      default: return null
    }
  }

  return {
    // Estado
    readBooks,
    recommendedBooks,
    wantToReadBooks,
    selectedList,
    selectedBook,
    // Getters
    currentBooks,
    // Acciones
    addBook,
    removeBook,
    setSelectedList,
    openBookModal,
    closeBookModal,
    rateBook
  }
})