import ReactDOM from 'react-dom/client';
import { worker } from './mocks/worker';
import App from './App.jsx';
import './index.css';

worker.start().then(() => {
	ReactDOM.createRoot(document.getElementById('root')).render(<App />);
});
