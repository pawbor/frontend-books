import { Store } from 'utils/store';
import { map } from 'utils/streams/transformations';

const initialState = { pages: undefined };
const store = Store({ initialState });
const filteringOptionsStore = {
  setPages(pages) {
    store.setState({ pages });
  },
  pagesStream() {
    return store.stateStream().transform(map(({ pages }) => pages));
  },
};

export default filteringOptionsStore;