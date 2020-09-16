export const as = <T>(value: T) => value;

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function clone(data: any): any {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (err) {
    return { message: 'Error cloning', data };
  }
}
