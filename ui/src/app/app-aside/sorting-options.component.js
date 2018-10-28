import jsx from 'utils/jsx';
import { SortingProperty, sortingOptionsStore } from 'app/store';
import Invisible from 'common/invisible/invisible.component';

import './sorting-options.component.css';
import ElementWithDivider from './element-with-divider.component';

const options = [
  { optionLabel: 'ilości stron', optionValue: SortingProperty.Pages },
  { optionLabel: 'dacie wydania', optionValue: SortingProperty.ReleaseDate },
  { optionLabel: 'nazwisku autora', optionValue: SortingProperty.Author },
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
  const listElements = options.map(({ optionValue, optionLabel }) => (
    <SortingOption value={optionValue}>{optionLabel}</SortingOption>
  ));
  return <ul className="SortingOptions__list">{listElements}</ul>;
}

function SortingOption({ props: { value }, children: [label] }) {
  return (
    <li className="SortingOption">
      <label className="SortingOption__label">
        <Invisible render={renderRadioInput} />
        <span className="SortingOption__text">{label}</span>
      </label>
    </li>
  );

  function renderRadioInput() {
    return <RadioInput value={value} />;
  }
}

function RadioInput({ props: { value } }) {
  const input = (
    <input
      className="SortingOption__radio"
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

  function updateInput(sortingProperty) {
    input.checked = sortingProperty === value;
  }

  function onChange(event) {
    sortingOptionsStore.setSortingProperty(event.target.value);
  }
}
