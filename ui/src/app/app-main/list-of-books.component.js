import jsx from 'utils/jsx';

import './list-of-books.component.css';
import { ReplayStream } from 'utils/streams';

export default function ListOfBooks({ props: { books } }) {
  const modalBookStream = ReplayStream({
    initialValue: undefined,
    bufferSize: 1,
  });

  let modal = undefined;

  modalBookStream.subscribe({ next: renderModal });
  const listElements = books.map(renderBook);
  return <ol className="ListOfBooks">{listElements}</ol>;

  function renderBook(book) {
    return <Book book={book} onCoverClick={openCoverModal} />;
  }

  function renderModal(book) {
    const body = document.querySelector('body');

    if (modal) {
      modal.remove();
      body.classList.remove('Modal__background');
    }

    if (book) {
      modal = (
        <div className="Modal" onclick={closeCoverModal}>
          <div className="Modal__contentWrapper">
            <img className="Modal__content" src={book.cover.large} />
          </div>
        </div>
      );
      body.appendChild(modal);
      body.classList.add('Modal__background');
    }
  }

  function openCoverModal(book) {
    modalBookStream.next(book);
  }

  function closeCoverModal() {
    modalBookStream.next(undefined);
  }
}

function Book({ props: { book, onCoverClick } }) {
  return (
    <li className="Book">
      <img
        className="Book__cover"
        src={book.cover.small}
        onclick={() => onCoverClick(book)}
      />
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
            <a className="Book__link" href={book.link}>
              shop
            </a>
          </span>
        </span>
      </div>
    </li>
  );
}
