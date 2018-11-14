/**
 * @param {Node} parent
 * @param {Node[]} nodes
 */
export default function batchAppend(parent, nodes) {
  const fragment = document.createDocumentFragment();
  nodes.forEach((n) => {
    if (n.parentNode !== parent) {
      fragment.appendChild(n);
    }
  });
  parent.appendChild(fragment);
}
