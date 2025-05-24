import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookStore = defineStore('books', () => {
  // Estado
  const readBooks = ref([])
  const recommendedBooks = ref([])
  const wantToReadBooks = ref([])
  const selectedList = ref('read')
  const selectedBook = ref(null)

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
    closeBookModal
  }
}) 