import './invisible.component.css';

export default function Invisible(render) {
  const element = render();
  element.classList.add('Invisible');
  return element;
}
