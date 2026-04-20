# Vue 3

HyperFormula + Vue 3 integration. Authoritative doc:
- Vue integration guide: https://hyperformula.handsontable.com/guide/integration-with-vue.html

## Always wrap the instance with `markRaw`

Vue 3's Composition API wraps objects in a reactive Proxy that intercepts property access and **corrupts HyperFormula's internal state**, causing silent data corruption or crashes. React, Angular, and Svelte need no special handling.

```ts
import { markRaw } from 'vue';
import { HyperFormula } from 'hyperformula';

const hf = markRaw(
  HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' })
);
```

Use the same wrapper no matter where the instance is held — `ref`, `reactive`, component state, a store (Pinia/Vuex), or a composable. If the raw HyperFormula instance ever reaches Vue's reactivity system, it must be marked.

## Composition API example

```ts
import { onBeforeUnmount, ref } from 'vue';
import { markRaw } from 'vue';
import { HyperFormula } from 'hyperformula';

export function useHyperFormula() {
  const hf = markRaw(
    HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' })
  );

  // Free internal data structures when the component unmounts.
  onBeforeUnmount(() => hf.destroy());

  const result = ref<unknown>(null);

  function evaluate(formula: string) {
    hf.setCellContents({ sheet: 0, col: 0, row: 0 }, formula);
    result.value = hf.getCellValue({ sheet: 0, col: 0, row: 0 });
  }

  return { evaluate, result };
}
```

## Pinia / Vuex store

```ts
import { defineStore } from 'pinia';
import { markRaw } from 'vue';
import { HyperFormula } from 'hyperformula';

export const useCalcStore = defineStore('calc', {
  state: () => ({
    hf: markRaw(
      HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' })
    ),
  }),
});
```

## Cleanup

HyperFormula's internal graph is **not** garbage-collected until `destroy()` is called. In SPAs this accumulates memory over time.

```ts
import { onBeforeUnmount } from 'vue';

onBeforeUnmount(() => hf.destroy());
// After destroy() the instance is unusable — create a new one if needed.
```
