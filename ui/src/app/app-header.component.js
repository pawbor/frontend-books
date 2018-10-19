import "./app-header.component.css";

export default function AppHeader() {
  const header = document.createElement('h1');
  header.className = 'AppHeader';
  header.innerHTML = 'JS’owe książki';
  return header;
}
