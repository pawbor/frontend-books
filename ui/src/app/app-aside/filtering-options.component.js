import './filtering-options.component.css';

import ElementWithDivider from './element-with-divider.component';

export default function FilteringOptions() {
  const fragment = document.createDocumentFragment();

  const header = document.createElement('h2');
  header.className = 'FilteringOptions__header';
  header.innerHTML = 'Pokaż tylko';
  fragment.appendChild(header);

  const list = ElementWithDivider(List);

  fragment.appendChild(list);
  return fragment;
}

function List() {
  const list = document.createElement('ul');
  list.className = 'FilteringOptions__list';

  const filter = PagesFilter();
  list.appendChild(filter);

  return list;
}

function PagesFilter() {
  const filter = document.createElement('li');
  filter.className = 'PagesFilter';

  const label = document.createElement('label');
  label.className = 'PagesFilter__label';

  const text1 = document.createTextNode('Powyżej');
  label.appendChild(text1);

  const input = NumberInput();
  label.appendChild(input);

  const text2 = document.createTextNode('stron');
  label.appendChild(text2);

  filter.appendChild(label);
  return filter;
}

function NumberInput() {
  const input = document.createElement('input');
  input.className = 'PagesFilter__input';
  input.type = 'number';
  return input;
}
