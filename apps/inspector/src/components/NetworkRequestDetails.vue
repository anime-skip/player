<script setup lang="ts">
import { computed } from 'vue';

import { NetworkRequest } from '@/utils/network-repo';

const props = defineProps<{
  request: NetworkRequest;
}>();

const timeline = computed(() => {
  const { request, response } = props.request;
  const url = new URL(request.url);
  const lines = [
    `> ${request.method.toUpperCase()} ${url.href.replace(url.origin, '')}`,
    `> Host: ${url.host}`,
    ...Object.entries(request.headers).flatMap(([header, values]) =>
      values.map((value) => `> ${header}: ${value}`),
    ),

    '>',
  ];
  if (request.body) {
    lines.push(request.body, '');
  }
  if (response != null) {
    lines.push(
      `< ${response.status} ${response.statusText}`,
      ...Object.entries(response.headers).flatMap(([header, values]) =>
        values.map((value) => `< ${header}: ${value}`),
      ),
      '<',
    );
    if (response.body) {
      lines.push(response.body);
    }
  }
  return lines.join('\n');
});
</script>

<template>
  <pre class="w-full whitespace-pre-line break-all p-2">{{ timeline }}</pre>
</template>
