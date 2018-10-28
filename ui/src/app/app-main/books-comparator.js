import { SortingProperty } from 'app/store';

const comparators = {
  [SortingProperty.Pages]: pagesComparator,
  [SortingProperty.ReleaseDate]: releaseDateComparator,
  [SortingProperty.Author]: authorComparator,
};

function pagesComparator(book1, book2) {
  const p1 = book1.pages;
  const p2 = book2.pages;
  return p1 - p2;
}

function releaseDateComparator(book1, book2) {
  const p1 = parseDate(book1.releaseDate);
  const p2 = parseDate(book2.releaseDate);
  return p1 - p2;
}

function parseDate(dateString) {
  const [month, year] = dateString.split('/').map(Number);
  return month + 12 * year;
}

function authorComparator(book1, book2) {
  const p1 = extractSurname(book1.author);
  const p2 = extractSurname(book2.author);
  return p1.localeCompare(p2);
}

function extractSurname(author) {
  return author.split(' ')[1];
}

function defaultComparator() {
  return -1;
}

export default function booksComparator(property) {
  return function compare(book1, book2) {
    const compareProperty = property
      ? comparators[property]
      : defaultComparator;
    return compareProperty(book1, book2);
  };
}
