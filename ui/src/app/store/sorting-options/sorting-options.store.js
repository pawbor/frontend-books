import { Store } from 'utils/store';
import { map } from 'utils/streams/transformations';

const initialState = { property: undefined };
const store = Store({ initialState });
const sortingOptionsStore = {
  setSortingProperty(property) {
    store.setState({ property });
  },
  sortingPropertyStream() {
    return store.stateStream().transform(map(({ property }) => property));
  },
};

export default sortingOptionsStore;
