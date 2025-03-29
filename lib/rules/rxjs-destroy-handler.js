/**
 * @fileoverview Enforces that RxJS subscriptions in Angular classes are properly
 * handled via either ngOnDestroy or takeUntil / takeUntilDestroyed.
 */

"use strict";

/**
 * Determine if a class is likely an Angular class by checking for @Component, @Directive, Pipe.
 * @param {import('estree').Node} node
 * @returns {boolean}
 */
function isAngularClass(node) {
  if (!node.decorators) return false;

  return node.decorators.some((decorator) => {
    const expr = decorator.expression;
    return (
      expr &&
      expr.callee &&
      ["Component", "Directive", "Injectable", "Pipe"].includes(
        expr.callee.name
      )
    );
  });
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Requires RxJS subscriptions to be managed with takeUntil/takeUntilDestroyed or ngOnDestroy unsubscribe",
      category: "Best Practices",
      recommended: false,
    },
    schema: [],
    messages: {
      missingTeardown:
        "RxJS subscription found without takeUntil/takeUntilDestroyed or ngOnDestroy unsubscribe handling.",
    },
  },

  create(context) {
    let currentAngularClass = null;
    let hasNgOnDestroy = false;
    let subscriptionNodes = [];
    let sawTakeUntilOrDestroyed = false;

    function checkSubscriptionCall(node) {
      const source = context.getSourceCode().getText(node);

      const hasTakeUntil =
        source.includes(".pipe") &&
        (source.includes("takeUntil(") ||
          source.includes("takeUntilDestroyed("));

      if (hasTakeUntil) {
        sawTakeUntilOrDestroyed = true;
      } else {
        subscriptionNodes.push(node);
      }
    }

    return {
      ClassDeclaration(node) {
        if (isAngularClass(node)) {
          currentAngularClass = node;
          hasNgOnDestroy = false;
          subscriptionNodes = [];
          sawTakeUntilOrDestroyed = false;
        }
      },

      "ClassDeclaration:exit"(node) {
        if (currentAngularClass === node) {
          if (
            !sawTakeUntilOrDestroyed &&
            !hasNgOnDestroy &&
            subscriptionNodes.length > 0
          ) {
            subscriptionNodes.forEach((subscribeCall) => {
              context.report({
                node: subscribeCall,
                messageId: "missingTeardown",
              });
            });
          }

          currentAngularClass = null;
          hasNgOnDestroy = false;
          subscriptionNodes = [];
          sawTakeUntilOrDestroyed = false;
        }
      },

      // Detect if the class declares an ngOnDestroy method
      MethodDefinition(node) {
        if (
          currentAngularClass &&
          node.key &&
          node.key.name === "ngOnDestroy"
        ) {
          hasNgOnDestroy = true;
        }
      },

      "CallExpression[callee.property.name='subscribe']"(node) {
        if (currentAngularClass) {
          checkSubscriptionCall(node);
        }
      },
    };
  },
};
