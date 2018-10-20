import './app-aside.component.css';

import SortingOptions from './sorting-options.component';
import FilteringOptions from './filtering-options.component';

export default function AppAside() {
  const aside = document.createElement('aside');
  aside.className = 'AppAside';

  const sortingOptions = SortingOptions();
  aside.appendChild(sortingOptions);

  const filteringOptions = FilteringOptions();
  aside.appendChild(filteringOptions);

  const clearBtn = ClearButton('Wyczyść');
  aside.appendChild(clearBtn);

  return aside;
}

function ClearButton(label) {
  const btn = document.createElement('button');
  btn.className = 'AppAside__clear';
  btn.type = 'button';
  btn.innerText = label;
  return btn;
}
