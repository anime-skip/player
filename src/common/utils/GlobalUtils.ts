export const as = <T>(value: T) => value;

export function clone<T>(data: T): T | { message: string; data: T } {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (err) {
    return { message: 'Error cloning', data };
  }
}
