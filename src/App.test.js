import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Codi tutor welcome message', () => {
  render(<App />);
  // Look for part of the initial bot message
  const welcomeElement = screen.getByText(/Hey there, future coder!/i);
  expect(welcomeElement).toBeInTheDocument();
});