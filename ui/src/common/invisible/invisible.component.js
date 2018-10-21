import './invisible.component.css';

export default function Invisible({ props: { render } }) {
  const element = render();
  element.classList.add('Invisible');
  return element;
}
