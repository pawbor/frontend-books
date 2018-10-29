import { CombineLatestStream } from 'utils/streams';

import { map } from 'utils/streams/transformations';

import filteringOptionsStore from '../filtering-options/filtering-options.store';
import sortingOptionsStore from '../sorting-options/sorting-options.store';
import books from './books';
import booksComparator from './books-comparator';
import pagesPredicate from './pages-predicate';

const LocalStorageKey = {
  SortingProperty: '[List Options] sorting property',
  PagesFilter: '[List Options] pages filter',
};

let localStorageSyncSubscription = undefined;

const listOptionsStore = {
  clearOptions() {
    filteringOptionsStore.setPages(0);
    sortingOptionsStore.setSortingProperty(undefined);
  },
  startLocalStorageSync() {
    if (!localStorageSyncSubscription) {
      readOptionsFromLocalStorage();

      localStorageSyncSubscription = this.optionsStream().subscribe({
        next: updateOptionsInLocalStorage,
      });
    }
  },
  stopLocalStorageSync() {
    if (localStorageSyncSubscription) {
      localStorageSyncSubscription.unsubscribe();
      localStorageSyncSubscription = undefined;
    }
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

function readOptionsFromLocalStorage() {
  const sortingProperty = localStorage.getItem(LocalStorageKey.SortingProperty);
  sortingOptionsStore.setSortingProperty(sortingProperty);

  const pages = localStorage.getItem(LocalStorageKey.PagesFilter);
  filteringOptionsStore.setPages(pages);
}

function updateOptionsInLocalStorage({ sortingProperty, pages }) {
  localStorage.setItem(LocalStorageKey.SortingProperty, sortingProperty);
  localStorage.setItem(LocalStorageKey.PagesFilter, pages);
}
