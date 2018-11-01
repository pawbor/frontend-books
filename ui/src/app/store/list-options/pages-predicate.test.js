import pagesPredicate from './pages-predicate';

test('filtering above limit', () => {
  const lowerLimit = 10;
  const booksToFilter = [
    BookWithPages(11),
    BookWithPages(9),
    BookWithPages(10),
    BookWithPages(12),
  ];
  const expectedResult = [booksToFilter[0], booksToFilter[3]];

  const predicate = pagesPredicate(lowerLimit);
  const result = booksToFilter.filter(predicate);
  expect(result).toEqual(expectedResult);
});

/** @param {number} pages */
function BookWithPages(pages) {
  return { pages };
}
