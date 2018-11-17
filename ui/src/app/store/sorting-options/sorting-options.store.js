import { Store } from 'utils/store';
import { map } from 'utils/observable/transformations';
import SortingProperty from './sorting-property.enum';

const initialState = { property: SortingProperty.None };
const store = new Store({ initialState });
const sortingOptionsStore = {
  setSortingProperty(/** @type {SortingProperty} */ property) {
    store.setState({ property });
  },
  sortingPropertyStream() {
    return store.stateStream().transform(map(({ property }) => property));
  },
};

export default sortingOptionsStore;
