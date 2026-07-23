export const pick = <T extends object, const K extends readonly (keyof T)[]>(
  obj: T,
  keys: K,
): Pick<T, K[number]> =>
  Object.fromEntries(keys.map((key) => [key, obj[key]])) as Pick<T, K[number]>

export const omit = <T extends object, const K extends readonly (keyof T)[]>(
  obj: T,
  keys: K,
): Omit<T, K[number]> =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K[number])),
  ) as Omit<T, K[number]>

/** Drop keys whose value is `undefined` (e.g. before forwarding to libs that choke on explicit `undefined`). */
export const omitUndefinedValues = <T extends Record<string, unknown>>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as Partial<T>

export const pickDefined = <T extends object, const K extends readonly (keyof T)[]>(
  obj: T,
  keys: K,
): Partial<Pick<T, K[number]>> => omitUndefinedValues(pick(obj, keys))
