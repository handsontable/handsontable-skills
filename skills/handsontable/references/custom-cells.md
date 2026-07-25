# Custom Cells (Renderers, Editors, Validators)

> Last verified: July 2026 · against Handsontable 18.0 docs (handsontable/handsontable@develop docs source)

A **renderer** controls how a cell looks in the DOM, an **editor** controls how values are
entered, and a **validator** checks a value when editing finishes. Reach for a renderer for
display-only changes, an editor for custom input UI, a validator for data rules — and bundle all
three into a **custom cell type** when you want a reusable `type: 'my-type'` alias.

---

## Custom renderers

### Function renderer signature

A renderer receives the cell's `<td>` and mutates it directly. Same signature in every framework:

```js
renderer(hotInstance, td, row, col, prop, value, cellProperties)
```

Declare it inline under the `renderer` key of a `columns` entry, or (React) pass a rendering
function as the `hotRenderer` prop of `HotTable` or `HotColumn`. Clear the TD
(`Handsontable.dom.empty(td)`), build DOM from `value`, append, and `return td` — see the
conditional-formatting example below for a complete function renderer.

### React component renderer (`renderer` prop)

Pass a React component to the `renderer` prop of `HotTable` or `HotColumn`. The component receives
`row`, `col`, `prop`, `value`, `TD`, and `cellProperties` as props.

**Required:** component-based renderers are created after table initialization, so they cannot be
used with `autoRowSize` / `autoColumnSize`. Turn both off (`autoColumnSize` is on by default).

```tsx
import { HotTable, HotColumn } from '@handsontable/react-wrapper';

const RendererComponent = (props: RendererProps) => {
  return (
    <>
      Row: {props.row}, column: {props.col}, value: {props.value}
    </>
  );
};

<HotTable
  data={hotData}
  autoRowSize={false}
  autoColumnSize={false}
  licenseKey="non-commercial-and-evaluation"
>
  <HotColumn width={250} renderer={RendererComponent} />
</HotTable>
```

### Named renderers with `registerRenderer`

Register a renderer under a string alias, then reference it by name (works in all frameworks):

```js
import { registerRenderer } from 'handsontable/renderers';

function customRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
  // ...your custom logic of the renderer
}

// Register an alias
registerRenderer("my.custom", customRenderer);
```

Then reference it: `columns={[{ renderer: "my.custom" }]}`.

Registering under an existing alias (e.g. `"text"`) silently overwrites the built-in — prefix
aliases (`"my.asterisk"`) to avoid collisions. Built-in renderer aliases: `autocomplete`,
`checkbox`, `date`, `dropdown`, `html`, `numeric`, `password`, `text`, `time`.

### `valueFormatter` (v17+)

For value-only transformations (units, prefixes, date/number formatting), use `valueFormatter`
instead of a renderer — it runs before the renderer and is faster:

```js
valueFormatter(value, cellProperties) => formattedValue
```

```jsx
columns={[{
  data: 'price',
  valueFormatter(value) {
    return value ? `$${value.toFixed(2)}` : '';
  }
}]}
```

You can combine both: `valueFormatter` transforms the value first, then `renderer` receives the
formatted value for DOM work. `valueFormatter` is also the way to attach symbols outside the `Intl`
standard (e.g. ₿, ‰) that `numericFormat` cannot produce.

### Conditional formatting: call the base renderer, then style

When extending a built-in renderer, Handsontable does **not** call the base renderer for you — call
`textRenderer` (plain text) or `htmlRenderer` (trusted HTML) yourself, then mutate the TD (React
example; vanilla is identical apart from JSX):

```tsx
import { BaseRenderer, registerRenderer } from 'handsontable/renderers';
import { textRenderer } from 'handsontable/renderers/textRenderer';

// display losses in an accounting format, so color is not the only signal
const profitRenderer: BaseRenderer = (instance, td, row, col, prop, value, cellProperties) => {
  const amount = Number(value);
  td.classList.remove('loss-cell');

  if (!Number.isFinite(amount)) {
    textRenderer(instance, td, row, col, prop, value, cellProperties);
    return;
  }

  const formatted = amount < 0
    ? `($${Math.abs(amount).toFixed(1)}M)`
    : `$${amount.toFixed(1)}M`;

  textRenderer(instance, td, row, col, prop, formatted, cellProperties);

  if (amount < 0) {
    td.classList.add('loss-cell');
  }
};

registerRenderer('profitRenderer', profitRenderer);
```

Docs: https://handsontable.com/docs/react-data-grid/cell-renderer/ ·
https://handsontable.com/docs/react-data-grid/conditional-formatting/

---

## Custom editors

### React: `useHotEditor` hook

The hook returns `value`, `setValue`, and `finishEditing`, plus lifecycle callbacks (`onOpen`,
`onClose`, `onPrepare`, `onFocus`). Pass the component to the `editor` prop of `HotTable` or
`HotColumn`. Call `event.stopPropagation()` on the editor root's `mousedown` so
`outsideClickDeselects` doesn't close it; you manage positioning yourself via `onPrepare`'s TD:

```tsx
import { useRef } from 'react';
import { HotTable, HotColumn, useHotEditor } from '@handsontable/react-wrapper';

const EditorComponent = () => {
  const mainElementRef = useRef<HTMLDivElement>(null);

  const { value, setValue, finishEditing } = useHotEditor({
    onOpen: () => {
      mainElementRef.current.style.display = 'block';
    },
    onClose: () => {
      mainElementRef.current.style.display = 'none';
    },
    onPrepare: (_row, _column, _prop, TD, _originalValue, _cellProperties) => {
      const tdPosition = TD.getBoundingClientRect();
      mainElementRef.current.style.left = `${tdPosition.left + window.pageXOffset}px`;
      mainElementRef.current.style.top = `${tdPosition.top + window.pageYOffset}px`;
    },
    onFocus: () => {},
  });
  // render an absolutely-positioned div with onMouseDown={(e) => e.stopPropagation()}
};
// usage: <HotColumn width={250} editor={EditorComponent} />
```

### React: `EditorComponent` render-prop pattern (v17+)

Higher-level than `useHotEditor` — handles container creation, positioning, lifecycle, and
shortcuts automatically. Uses a render prop that receives
`{ value, setValue, finishEditing, isOpen, row, col, mainElementRef }`:

```tsx
import { EditorComponent, HotTable, HotColumn } from '@handsontable/react-wrapper';

const MyCustomEditor = () => {
  return (
    <EditorComponent>
      {({ value, setValue, finishEditing }) => (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') finishEditing();
          }}
        />
      )}
    </EditorComponent>
  );
};

// usage: <HotColumn editor={MyCustomEditor} />
```

`EditorComponent` also accepts `onPrepare(row, column, prop, TD, originalValue, cellProperties)`,
`onOpen`, `onClose`, `onFocus`, `shortcutsGroup`, and `shortcuts` props. Shortcut entries have the
shape `{ keys: [['Enter']], callback: ({ value, setValue, finishEditing }, event) => false }` —
return `false` to prevent the default key behavior. TypeScript: `<EditorComponent<number>>` types
the value.

### Class editor extending `TextEditor`

Works in React and vanilla alike. Extend a built-in editor and pass the class to the `editor`
option. **The `data-hot-input` attribute is required** on the input element — without it,
Handsontable treats clicks on the editor as outside clicks and closes it immediately:

```tsx
import { HotTable } from '@handsontable/react-wrapper';
import { TextEditor } from 'handsontable/editors/textEditor';

class CustomEditor extends TextEditor {
  createElements() {
    super.createElements();
    this.TEXTAREA = document.createElement('input');
    this.TEXTAREA.setAttribute('placeholder', 'Custom placeholder');
    this.TEXTAREA.setAttribute('data-hot-input', 'true');
    this.textareaStyle = this.TEXTAREA.style;
    this.TEXTAREA_PARENT.innerText = '';
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
  }
}

// usage: columns={[{ editor: CustomEditor }]}
```

For a fully custom UI, extend `BaseEditor` and implement the abstract methods: `init()` (build DOM,
runs once — editors are singletons per table), `getValue()`, `setValue(newValue)`, `open()`,
`close()`, `focus()`. Register class editors by alias with
`Handsontable.editors.registerEditor('myEditor', MyEditor)` and use `{ editor: 'myEditor' }` —
component-based editors (`useHotEditor`) cannot be registered this way; pass them directly to the
`editor` prop.

Docs: https://handsontable.com/docs/react-data-grid/cell-editor/

---

## Custom validators

A validator receives `(value, callback)` and must call `callback(true|false)` — returning a boolean
does nothing. Async validation works the same way: call the callback whenever the check completes.
A `RegExp` is also accepted directly as a validator:

```tsx
const ipValidatorRegexp =
  /^(?:\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|null)$/;

const emailValidator = (value: string, callback: (value: boolean) => void) => {
  setTimeout(() => {
    if (/.+@.+/.test(value)) {
      callback(true);
    } else {
      callback(false);
    }
  }, 1000);
};

// usage: columns={[
//   { data: 'ip', validator: ipValidatorRegexp, allowInvalid: true },
//   { data: 'email', validator: emailValidator }]}
```

Inside a plain-function validator, `this` is the cell meta — e.g. check `this.allowEmpty` and call
`callback(true)` for empty values before applying your pattern.

Register by alias (prefix to avoid overwriting the built-ins `autocomplete`, `date`, `dropdown`,
`numeric`, `time`):

```js
Handsontable.validators.registerValidator('my.credit-card', creditCardValidator);
// usage: columns: [{ validator: 'my.credit-card' }]
```

**`allowInvalid` interplay** — two independent outcomes when a validator returns `false`:
with `allowInvalid: true` (the default) the invalid value is committed to the data source and the
editor closes; with `allowInvalid: false` the editor stays open until the value passes. Either
way, failing cells get the `htInvalid` CSS class (customizable via `invalidCellClassName`, per
column or table-wide).

Docs: https://handsontable.com/docs/react-data-grid/cell-validator/

---

## Full custom cell types (v17+ factory API)

`rendererFactory` + `editorFactory` + `registerCellType` bundle a renderer, editor, and optional
validator under a reusable `type` alias (vanilla; usable from React too):

```ts
import { rendererFactory } from 'handsontable/renderers';
import { editorFactory } from 'handsontable/editors';
import { registerCellType } from 'handsontable/cellTypes';

const cellDefinition = {
  renderer: rendererFactory(({ td, value }) => {
    td.innerText = value;
  }),
  validator: (value, callback) => {
    callback(!isNaN(parseInt(value)));
  },
  editor: editorFactory<{input: HTMLInputElement}>({
    init(editor) {
      editor.input = document.createElement('INPUT') as HTMLInputElement;
      // Container is created automatically and `input` is attached automatically
    },
    getValue(editor) {
      return editor.input.value;
    },
    setValue(editor, value) {
      editor.input.value = value;
    }
  })
};

registerCellType('myCellType', cellDefinition);
// then use `type: 'myCellType'` in a column config
```

`rendererFactory` callback params: `instance`, `td`, `row`, `column`, `prop`, `value`,
`cellProperties` — destructure only what you need. `editorFactory` options: `init`, `afterInit`,
`beforeOpen(editor, { row, col, prop, td, originalValue, cellProperties })` (replaces `prepare()`
— read per-cell config here), `afterOpen`, `afterClose`, `getValue`, `setValue`, `onFocus`,
`render`, `shortcuts`, `shortcutsGroup`, `position: 'container' | 'portal'`, and direct `value` /
`config` properties. Positioning is automatic. For dropdowns/popovers rendered outside the
container, assign the element to `editor.preventCloseElement` in `init`/`afterInit` so clicks on
it don't close the editor.

Editor `shortcuts` config (callback returns `false` to block Handsontable's default key action):

```ts
shortcuts: [
  {
    keys: [['Tab']],
    callback: (editor, _event) => {
      let index = editor.config.indexOf(editor.value);
      index = index === editor.config.length - 1 ? 0 : index + 1;
      editor.setValue(editor.config[index]);
      return false; // Prevents default action
    }
  }
]
```

### Worked recipe: radio-button cell type (vanilla, condensed)

A renderer-driven cell type — all interaction lives in the renderer; the editor is a stub that
keeps Handsontable's editing pipeline happy. Per-column options come from `cellProperties`:

```ts
import { rendererFactory } from 'handsontable/renderers';
import { BaseEditor } from 'handsontable/editors/baseEditor';
import { registerCellType } from 'handsontable/cellTypes';

// Minimal editor stub — all interaction is handled by the renderer.
class RadioEditor extends BaseEditor {
  init() { }
  open() { }
  close() { }
  focus() { }
  getValue() { return this.originalValue; }
  setValue(value) { this.originalValue = value; }
}

const radioRenderer = rendererFactory(({ instance, td, row, column, value, cellProperties }) => {
  while (td.firstChild) td.removeChild(td.firstChild);
  const options = cellProperties.options || [];
  const wrapper = document.createElement('div');
  wrapper.setAttribute('role', 'radiogroup');
  options.forEach((opt) => {
    const optValue = typeof opt === 'object' ? opt.value : opt;
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `radio-r${row}-c${column}`;
    input.value = optValue;
    input.checked = String(optValue) === String(value);
    input.addEventListener('change', (e) => {
      e.stopPropagation();
      instance.setDataAtCell(row, column, e.target.value);
    });
    wrapper.appendChild(input);
  });
  td.appendChild(wrapper);
});

registerCellType('radio', { editor: RadioEditor, renderer: radioRenderer });

// columns: [{ data: 'priority', type: 'radio', options: priorityOptions, width: 160 }]
```

React equivalent recipe (color picker): a `rendererFactory` swatch renderer + an `EditorComponent`
editor + a `(value, callback)` validator wired straight onto one `HotColumn` — no `registerCellType`
needed: `<HotColumn data="color" editor={ColorPickerEditor} hotRenderer={colorCellRenderer}
validator={colorValidator} />`.

Docs: https://handsontable.com/docs/react-data-grid/custom-cells/ ·
https://handsontable.com/docs/react-data-grid/recipes/cell-types/colorful-picker/ ·
https://handsontable.com/docs/javascript-data-grid/recipes/cell-types/radio/

---

## Pitfalls

- **Component renderers require `autoRowSize={false}` and `autoColumnSize={false}`** — those
  options measure cells before render, but component renderers mount after table init.
  `autoColumnSize` is enabled by default, so this bites silently.
- **Validators signal via `callback(true|false)`, never a return value or Promise** — an async
  validator just calls the callback later. Changes are applied only after *all* validators
  (sync and async) from every changed cell have run.
- **`allowInvalid: true` (the default) still writes invalid values to the data source** — the
  `htInvalid` class marks the cell, but the bad value is committed. Set `allowInvalid: false` to
  keep the editor open until input is valid.
- **Custom class editors need `data-hot-input="true"` on their input element** — without it,
  clicks inside the editor count as outside clicks and close it immediately. In factory editors
  the equivalent for external popovers is `editor.preventCloseElement`.
- **Never attach event listeners directly to the TD in a renderer** — renderers run many times per
  cell and TD nodes are recycled during scrolling, so you get duplicate or misplaced listeners.
  Prefer Handsontable events; otherwise wrap content in a `<div>` and listen on the wrapper.
- **Register before use, and prefix aliases** — `registerRenderer` / `registerEditor` /
  `registerValidator` / `registerCellType` must run before the table initializes, and registering
  under an existing alias (e.g. `"text"`, `"date"`) silently overwrites the built-in.
- **Keep renderers fast** — they run for every visible cell on every table render; prefer
  `valueFormatter` (v17+) when you only need to transform the displayed value.
