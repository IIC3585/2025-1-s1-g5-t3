import { ref, watch } from 'vue'

function useBookList(key) {
  const stored = localStorage.getItem(key)
  const books = ref(stored ? JSON.parse(stored) : [])

  watch(books, (newVal) => {
    localStorage.setItem(key, JSON.stringify(newVal))
  }, { deep: true })

  function add(book) {
    if (!books.value.some(b => b.key === book.key)) {
      books.value.push(book)
    }
  }

  function remove(bookKey) {
    books.value = books.value.filter(b => b.key !== bookKey)
  }

  function has(bookKey) {
    return books.value.some(b => b.key === bookKey)
  }

  return { books, add, remove, has }
}

export function useBookLists() {
  const readBooks = useBookList('readBooks')
  const recommendedBooks = useBookList('recommendedBooks')
  const wantToReadBooks = useBookList('wantToReadBooks')

  return { readBooks, recommendedBooks, wantToReadBooks }
}