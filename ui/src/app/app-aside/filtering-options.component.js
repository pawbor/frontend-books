import { filteringOptionsStore } from 'app/store';
import hookStream from 'common/hook-stream';
import jsx from 'utils/jsx';
import { Maybe } from 'utils/fp';

import ElementWithDivider from './element-with-divider.component';

import './filtering-options.component.css';

export default function FilteringOptions() {
  return (
    <>
      <h2 className="FilteringOptions__header">Pokaż tylko</h2>
      <ElementWithDivider render={renderListWithDivider} />
    </>
  );

  /**
   * @param {string} dividerClass
   */
  function renderListWithDivider(dividerClass) {
    const className = `FilteringOptions__list ${dividerClass}`;
    return (
      <ul className={className}>
        <PagesFilter />
      </ul>
    );
  }
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
  const pages = hookStream(filteringOptionsStore.pagesStream(), 0);

  return (
    <input
      className="PagesFilter__input"
      type="text"
      value={String(pages)}
      oninput={onInput}
    />
  );

  /**
   * @param {Event} event
   */
  function onInput(event) {
    const input = new Maybe(event.target).map((et) =>
      et instanceof HTMLInputElement ? et : null
    );

    input
      .map(({ value }) => Number(value))
      .map((value) => (isValid(value) ? value : null))
      .default(() => pages)
      .do((value) => {
        input.do((target) => (target.value = '' + value));
        filteringOptionsStore.setPages(value);
      });
  }

  /**
   * @param {number} value
   */
  function isValid(value) {
    return !isNaN(value) && Number.isInteger(value) && value < 9999;
  }
}
