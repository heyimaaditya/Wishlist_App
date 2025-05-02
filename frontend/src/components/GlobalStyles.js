import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --color-primary: #007bff;
    --color-secondary: #6c757d;
    --color-success: #28a745;
    --color-danger: #dc3545;
    --color-warning: #ffc107;
    --color-info: #17a2b8;
    --color-light: #f8f9fa;
    --color-dark: #343a40;

    --color-text-primary: #333;
    --color-text-secondary: #555;
    --color-text-muted: #888;

    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;

    --border-radius: 4px;
    --box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }


  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--color-light);
    color: var(--color-text-primary);
    line-height: 1.6;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  *, *::before, *::after {
      box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6 {
      color: var(--color-dark);
      margin-top: 0;
      margin-bottom: var(--spacing-sm);
  }

  p {
      margin-top: 0;
      margin-bottom: var(--spacing-sm);
  }

  button {
      cursor: pointer;
  }

  a {
      text-decoration: none;
      color: var(--color-primary);
  }

  a:hover {
      text-decoration: underline;
  }
`;

export default GlobalStyles;