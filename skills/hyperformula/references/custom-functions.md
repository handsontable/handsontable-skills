# Custom Functions

Extend HyperFormula with your own functions via `FunctionPlugin`. Authoritative doc:
- Custom functions guide: https://hyperformula.handsontable.com/docs/guide/custom-functions.html

## Minimal plugin

Register **before** creating any instance — functions registered after `buildFromArray` / `buildFromSheets` / `buildEmpty` won't be available.

```ts
import { HyperFormula, FunctionPlugin, FunctionArgumentType } from 'hyperformula';

class MyPlugin extends FunctionPlugin {
  greet(ast, state) {
    return this.runFunction(
      ast.args,
      state,
      this.metadata('GREET'),
      (name) => `Hello, ${name}!`
    );
  }
}

MyPlugin.implementedFunctions = {
  GREET: {
    method: 'greet',
    parameters: [{ argumentType: FunctionArgumentType.STRING }],
  },
};

const translations = { enGB: { GREET: 'GREET' }, enUS: { GREET: 'GREET' } };

// PITFALL: registration MUST happen before any instance is built.
HyperFormula.registerFunctionPlugin(MyPlugin, translations);

const hf = HyperFormula.buildFromArray(
  [['World', '=GREET(A1)']],
  { licenseKey: 'gpl-v3' }
);
console.log(hf.getCellValue({ sheet: 0, col: 1, row: 0 })); // "Hello, World!"
```

## Volatile functions

Mark a function as volatile so it recalculates on every change (like `RAND` or `NOW`). Volatile functions are expensive in large sheets — use sparingly.

```ts
MyPlugin.implementedFunctions = {
  RAND_ID: {
    method: 'randId',
    parameters: [],
    isVolatile: true,
  },
};
```

## Argument types

```ts
import { FunctionArgumentType } from 'hyperformula';

// FunctionArgumentType.NUMBER
// FunctionArgumentType.STRING
// FunctionArgumentType.BOOLEAN
// FunctionArgumentType.NOERROR
// FunctionArgumentType.SCALAR
// FunctionArgumentType.RANGE       // accepts a cell range
// FunctionArgumentType.ANY
```

Use `optionalArg: true`, `defaultValue`, and `minValue` / `maxValue` to validate arguments declaratively:

```ts
MyPlugin.implementedFunctions = {
  CLAMP: {
    method: 'clamp',
    parameters: [
      { argumentType: FunctionArgumentType.NUMBER },
      { argumentType: FunctionArgumentType.NUMBER, optionalArg: true, defaultValue: 0 },
      { argumentType: FunctionArgumentType.NUMBER, optionalArg: true, defaultValue: 100 },
    ],
  },
};
```

## Range arguments

Use `RANGE` argument type when the function takes a cell area. The callback receives the range as a 2D array.

```ts
class SumPositivesPlugin extends FunctionPlugin {
  sumPositives(ast, state) {
    return this.runFunction(
      ast.args,
      state,
      this.metadata('SUM_POSITIVES'),
      (range) => {
        let total = 0;
        for (const row of range.data) {
          for (const v of row) if (typeof v === 'number' && v > 0) total += v;
        }
        return total;
      }
    );
  }
}

SumPositivesPlugin.implementedFunctions = {
  SUM_POSITIVES: {
    method: 'sumPositives',
    parameters: [{ argumentType: FunctionArgumentType.RANGE }],
  },
};
```

## Returning arrays

Custom functions can return 2D arrays. **PITFALL:** result arrays don't auto-resize when upstream dependencies change — the footprint is fixed at first evaluation.

```ts
class SplitPlugin extends FunctionPlugin {
  splitToRow(ast, state) {
    return this.runFunction(
      ast.args,
      state,
      this.metadata('SPLIT_ROW'),
      (text, sep) => [text.split(sep)]  // 2D array: one row, N cols
    );
  }
}
```

## Error handling

Return a `CellError` to signal a formula error:

```ts
import { CellError, ErrorType } from 'hyperformula';

class DividePlugin extends FunctionPlugin {
  safeDivide(ast, state) {
    return this.runFunction(
      ast.args,
      state,
      this.metadata('SAFE_DIVIDE'),
      (a, b) => (b === 0 ? new CellError(ErrorType.DIV_BY_ZERO) : a / b)
    );
  }
}
```

## Aliases and localized names

Expose one method under multiple function names, or localize:

```ts
MyPlugin.aliases = {
  HELLO: 'GREET', // calling =HELLO(x) runs the greet() method
};

const translations = {
  enGB: { GREET: 'GREET' },
  plPL: { GREET: 'POWITAJ' }, // =POWITAJ("Świat") in Polish
};
HyperFormula.registerFunctionPlugin(MyPlugin, translations);
```

## Unregister / introspect

```ts
HyperFormula.unregisterFunctionPlugin(MyPlugin);
HyperFormula.unregisterFunction('GREET');
HyperFormula.getRegisteredFunctionNames('enGB');
```
