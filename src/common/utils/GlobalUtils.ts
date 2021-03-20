export const as = <T>(value: T) => value;

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function clone<T>(data: T): T | { message: string; data: T } {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (err) {
    return { message: 'Error cloning', data };
  }
}
