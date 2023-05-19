/**
 * オブジェクトの配列を特定のキーでグルーピングする。
 *
 * @example
 * ```ts
 * const menus = [
 *   { id: 1, type: 'meat', name: '牛丼' },
 *   { id: 2, type: 'fish', name: '海鮮丼' },
 *   { id: 3, type: 'meat', name: '牛皿' },
 *   { id: 4, type: 'fish', name: '刺身' },
 * ];
 *
 * const grouped = groupBy(menus, 'type');
 * // output:
 * //
 * // {
 * //   meat: [
 * //     { id: 1, type: 'meat', name: '牛丼' },
 * //     { id: 3, type: 'meat', name: '牛皿' }
 * //   ],
 * //   fish: [
 * //     { id: 2, type: 'fish', name: '海鮮丼' },
 * //     { id: 4, type: 'fish', name: '刺身' }
 * //   ]
 * // }
 * ```
 */
function groupBy<T extends object, K extends keyof T & string>(
  array: T[] | ReadonlyArray<T>,
  key: K
) {
  // @ts-expect-error T[K] is string type
  const arrayGroupedByKey: { [k in T[K]]?: T[] } = {};

  const values = [...new Set(array.map((item) => item[key]))];

  values.forEach((value) => {
    const filteredArrayByValue = array.filter((item) => item[key] === value);
    arrayGroupedByKey[value] = filteredArrayByValue;
  });

  // @ts-expect-error T[K] is string type
  return arrayGroupedByKey as { [k in T[K]]: T[] };
}

export { groupBy };
