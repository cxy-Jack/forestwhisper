export function eventValue(event: Event) {
  return (event as CustomEvent<{ value: string }>).detail.value
}
