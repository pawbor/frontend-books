import jsx from 'utils/jsx';
import { filteringOptionsStore } from 'app/store';

import './filtering-options.component.css';
import ElementWithDivider from './element-with-divider.component';
import { Maybe } from 'utils/fp';

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
  /** @type {number} */
  let lastValidValue = 0;

  const input = (
    <input className="PagesFilter__input" type="text" oninput={onInput} />
  );

  filteringOptionsStore.pagesStream().subscribe({
    next: updateInput,
  });

  return input;

  /**
   * @param {number} pages
   */
  function updateInput(pages) {
    lastValidValue = pages;
    input.value = String(pages);
  }

  /**
   * @param {Event} event
   */
  function onInput(event) {
    lastValidValue = new Maybe(event.target)
      .map((et) => (et instanceof HTMLInputElement ? et : null))
      .map(({ value }) => Number(value))
      .map((value) => (isValid(value) ? value : null))
      .getValue(lastValidValue);

    filteringOptionsStore.setPages(lastValidValue);
  }

  /**
   * @param {number} value
   */
  function isValid(value) {
    return !isNaN(value) && Number.isInteger(value) && value < 9999;
  }
}
