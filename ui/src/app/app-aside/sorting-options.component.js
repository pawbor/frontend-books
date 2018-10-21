import './sorting-options.component.css';

import jsx from 'utils/jsx';
import Invisible from 'common/invisible/invisible.component';
import ElementWithDivider from './element-with-divider.component';

const options = ['ilości stron', 'dacie wydania', 'nazwisku autora'];

export default function SortingOptions() {
  return (
    <>
      <h2 className="SortingOptions__header">Sortuj po</h2>
      <ElementWithDivider render={List} />
    </>
  );
}

function List() {
  const listElements = options.map((optionLabel) => (
    <SortingOption>{optionLabel}</SortingOption>
  ));
  return <ul className="SortingOptions__list">{listElements}</ul>;
}

function SortingOption({ children: [optionLabel] }) {
  return (
    <li className="SortingOption">
      <label className="SortingOption__label">
        <Invisible render={RadioInput} />
        <span className="SortingOption__text">{optionLabel}</span>
      </label>
    </li>
  );
}

function RadioInput() {
  return <input className="SortingOption__radio" type="radio" name="sort" />;
}
