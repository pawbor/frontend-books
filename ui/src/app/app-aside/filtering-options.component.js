import './filtering-options.component.css';

import jsx from 'utils/jsx';
import ElementWithDivider from './element-with-divider.component';

export default function FilteringOptions() {
  return (
    <>
      <h2 className="FilteringOptions__header">Pokaż tylko</h2>
      <ElementWithDivider render={List} />
    </>
  );
}

function List() {
  return (
    <ul className="FilteringOptions__list">
      <PagesFilter />
    </ul>
  );
}

function PagesFilter() {
  return (
    <li className="PagesFilter">
      <label className="PagesFilter__label">
        Powyżej <NumberInput /> stron
      </label>
    </li>
  );
}

function NumberInput() {
  return <input className="PagesFilter__input" type="number" />;
}
