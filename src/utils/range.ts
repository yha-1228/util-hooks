type RangeOptions = {
  /**
   * @default 0
   */
  from?: number;
};

/**
 * create array: `[0, 1, ..., n - 1]`
 */
export const range = (n: number, options: RangeOptions) => {
  const from = options.from || 0;

  let array = Array.from(new Array(n)).map((_, i) => i);

  if (from) {
    array = array.map((v) => v + from);
  }

  return array;
};
