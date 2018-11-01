import './element-with-divider.component.css';

/**
 * @param {Object} param0
 * @param {Object} param0.props
 * @param {() => any} param0.props.render
 */
export default function ElementWithDivider({ props: { render } }) {
  const element = render();
  element.classList.add('ElementWithDivider');
  return element;
}
