import { SortingProperty, sortingOptionsStore } from 'app/store';
import Invisible from 'common/invisible/invisible.component';
import hookStream from 'common/hook-stream';
import jsx from 'utils/jsx';
import { Maybe } from 'utils/fp';

import './sorting-options.component.css';
import ElementWithDivider from './element-with-divider.component';

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
      <SortingOptionsList />
    </>
  );
}

function SortingOptionsList() {
  const currentSelection = hookStream(
    sortingOptionsStore.sortingPropertyStream(),
    SortingProperty.None
  );

  const listElements = options.map(
    ({ optionValue, optionLabel, optionClass }) => (
      <SortingOption
        value={optionValue}
        currentSelection={currentSelection}
        optionClass={optionClass}
      >
        {optionLabel}
      </SortingOption>
    )
  );

  return <ElementWithDivider render={renderListWithDivider} />;

  /**
   * @param {string} dividerClass
   */
  function renderListWithDivider(dividerClass) {
    const className = `SortingOptions__list ${dividerClass}`;
    return <ul className={className}>{listElements}</ul>;
  }
}

/**
 * @param {Object} param0
 * @param {import('app/store').SortingProperty} param0.value
 * @param {string} param0.currentSelection
 * @param {string} param0.optionClass
 * @param {any} param0.children
 */
function SortingOption({
  value,
  currentSelection,
  optionClass,
  children: label,
}) {
  return (
    <li className="SortingOption">
      <label className="SortingOption__label">
        <Invisible render={renderInvisibleRadioInput} />
        <span className="SortingOption__text">{label}</span>
      </label>
    </li>
  );

  /**
   * @param {string} invisibleClass
   */
  function renderInvisibleRadioInput(invisibleClass) {
    const className = `${optionClass} ${invisibleClass}`;
    return (
      <RadioInput
        value={value}
        currentSelection={currentSelection}
        className={className}
      />
    );
  }
}

/**
 * @param {Object} param0
 * @param {import('app/store').SortingProperty} param0.value
 * @param {string} param0.className
 * @param {string} param0.currentSelection
 */
function RadioInput({ value, className, currentSelection }) {
  return (
    <input
      className={`SortingOption__radio ${className}`}
      type="radio"
      name="sort"
      value={value}
      onchange={onChange}
      checked={currentSelection === value}
    />
  );

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
