import { Store } from 'utils/store';
import { map } from 'utils/observable/transformations';

const initialState = { pages: 0 };
const store = new Store({ initialState });
const filteringOptionsStore = {
  /** @param {number} pages */
  setPages(pages) {
    store.setState({ pages: pages || 0 });
  },
  pagesStream() {
    return store.stateStream().transform(map(({ pages }) => pages));
  },
};

export default filteringOptionsStore;
