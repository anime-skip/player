<!--

This component is used as the "parent" div that all anime skip styles will be applied under.

This is done to make sure we aren't chaning the styles of the original players when we inject the
JS, just our own stuff. It's a pain to develop within a scope like this, so it's added via postcss
instead.

Alternatively, for UIs that are not injected, add this class to the `html` tag's classes like in
`src/popup/index.html`

 -->
<template>
  <div class="anime-skip-scope">
    <slot />
  </div>
</template>
