import './dom-setup.js'

import * as assert from 'assert';
import { describe, it, beforeEach } from 'moon-unit';

import {
  Element,
  html,
  useElement,
  useEffect,
  useState,
  useMemo } from '../lightwave.js';

function assertHTMLEquals(actual, expected) {
  assert.deepStrictEqual(actual.split('\n').map((line) => line.trim()), expected);
}

describe('Element', () => {
  customElements.define('test-element', class extends Element {
    render() {
      return html`
        <h1>Hello World</h1>
        <p>This is a lightwave element.</p>
      `;
    }
  });

  it('should perform basic rendering', () => {
    document.body.innerHTML = '<test-element></test-element>';
    assertHTMLEquals(document.body.innerHTML, [
      '<test-element>',
      '<h1>Hello World</h1>',
      '<p>This is a lightwave element.</p>',
      '</test-element>'
    ]);
  });
});

describe('useElement', () => {
  let elem = null;

  beforeEach(() => { elem = null; });

  customElements.define('use-element', class extends Element {
    render() {
      elem = useElement();
      return null;
    }
  });

  it('should return the currently rendering element', () => {
    document.body.innerHTML = '<use-element></use-element>';
    assert.strictEqual(elem, document.body.querySelector('use-element'));
  });
});

describe('useEffect', () => {
  let effectRan = false;
  let depValue = 0;

  beforeEach(() => {
    effectRan = false;
    depValue = 0;
  });

  customElements.define('use-effect-element', class extends Element {
    render() {
      useEffect([depValue], () => {
        effectRan = true;
      });
    }
  });

  it('should run after rendering', async () => {
    document.body.innerHTML = '<use-effect-element></use-effect-element>';
    assert.strictEqual(effectRan, false);
    await Promise.resolve();
    assert.strictEqual(effectRan, true);
    effectRan = false;
  });

  it('should not run again if deps are equal', async () => {
    let elem = document.querySelector('use-effect-element');
    elem.attributeChangedCallback();
    await Promise.resolve();
    assert.strictEqual(effectRan, false);
  });

  it('should run again if deps are not equal', async () => {
    let elem = document.querySelector('use-effect-element');
    depValue = 1;
    elem.attributeChangedCallback();
    await Promise.resolve();
    assert.strictEqual(effectRan, true);
  });

  it('should run cleanup function when re-rendered with new deps', async () => {
    let cleanupRan = false;
    let localDepValue = 0;

    customElements.define('use-effect-cleanup-element', class extends Element {
      render() {
        useEffect([localDepValue], () => {
          return () => {
            cleanupRan = true;
          };
        });
      }
    });

    document.body.innerHTML =
      '<use-effect-cleanup-element></use-effect-cleanup-element>';
    let elem = document.querySelector('use-effect-cleanup-element');
    await Promise.resolve();
    assert.strictEqual(cleanupRan, false);

    localDepValue = 1;
    elem.attributeChangedCallback(); // force re-render
    await Promise.resolve();

    assert.strictEqual(cleanupRan, true);
  });
});

describe('useState', () => {
  let nextValue = 0;

  customElements.define('use-state-element', class extends Element {
    render() {
      let [value, setValue] = useState(1);
      return html`
        <span>${value}</span>
        <button onclick=${() => setValue(nextValue)}>set</button>
      `;
    }
  });

  it('should use the initial state', () => {
    document.body.innerHTML = '<use-state-element></use-state-element>';
    let elem = document.querySelector('use-state-element');
    assert.strictEqual(elem.querySelector('span').innerHTML, '1');
  });

  it('should not re-render when state is set to same value', async () => {
    let elem = document.querySelector('use-state-element');
    nextValue = 1;
    elem.querySelector('button').click();
    await Promise.resolve();
    assert.strictEqual(elem.querySelector('span').innerHTML, '1');
  });

  it('should re-render when state is set to a different value', async () => {
    let elem = document.querySelector('use-state-element');
    nextValue = 2;
    elem.querySelector('button').click();
    await Promise.resolve();
    assert.strictEqual(elem.querySelector('span').innerHTML, '2');
  });

  it('should support functional initialization', () => {
    let initCalls = 0;

    customElements.define('use-state-func-element', class extends Element {
      render() {
        let [value] = useState(() => {
          initCalls++;
          return 'lazy';
        });
        return html`<span>${value}</span>`;
      }
    });

    document.body.innerHTML =
      '<use-state-func-element></use-state-func-element>';
    let elem = document.querySelector('use-state-func-element');
    assert.strictEqual(elem.querySelector('span').innerHTML, 'lazy');
    assert.strictEqual(initCalls, 1);

    elem.attributeChangedCallback(); // force re-render
    assert.strictEqual(initCalls, 1);
  });
});

describe('useMemo', () => {
  let computeCalls = 0;
  let depValue = 0;

  beforeEach(() => {
    computeCalls = 0;
    depValue = 0;
  });

  customElements.define('use-memo-element', class extends Element {
    render() {
      let value = useMemo([depValue], () => {
        computeCalls++;
        return `computed-${depValue}`;
      });
      return html`<span>${value}</span>`;
    }
  });

  it('should compute the initial value', () => {
    document.body.innerHTML = '<use-memo-element></use-memo-element>';
    let elem = document.querySelector('use-memo-element');
    assert.strictEqual(elem.querySelector('span').innerHTML, 'computed-0');
    assert.strictEqual(computeCalls, 1);
  });

  it('should not recompute if deps are equal', () => {
    document.body.innerHTML = '<use-memo-element></use-memo-element>';
    let elem = document.querySelector('use-memo-element');
    elem.attributeChangedCallback();
    assert.strictEqual(elem.querySelector('span').innerHTML, 'computed-0');
    assert.strictEqual(computeCalls, 1);
  });

  it('should recompute if deps change', () => {
    document.body.innerHTML = '<use-memo-element></use-memo-element>';
    let elem = document.querySelector('use-memo-element');
    depValue = 1;
    elem.attributeChangedCallback();
    assert.strictEqual(elem.querySelector('span').innerHTML, 'computed-1');
    assert.strictEqual(computeCalls, 2);
  });
});
