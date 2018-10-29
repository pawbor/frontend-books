import jsx from 'utils/jsx';

import Async from 'common/async';
import { listOptionsStore } from 'app/store';

import './app-main.component.css';
import ListOfBooks from './list-of-books.component';

export default function AppMain() {
  const trigger = listOptionsStore.booksStream();

  return (
    <main className="AppMain">
      <Async render={renderList} trigger={trigger} />
    </main>
  );

  function renderList(books) {
    return <ListOfBooks books={books} />;
  }
}
