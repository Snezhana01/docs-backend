import type { FindOptionsWhere } from 'typeorm';

export type Constructor<T, Arguments extends unknown[] = undefined[]> = new (
  ...arguments_: Arguments
) => T;

export type WrapperType<T> = T;
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;
export type FindDataWhere<T> = FindOptionsWhere<T> | Array<FindOptionsWhere<T>>;

export function getKeyInObjectByValue<K extends PropertyKey, T>(
  object: Record<K, T>,
  value: T,
): K {
  const objectKeys = Object.keys(object) as Array<keyof typeof object>;

  const propertyKey = objectKeys.find((key) => object[key] === value);

  if (!propertyKey) {
    const objectValues = objectKeys.map((key) => object[key]);

    throw new Error(`
      Value ${value} is not contained in the object.\n
      Available values: ${objectValues}.
    `);
  }

  return propertyKey;
}
