import jsx from "utils/jsx";
import './app.component.css';

import AppHeader from './app-header.component';
import AppMain from './app-main.component';
import AppAside from './app-aside/app-aside.component';

export default function App() {
  return (
    <>
      <AppHeader />
      <AppMain />
      <AppAside />
    </>
  );
}
