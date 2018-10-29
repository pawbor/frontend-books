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

  function BookWithPages(pages) {
    return { pages };
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

  function BookWithAuthor(author) {
    return { author };
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

  function BookWithReleaseDate(releaseDate) {
    return { releaseDate };
  }
});

