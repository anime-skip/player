type DirectiveOptions = import('vue').DirectiveOptions;

declare module 'vue-ripple-directive' {
  interface Ripple extends DirectiveOptions {
    color: string;
    zIndex: number;
  }
  const Ripple: Ripple;
  export default Ripple;
}
