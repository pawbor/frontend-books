import jsx from 'utils/jsx';
import { SortingProperty, sortingOptionsStore } from 'app/store';
import Invisible from 'common/invisible/invisible.component';

import './sorting-options.component.css';
import ElementWithDivider from './element-with-divider.component';
import { Maybe } from 'utils/fp';

const options = [
  {
    optionClass: 'SortingOptions__pages',
    optionLabel: 'ilości stron',
    optionValue: SortingProperty.Pages,
  },
  {
    optionClass: 'SortingOptions__releaseDate',
    optionLabel: 'dacie wydania',
    optionValue: SortingProperty.ReleaseDate,
  },
  {
    optionClass: 'SortingOptions__author',
    optionLabel: 'nazwisku autora',
    optionValue: SortingProperty.Author,
  },
];

export default function SortingOptions() {
  return (
    <>
      <h2 className="SortingOptions__header">Sortuj po</h2>
      <ElementWithDivider render={List} />
    </>
  );
}

function List() {
  const listElements = options.map(
    ({ optionValue, optionLabel, optionClass }) => (
      <SortingOption value={optionValue} className={optionClass}>
        {optionLabel}
      </SortingOption>
    )
  );
  return <ul className="SortingOptions__list">{listElements}</ul>;
}

/**
 * @param {Object} param0
 * @param {Object} param0.props
 * @param {import('app/store').SortingProperty} param0.props.value
 * @param {string} param0.props.className
 * @param {import('utils/jsx/types').JsxChild[]} param0.children
 */
function SortingOption({ props: { value, className }, children: [label] }) {
  return (
    <li className="SortingOption">
      <label className="SortingOption__label">
        <Invisible render={renderRadioInput} />
        <span className="SortingOption__text">{label}</span>
      </label>
    </li>
  );

  function renderRadioInput() {
    return <RadioInput value={value} className={className} />;
  }
}

/**
 * @param {Object} param0
 * @param {Object} param0.props
 * @param {import('app/store').SortingProperty} param0.props.value
 * @param {string} param0.props.className
 */
function RadioInput({ props: { value, className } }) {
  const input = (
    <input
      className={`SortingOption__radio ${className}`}
      type="radio"
      name="sort"
      value={value}
      onchange={onChange}
    />
  );

  sortingOptionsStore.sortingPropertyStream().subscribe({
    next: updateInput,
  });

  return input;

  /**
   * @param {import('app/store').SortingProperty} sortingProperty
   */
  function updateInput(sortingProperty) {
    input.checked = sortingProperty === value;
  }

  /**
   * @param {Event} event
   */
  function onChange(event) {
    const value = new Maybe(event.target)
      .map((et) => (et instanceof HTMLInputElement ? et : null))
      .map(({ value }) => value)
      .getValue(SortingProperty.None);
    sortingOptionsStore.setSortingProperty(value);
  }
}
