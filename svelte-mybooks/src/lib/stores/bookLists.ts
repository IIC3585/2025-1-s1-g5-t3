import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Book = {
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  key: string;
  publisher?: string[];
  language?: string[];
  subject?: string[];
  number_of_pages_median?: number;
  rating?: number;
};

function createBookList(key: string) {
  const stored = browser ? localStorage.getItem(key) : null;
  const { subscribe, set, update } = writable<Book[]>(stored ? JSON.parse(stored) : []);

  return {
    subscribe,
    add: (book: Book) => update(books => {
      const existingIndex = books.findIndex(b => b.key === book.key);
      if (existingIndex !== -1) {
        const newBooks = [...books];
        newBooks[existingIndex] = book;
        if (browser) {
          localStorage.setItem(key, JSON.stringify(newBooks));
        }
        return newBooks;
      }
      const newBooks = [...books, book];
      if (browser) {
        localStorage.setItem(key, JSON.stringify(newBooks));
      }
      return newBooks;
    }),
    update: (bookKey: string, updates: Partial<Book>) => update(books => {
      const newBooks = books.map(book => 
        book.key === bookKey ? { ...book, ...updates } : book
      );
      if (browser) {
        localStorage.setItem(key, JSON.stringify(newBooks));
      }
      return newBooks;
    }),
    remove: (bookKey: string) => update(books => {
      const newBooks = books.filter(b => b.key !== bookKey);
      if (browser) {
        localStorage.setItem(key, JSON.stringify(newBooks));
      }
      return newBooks;
    }),
    has: (bookKey: string) => {
      let has = false;
      subscribe(books => {
        has = books.some(b => b.key === bookKey);
      })();
      return has;
    }
  };
}

export const readBooks = createBookList('readBooks');
export const recommendedBooks = createBookList('recommendedBooks');
export const wantToReadBooks = createBookList('wantToReadBooks'); 