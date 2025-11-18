import './dom-setup.js'

import * as assert from 'assert';
import { describe, it } from 'moon-unit';
import { Element, html, useElement } from '../lightwave.js';

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

  it('should perform a basic rendering', () => {
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
