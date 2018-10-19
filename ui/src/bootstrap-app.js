import App from './app/app.component';

export default function bootstrapApp() {
  const body = document.querySelector('body');
  const app = App();
  body.appendChild(app);
}
