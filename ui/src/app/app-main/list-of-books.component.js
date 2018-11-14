import hookStream from 'common/hook-stream';
import jsx from 'utils/jsx';
import { ReplayStream } from 'utils/streams';
import { hookPostRenderEffect } from 'utils/jsx/hooks';

import './list-of-books.component.css';

/** @type {ReplayStream<import('app/types').Book | undefined>} */
const modalBookStream = new ReplayStream({
  initialValue: undefined,
  bufferSize: 1,
});

/**
 * @param {Object} param0
 * @param {import('app/types').Book[]} param0.books
 */
export default function ListOfBooks({ books }) {
  const book = hookStream(modalBookStream, undefined);
  const listElements = books.map(renderBook);
  return (
    <>
      <ol className="ListOfBooks">{listElements}</ol>
      {book ? <BookCoverModal book={book} /> : undefined}
    </>
  );

  /**
   * @param {import('app/types').Book} book
   */
  function renderBook(book) {
    return <Book book={book} onCoverClick={openCoverModal} />;
  }

  /**
   * @param {import('app/types').Book} book
   */
  function openCoverModal(book) {
    modalBookStream.next(book);
  }
}

/**
 * @param {{book: import('app/types').Book}} param0
 */
function BookCoverModal({ book }) {
  const modal = (
    <div className="Modal" onclick={closeCoverModal}>
      <div className="Modal__contentWrapper">
        <img className="Modal__content" src={book.cover.large} />
      </div>
    </div>
  );

  hookPostRenderEffect(() => {
    const { body } = document;
    let modalContainer = document.createElement('div');
    body.appendChild(modalContainer);
    jsx.render(modal, modalContainer);
    body.classList.add('Modal__background');

    return () => {
      modalContainer.remove();
      body.classList.remove('Modal__background');
    };
  });

  function closeCoverModal() {
    modalBookStream.next(undefined);
  }
}

/**
 * @param {Object} param0
 * @param {import('app/types').Book} param0.book
 * @param {Function} param0.onCoverClick
 */
function Book({ book, onCoverClick }) {
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
