const selectorParser = require('postcss-selector-parser');

/**
 * Scope all the player styles to just the player
 *
 * Adapted from https://github.com/pazams/postcss-scopify
 */
function scopify({ scope, ignore }) {
  function isIgnored(selector) {
    return !!ignore.find(i => selector.startsWith(i));
  }

  const processor = selectorParser(selectors => {
    let hasNestingSelector = false;
    selectors.walkNesting(selector => {
      hasNestingSelector = true;
      selector.replaceWith(selectorParser.string({ value: scope }));
    });
    if (!hasNestingSelector) {
      selectors.first.prepend(selectorParser.string({ value: scope + ' ' }));
    }
  });

  function isValidScope(scope) {
    if (scope) return scope.indexOf(',') === -1;
    return false;
  }

  const conditionalGroupRules = ['media', 'supports', 'document'];
  function isRuleScopable(rule) {
    if (rule.parent.type !== 'root') {
      return rule.parent.type === 'atrule' && conditionalGroupRules.indexOf(rule.parent.name) > -1;
    }
    return true;
  }

  function isScopeApplied(selector) {
    return selector.startsWith(scope) || isIgnored(selector);
  }

  return root => {
    if (!isValidScope(scope)) {
      throw root.error('invalid scope', { plugin: 'scopify' });
    }
    root.walkRules(rule => {
      if (!isRuleScopable(rule)) return rule;
      rule.selectors = rule.selectors.map(selector => {
        if (isScopeApplied(selector)) return selector;
        return processor.processSync(selector);
      });
    });
  };
}

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    scopify({
      scope: '.anime-skip-scope',
      ignore: ['.hide-for-anime-skip', '.bg-background', '.anime-skip-remove-margin'],
    }),
  ],
};
