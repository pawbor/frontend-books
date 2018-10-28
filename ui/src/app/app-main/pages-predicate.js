export default function pagesPredicate(pages) {
  return pages ? (book) => book.pages > pages : () => true;
}
