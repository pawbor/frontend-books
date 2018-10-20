import './element-with-divider.component.css';

export default function ElementWithDivider(render) {
  const element = render();
  element.classList.add('ElementWithDivider');
  return element;
}
