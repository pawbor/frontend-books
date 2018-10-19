import "./app-aside.component.css";

export default function AppAside() {
  const aside = document.createElement('aside');
  aside.className = 'AppAside';
  aside.innerHTML = 'AppAside'
  return aside;
}
