/**
 * @param {number} pages
 * @returns {import('utils/fp/types').Predicate<{pages: number}>}
 */
export default function pagesPredicate(pages) {
  return pages ? (book) => book.pages > pages : () => true;
}
