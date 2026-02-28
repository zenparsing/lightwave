# Lightwave

A lightweight view library built on custom elements and template strings.

## Installation

```bash
npm install lightwave
```

## Usage

Create a custom element by extending the `Element` base class. Implement the `render()` method to return a template using the `html` tag, and manage state or side effects using hooks.

```javascript
import { Element, html, useState, useEffect } from 'lightwave';

class CounterElement extends Element {
  render() {
    // Basic state management
    const [count, setCount] = useState(0);

    // Run an effect when the `count` dependency changes
    useEffect([count], () => {
      console.log(`The counter changed to ${count}`);
    });

    return html`
      <div class="counter">
        <p>Current count: ${count}</p>
        <button onclick=${() => setCount(count + 1)}>
          Increment
        </button>
      </div>
    `;
  }
}

// Register the custom element
customElements.define('my-counter', CounterElement);
```

Then use the custom element anywhere in HTML:

```html
<my-counter></my-counter>
```

## Hooks

### `useState(initialState)`

- **`initialState`**: The initial state value, or a function that returns the initial state.

Returns a two-element array containing the current state and a function to update it.

### `useEffect(deps, init)`

- **`deps`**: An array of dependencies. The effect re-runs only if these values change between renders.
- **`init`**: A function containing the side-effect logic. It can optionally return a cleanup function that runs before the effect re-runs or when the component unmounts.

### `useMemo(deps, init)`

- **`deps`**: An array of dependencies.
- **`init`**: A function that computes the value to be memoized.

Returns the computed value. It only re-computes when the `deps` change.

### `useElement()`

Returns the custom element instance currently being rendered.
