import jsx from 'utils/jsx';
import { Maybe } from 'utils/fp';

import App from './app.component';

describe('first render', () => {
  /**
   * @type {AppPageObjectInstance}
   */
  let appPageObject;

  beforeEach(() => {
    const { body: root } = document;
    const app = <App />;
    jsx.renderDom(app, root);
    appPageObject = AppPageObject(root);
  });

  test('contains list of 6 books', () => {
    const elements = appPageObject.queryAllBooks();
    expect(elements.getValue([])).toHaveLength(6);
  });

  test('contains pages filter input', () => {
    const element = appPageObject.queryPagesFilterInput();
    expect(element.getValue(null)).toBeTruthy();
  });

  test('contains 3 sorting radio buttons', () => {
    const elements = appPageObject.querySortingRadioButtons();
    expect(elements.getValue([])).toHaveLength(3);
  });
});

function AppPageObject(/** @type {Element} */ root) {
  return {
    queryListOfBooks() {
      return new Maybe(root.querySelector('.ListOfBooks'));
    },

    queryAllBooks() {
      return this.queryListOfBooks()
        .map((el) => el.querySelectorAll('.Book'))
        .map((nodeList) => Array.from(nodeList));
    },

    queryFilteringOptions() {
      return new Maybe(root.querySelector('.FilteringOptions__list'));
    },

    queryPagesFilterInput() {
      return this.queryFilteringOptions().map((el) =>
        el.querySelector('.PagesFilter__input')
      );
    },

    querySortingOptions() {
      return new Maybe(root.querySelector('.SortingOptions__list'));
    },

    querySortingRadioButtons() {
      return this.querySortingOptions()
        .map((el) => el.querySelectorAll('.SortingOption__radio'))
        .map((nodeList) => Array.from(nodeList));
    },
  };
}

/**
 * @typedef {ReturnType<typeof AppPageObject>} AppPageObjectInstance
 */
