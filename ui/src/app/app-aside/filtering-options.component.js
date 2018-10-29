import jsx from 'utils/jsx';
import { filteringOptionsStore } from 'app/store';

import './filtering-options.component.css';
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
        Powyżej <PagesInput /> stron
      </label>
    </li>
  );
}

function PagesInput() {
  let lastValidValue = undefined;

  const input = (
    <input className="PagesFilter__input" type="text" oninput={onInput} />
  );

  filteringOptionsStore.pagesStream().subscribe({
    next: updateInput,
  });

  return input;

  function updateInput(pages) {
    lastValidValue = pages;
    input.value = textify(pages);
  }

  function onInput(event) {
    const { value } = event.target;
    const invalid = isNaN(value) || value.slice(-1)[0] === '.';
    if (!invalid) {
      lastValidValue = Number(value);
    }
    filteringOptionsStore.setPages(lastValidValue);
  }

  function textify(pages) {
    if (pages === null || pages === undefined) {
      return '';
    } else {
      return String(pages);
    }
  }
}
