# ESLint Plugin

[![npm version](https://badge.fury.io/js/eslint-plugin-rxjs-destroy.svg)](https://badge.fury.io/js/eslint-plugin-rxjs-destroy)

`eslint-plugin-rxjs-destroy` is an ESLint plugin designed to help developers ensure that RxJS subscriptions are properly destroyed, preventing memory leaks in Angular and other RxJS-based applications.

## Features

- Enforces cleanup of RxJS subscriptions.
- Helps maintain best practices for managing subscriptions in Angular components and services.
- Prevents common memory leak issues caused by unhandled subscriptions.

## Installation

To install the plugin, run:

```bash
npm install --save-dev eslint-plugin-rxjs-destroy
```

## Peer Dependencies

This plugin requires ESLint as a peer dependency. Ensure you have a compatible version of ESLint installed:

```bash
npm install --save-dev eslint
```

Supported ESLint versions: `^7.0.0 || ^8.0.0 || ^9.0.0`.

## Usage

Add `eslint-plugin-rxjs-destroy` to your ESLint configuration file:

### `.eslintrc.json`

```json
{
  "plugins": ["rxjs-destroy"],
  "rules": {
    "rxjs-destroy/ensure-destroy": "error"
  }
}
```

### Example Rule

The `ensure-destroy` rule ensures that any RxJS subscription is properly cleaned up, typically by calling `unsubscribe()` or using Angular's `OnDestroy` lifecycle hook.

#### Valid Example

```typescript
import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-example",
  template: "<p>Example</p>",
})
export class ExampleComponent implements OnDestroy {
  private subscription: Subscription;

  constructor() {
    this.subscription = someObservable.subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
```

#### Invalid Example

```typescript
import { Component } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-example",
  template: "<p>Example</p>",
})
export class ExampleComponent {
  private subscription: Subscription;

  constructor() {
    this.subscription = someObservable.subscribe();
  }
}
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/jabennett1515/eslint-rxjs-destroy).

## License

This project is licensed under the [MIT License](LICENSE).
