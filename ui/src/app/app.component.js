import './app.component.css';

import AppHeader from './app-header.component';
import AppMain from './app-main.component';
import AppAside from './app-aside.component';

export default function App() {
  const fragment = document.createDocumentFragment();
  
  const header = AppHeader()
  fragment.appendChild(header);

  const main = AppMain()
  fragment.appendChild(main);

  const aside = AppAside()
  fragment.appendChild(aside);

  return fragment;
}
