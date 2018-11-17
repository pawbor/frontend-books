import { Observable } from 'utils/observable';

import { map } from 'utils/observable/transformations';

import filteringOptionsStore from '../filtering-options/filtering-options.store';
import sortingOptionsStore from '../sorting-options/sorting-options.store';
import SortingProperty from '../sorting-options/sorting-property.enum';
import books from './books.json';
import booksComparator from './books-comparator';
import pagesPredicate from './pages-predicate';

/**
 * @typedef {Object} ListOptionsState
 * @prop {number} pages
 * @prop {SortingProperty} sortingProperty
 */

const LocalStorageKey = {
  SortingProperty: '[List Options] sorting property',
  PagesFilter: '[List Options] pages filter',
};

/**
 * @type {import('utils/observable').Subscription | undefined}
 */
let localStorageSyncSubscription = undefined;

const listOptionsStore = {
  clearOptions() {
    filteringOptionsStore.setPages(0);
    sortingOptionsStore.setSortingProperty(SortingProperty.None);
  },
  startLocalStorageSync() {
    if (!localStorageSyncSubscription) {
      readOptionsFromLocalStorage();

      localStorageSyncSubscription = this.optionsStream().subscribe(
        updateOptionsInLocalStorage
      );
    }
  },
  stopLocalStorageSync() {
    if (localStorageSyncSubscription) {
      localStorageSyncSubscription.unsubscribe();
      localStorageSyncSubscription = undefined;
    }
  },

  /** @returns {Observable<ListOptionsState>} */
  optionsStream() {
    return Observable.combined([
      filteringOptionsStore.pagesStream(),
      sortingOptionsStore.sortingPropertyStream(),
    ]).transform(
      map(([pages, sortingProperty]) => ({
        pages,
        sortingProperty,
      }))
    );
  },

  booksStream() {
    return this.optionsStream().transform(map(optionsToBooks));

    /**
     * @param {ListOptionsState} param0
     * @returns {import('app/types').Book[]}
     */
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
  sortingOptionsStore.setSortingProperty(
    sortingProperty || SortingProperty.None
  );

  const pages = localStorage.getItem(LocalStorageKey.PagesFilter);
  filteringOptionsStore.setPages(Number(pages));
}

/**
 * @param {ListOptionsState} param0
 */
function updateOptionsInLocalStorage({ sortingProperty, pages }) {
  localStorage.setItem(LocalStorageKey.SortingProperty, sortingProperty);
  localStorage.setItem(LocalStorageKey.PagesFilter, `${pages}`);
}
