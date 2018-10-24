import './list-of-books.component.css';

import jsx from 'utils/jsx';

export default function ListOfBooks({ props: { books } }) {
  return (
    <ol className="ListOfBooks">
      {books.map((book) => (
        <Book book={book} />
      ))}
    </ol>
  );
}

function Book({ props: { book } }) {
  return (
    <li className="Book">
      <img className="Book__cover" src={book.cover.small} />
      <div className="Book__properties">
        <span className="Book__property Book__property--title">
          <span className="Book__propertyValue">{book.title}</span>
        </span>
        <span className="Book__property Book__property--author">
          <span className="Book__propertyLabel">By</span>{' '}
          <span className="Book__propertyValue">{book.author}</span>
        </span>
        <span className="Book__property Book__property--other Book__property--releaseDate">
          <span className="Book__propertyLabel">Release Date:</span>
          <span className="Book__propertyValue">{book.releaseDate}</span>
        </span>
        <span className="Book__property Book__property--other Book__property--pages">
          <span className="Book__propertyLabel">Pages:</span>{' '}
          <span className="Book__propertyValue">{book.pages}</span>
        </span>
        <span className="Book__property Book__property--other Book__property--link">
          <span className="Book__propertyLabel">Link:</span>{' '}
          <span className="Book__propertyValue">
            <a className="Book__link" href={book.link}>shop</a>
          </span>
        </span>
      </div>
    </li>
  );
}
