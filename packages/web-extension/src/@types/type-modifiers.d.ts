/**
 * Take the existing type, and make specific fields required, while leaving the rest as is
 */
type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
