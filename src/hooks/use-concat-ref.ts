export function useConcatRef<T extends HTMLElement>(
  myRef: React.MutableRefObject<T | undefined>,
  outerRef: React.ForwardedRef<T | null>
) {
  const handlar = (el: T | null): void => {
    if (typeof outerRef === 'function' || !outerRef) return;
    outerRef.current = el;

    if (el) {
      myRef.current = el;
    }
  };

  return handlar;
}
