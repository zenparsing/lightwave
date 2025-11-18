import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = dom;
const { document, customElements, HTMLElement } = window;

Object.assign(global, { window, document, customElements, HTMLElement });
