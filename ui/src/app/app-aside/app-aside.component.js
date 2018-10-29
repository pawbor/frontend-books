import jsx from 'utils/jsx';
import { listOptionsStore } from 'app/store';
import { EventTargetStream } from 'utils/streams';
import { filter } from 'utils/streams/transformations';

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

function ClearButton({ children: [label] }) {
  EventTargetStream(document, 'keyup')
    .transform(filter((event) => event.altKey && event.key === 'r'))
    .subscribe({next: clear});

  return (
    <button className="AppAside__clear" type="button" onclick={clear}>
      {label}
    </button>
  );

  function clear() {
    listOptionsStore.clearOptions();
  }
}
