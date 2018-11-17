import jsx from 'utils/jsx';
import { listOptionsStore } from 'app/store';
import { Observable } from 'utils/observable';
import { filter } from 'utils/observable/transformations';

import './app-aside.component.css';
import SortingOptions from './sorting-options.component';
import FilteringOptions from './filtering-options.component';

export default function AppAside() {
  return (
    <aside className="AppAside">
      <SortingOptions />
      <FilteringOptions />
      <ClearButton>Wyczyść</ClearButton>
    </aside>
  );
}

/**
 * @param {Object} param0
 * @param {any} param0.children
 */
function ClearButton({ children }) {
  Observable.fromEvent({ target: document, type: 'keyup' })
    .transform(
      filter(
        (event) =>
          event instanceof KeyboardEvent && event.altKey && event.key === 'r'
      )
    )
    .subscribe({ next: clear });

  return (
    <button className="AppAside__clear" type="button" onclick={clear}>
      {children}
    </button>
  );

  function clear() {
    listOptionsStore.clearOptions();
  }
}
