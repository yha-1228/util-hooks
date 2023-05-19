function pickBy<T extends object, K extends keyof T>(object: T, keys: K[]) {
  const result = { ...object };

  Object.keys(object).forEach((key) => {
    if (!keys.includes(key as K)) {
      delete result[key as K];
    }
  });

  return result as Pick<T, K>;
}

export { pickBy };
