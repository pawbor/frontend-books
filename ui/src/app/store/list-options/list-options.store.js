import { CombineLatestStream } from 'utils/streams';

import { map } from 'utils/streams/transformations';

import filteringOptionsStore from '../filtering-options/filtering-options.store';
import sortingOptionsStore from '../sorting-options/sorting-options.store';
import books from './books';
import booksComparator from './books-comparator';
import pagesPredicate from './pages-predicate';

const listOptionsStore = {
  clearOptions() {
    filteringOptionsStore.setPages(0);
    sortingOptionsStore.setSortingProperty(undefined);
  },
  optionsStream() {
    return CombineLatestStream({
      pages: filteringOptionsStore.pagesStream(),
      sortingProperty: sortingOptionsStore.sortingPropertyStream(),
    });
  },
  booksStream() {
    return this.optionsStream().transform(map(optionsToBooks));

    function optionsToBooks({ pages, sortingProperty }) {
      const predicate = pagesPredicate(pages);
      const comparator = booksComparator(sortingProperty);
      return books
        .slice()
        .filter(predicate)
        .sort(comparator);
    }
  },
};

export default listOptionsStore;
