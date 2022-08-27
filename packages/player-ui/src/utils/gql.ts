/**
 * Identity function just to trigger the apollo dev tools for formatting and syntax highlighting.
 *
 * @returns The same string as if it were a regular string template being used.
 */
export function gql(template: TemplateStringsArray, ...params: any[]): string {
  const str = [];
  for (let i = 0; i < template.length; i++) {
    str.push(template[i]);
    if (params[i] != null) str.push(params[i]);
  }
  return str.join('');
}
