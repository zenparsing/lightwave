import './dom-setup.js'

import * as assert from 'assert';
import { describe, it, beforeEach } from 'moon-unit';
import { Element, html, useElement, useEffect, useState } from '../lightwave.js';

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
});
