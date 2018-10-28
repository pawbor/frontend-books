import { CombineLatestStream } from 'utils/streams';

import filteringOptionsStore from '../filtering-options/filtering-options.store';
import sortingOptionsStore from '../sorting-options/sorting-options.store';

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
};

export default listOptionsStore;
