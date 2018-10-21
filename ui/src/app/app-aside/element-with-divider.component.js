import './element-with-divider.component.css';

export default function ElementWithDivider({ props: { render } }) {
  const element = render();
  element.classList.add('ElementWithDivider');
  return element;
}
