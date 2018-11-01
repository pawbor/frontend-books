import jsx from 'utils/jsx';

import { listOptionsStore } from 'app/store';

import './app-main.component.css';
import ListOfBooks from './list-of-books.component';

export default function AppMain() {
  listOptionsStore.startLocalStorageSync();
  //TODO: need some kind of lifecycle hooks for cleanup

  
  const main = <main className="AppMain" />;
  listOptionsStore.booksStream().subscribe({ next: renderList });
  return main;

  /**
   * @param {import('app/types').Book[]} books
   */
  function renderList(books) {
    main.innerHTML = '';
    main.appendChild(<ListOfBooks books={books} />);
  }
}
