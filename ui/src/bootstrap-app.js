import jsx from 'utils/jsx';
import App from './app/app.component';

export default function bootstrapApp() {
  const body = document.querySelector('body');
  body.appendChild(<App />);
}
