import jsx from 'utils/jsx';
import books from './books';
import ListOfBooks from './list-of-books.component';

export default function AppMain() {
  return (
    <main className="AppMain">
      <ListOfBooks books={books} />
    </main>
  );
}
