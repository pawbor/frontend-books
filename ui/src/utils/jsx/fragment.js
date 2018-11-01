/**
 * @param {Object} param0
 * @param {HTMLElement[]} param0.children
 */
export default function Fragment({ children }) {
  const fragment = document.createDocumentFragment();
  children.forEach((ch) => {
    fragment.appendChild(ch);
  });
  return fragment;
}
