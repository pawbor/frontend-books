export default function Async({ props: { render, trigger } }) {
  const fragment = document.createDocumentFragment();
  let previousContent = undefined;

  //TODO: need some kind of lifecycle hook to clean the subscription
  trigger.subscribe({
    next: (value) => {
      const content = render(value);
      if (previousContent) {
        const parent = previousContent.parentElement;
        parent.replaceChild(content, previousContent);
      } else {
        fragment.appendChild(content);
      }
      previousContent = content;
    },
  });
  return fragment;
}
