import './app-aside.component.css';

import jsx from 'utils/jsx';
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
  return (
    <button className="AppAside__clear" type="button">
      {label}
    </button>
  );
}
