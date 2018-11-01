import booksComparator from './books-comparator';
import { SortingProperty } from 'app/store';

test('sorting by pages', () => {
  const booksToSort = [
    BookWithPages(11),
    BookWithPages(10),
    BookWithPages(9),
    BookWithPages(12),
  ];
  const expectedResult = [
    booksToSort[2],
    booksToSort[1],
    booksToSort[0],
    booksToSort[3],
  ];

  const predicate = booksComparator(SortingProperty.Pages);
  const result = booksToSort.slice().sort(predicate);
  expect(result).toEqual(expectedResult);

  /**
   * @param {number} pages
   */
  function BookWithPages(pages) {
    return Object.assign(emptyBook(), { pages });
  }
});

test('sorting by author', () => {
  const booksToSort = [
    BookWithAuthor('Buzz Aldrin'),
    BookWithAuthor('Michael Collins'),
    BookWithAuthor('Niel Armstrong'),
    BookWithAuthor('Virgil Grissom'),
  ];
  const expectedResult = [
    booksToSort[0],
    booksToSort[2],
    booksToSort[1],
    booksToSort[3],
  ];

  const predicate = booksComparator(SortingProperty.Author);
  const result = booksToSort.slice().sort(predicate);
  expect(result).toEqual(expectedResult);

  /**
   * @param {string} author
   */
  function BookWithAuthor(author) {
    return Object.assign(emptyBook(), { author });
  }
});

test('sorting by release date', () => {
  const booksToSort = [
    BookWithReleaseDate('07/2017'),
    BookWithReleaseDate('03/2017'),
    BookWithReleaseDate('02/2018'),
    BookWithReleaseDate('11/2016'),
  ];
  const expectedResult = [
    booksToSort[3],
    booksToSort[1],
    booksToSort[0],
    booksToSort[2],
  ];

  const predicate = booksComparator(SortingProperty.ReleaseDate);
  const result = booksToSort.slice().sort(predicate);
  expect(result).toEqual(expectedResult);

  /**
   * @param {string} releaseDate
   */
  function BookWithReleaseDate(releaseDate) {
    return Object.assign(emptyBook(), { releaseDate });
  }
});

/**
 * @returns {import('app/types').Book}
 */
function emptyBook() {
  return {
    author: '',
    cover: { large: '', small: '' },
    link: '',
    pages: 0,
    releaseDate: '',
    title: '',
  };
}
