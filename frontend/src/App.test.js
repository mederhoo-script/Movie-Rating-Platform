import { render } from '@testing-library/react';
import App from './App';

test('renders App component without crashing', () => {
  // Simple smoke test to ensure the app can render
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});

