import SortingProperty from '../sorting-options/sorting-property.enum';

const comparators = {
  [SortingProperty.None]: defaultComparator,
  [SortingProperty.Pages]: pagesComparator,
  [SortingProperty.ReleaseDate]: releaseDateComparator,
  [SortingProperty.Author]: authorComparator,
};

/**
 * @param {import('app/types').Book} book1
 * @param {import('app/types').Book} book2
 */
function pagesComparator(book1, book2) {
  const p1 = book1.pages;
  const p2 = book2.pages;
  return p1 - p2;
}

/**
 * @param {import('app/types').Book} book1
 * @param {import('app/types').Book} book2
 */
function releaseDateComparator(book1, book2) {
  const p1 = parseDate(book1.releaseDate);
  const p2 = parseDate(book2.releaseDate);
  return p1 - p2;
}

/**
 * @param {string} dateString
 */
function parseDate(dateString) {
  const [month, year] = dateString.split('/').map(Number);
  return month + 12 * year;
}

/**
 * @param {import('app/types').Book} book1
 * @param {import('app/types').Book} book2
 */
function authorComparator(book1, book2) {
  const p1 = extractSurname(book1.author);
  const p2 = extractSurname(book2.author);
  return p1.localeCompare(p2);
}

/**
 * @param {string} author
 */
function extractSurname(author) {
  return author.split(' ')[1];
}

function defaultComparator() {
  return -1;
}

/**
 * @param {SortingProperty} property
 */
export default function booksComparator(property) {
  return compare;

  /**
   * @param {import('app/types').Book} book1
   * @param {import('app/types').Book} book2
   */
  function compare(book1, book2) {
    const compareProperty = comparators[property];
    if (!compareProperty) {
      throw new Error(`Cannot compare ${property}`);
    }
    return compareProperty(book1, book2);
  }
}
