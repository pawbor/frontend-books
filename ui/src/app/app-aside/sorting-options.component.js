import './sorting-options.component.css';

import Invisible from 'common/invisible/invisible.component';
import ElementWithDivider from './element-with-divider.component';

const options = ['ilości stron', 'dacie wydania', 'nazwisku autora'];

export default function SortingOptions() {
  const fragment = document.createDocumentFragment();

  const header = document.createElement('h2');
  header.className = 'SortingOptions__header';
  header.innerHTML = 'Sortuj po';
  fragment.appendChild(header);

  const list = ElementWithDivider(List);
  
  fragment.appendChild(list);
  return fragment;
}

function List() {
  const list = document.createElement('ul');
  list.className = 'SortingOptions__list';

  options.forEach((optionLabel) => {
    const option = SortingOption(optionLabel);
    list.appendChild(option);
  });

  return list;
}

function SortingOption(optionLabel) {
  const option = document.createElement('li');
  option.className = 'SortingOption';

  const label = document.createElement('label');
  label.className = 'SortingOption__label';

  const radio = Invisible(RadioInput);

  const text = document.createElement('span');
  text.className = 'SortingOption__text';
  text.innerText = optionLabel;

  label.appendChild(radio);
  label.appendChild(text);

  option.appendChild(label);
  return option;
}

function RadioInput() {
  const radio = document.createElement('input');
  radio.className = 'SortingOption__radio';
  radio.type = 'radio';
  radio.name = 'sort';
  return radio;
}
