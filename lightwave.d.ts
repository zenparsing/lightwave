export class Element extends HTMLElement {
  render(): any
}

export function renderElement(elem: Element): void

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

interface TemplateResult {}

export function html(
  callSite: TemplateStringsArray,
  ...values: any[]
): TemplateResult
