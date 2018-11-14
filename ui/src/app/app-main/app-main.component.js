import { listOptionsStore } from 'app/store';
import hookStream from 'common/hook-stream';
import jsx from 'utils/jsx';
import { sameContent } from 'utils/array';

import './app-main.component.css';
import ListOfBooks from './list-of-books.component';

export default function AppMain() {
  listOptionsStore.startLocalStorageSync();

  /** @type {import('app/types').Book[]} */
  const initialBooks = [];

  const books = hookStream(
    listOptionsStore.booksStream(),
    initialBooks,
    sameContent
  );

  return (
    <main className="AppMain">
      <ListOfBooks books={books} />
    </main>
  );
}
