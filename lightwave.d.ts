interface TemplateResult {}

export type TemplateValue =
  string |
  number |
  boolean |
  null |
  undefined |
  TemplateResult |
  Iterable<TemplateValue>;

export class Element extends HTMLElement {
  render(): TemplateValue
}

export function renderElement(elem: Element): void

export function defineElement(
  name: string,
  render: () => TemplateValue
): typeof Element

export interface Facet {
  kind: string
  dispose(): void
}

export function useElement(): Element

export function useFacet<T extends Facet>(
  init: (current: Facet, element: Element) => T
): T

export function useState<T>(
  initialState: T | (() => T)
): [T, (value: T) => void]

export function useEffect(
  deps: any[],
  init: () => (() => void) | void
): void

export function useMemo<T>(
  deps: any[],
  init: () => T
): T

export function html(
  callSite: TemplateStringsArray,
  ...values: any[]
): TemplateResult
