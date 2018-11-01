import jsx from 'utils/jsx';
import App from './app/app.component';

export default function bootstrapApp() {
  const { body } = document;
  jsx.renderDom(<App />, body);
}
