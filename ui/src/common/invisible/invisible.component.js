import './invisible.component.css';

/**
 * @param {Object} param0
 * @param {Object} param0.props
 * @param {() => any} param0.props.render
 */
export default function Invisible({ props: { render } }) {
  const element = render();
  element.classList.add('Invisible');
  return element;
}
