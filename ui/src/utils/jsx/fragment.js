export default function Fragment(props, children) {
  const fragment = document.createDocumentFragment();
  children.forEach((ch) => {
    fragment.appendChild(ch);
  });
  return fragment;
}
