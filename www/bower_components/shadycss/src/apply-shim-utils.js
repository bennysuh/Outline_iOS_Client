/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invalidate = invalidate;
exports.invalidateTemplate = invalidateTemplate;
exports.isValid = isValid;
exports.templateIsValid = templateIsValid;
exports.isValidating = isValidating;
exports.templateIsValidating = templateIsValidating;
exports.startValidating = startValidating;
exports.startValidatingTemplate = startValidatingTemplate;
exports.elementsAreInvalid = elementsAreInvalid;

var _templateMap = require('./template-map.js');

var _templateMap2 = _interopRequireDefault(_templateMap);

var _cssParse = require('./css-parse.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line no-unused-vars

/*
 * Utilities for handling invalidating apply-shim mixins for a given template.
 *
 * The invalidation strategy involves keeping track of the "current" version of a template's mixins, and updating that count when a mixin is invalidated.
 * The template
 */

/** @const {string} */
var CURRENT_VERSION = '_applyShimCurrentVersion';

/** @const {string} */
var NEXT_VERSION = '_applyShimNextVersion';

/** @const {string} */
var VALIDATING_VERSION = '_applyShimValidatingVersion';

/**
 * @const {Promise<void>}
 */
var promise = Promise.resolve();

/**
 * @param {string} elementName
 */
function invalidate(elementName) {
  var template = _templateMap2.default[elementName];
  if (template) {
    invalidateTemplate(template);
  }
}

/**
 * This function can be called multiple times to mark a template invalid
 * and signal that the style inside must be regenerated.
 *
 * Use `startValidatingTemplate` to begin an asynchronous validation cycle.
 * During that cycle, call `templateIsValidating` to see if the template must
 * be revalidated
 * @param {HTMLTemplateElement} template
 */
function invalidateTemplate(template) {
  // default the current version to 0
  template[CURRENT_VERSION] = template[CURRENT_VERSION] || 0;
  // ensure the "validating for" flag exists
  template[VALIDATING_VERSION] = template[VALIDATING_VERSION] || 0;
  // increment the next version
  template[NEXT_VERSION] = (template[NEXT_VERSION] || 0) + 1;
}

/**
 * @param {string} elementName
 * @return {boolean}
 */
function isValid(elementName) {
  var template = _templateMap2.default[elementName];
  if (template) {
    return templateIsValid(template);
  }
  return true;
}

/**
 * @param {HTMLTemplateElement} template
 * @return {boolean}
 */
function templateIsValid(template) {
  return template[CURRENT_VERSION] === template[NEXT_VERSION];
}

/**
 * @param {string} elementName
 * @return {boolean}
 */
function isValidating(elementName) {
  var template = _templateMap2.default[elementName];
  if (template) {
    return templateIsValidating(template);
  }
  return false;
}

/**
 * Returns true if the template is currently invalid and `startValidating` has been called since the last invalidation.
 * If false, the template must be validated.
 * @param {HTMLTemplateElement} template
 * @return {boolean}
 */
function templateIsValidating(template) {
  return !templateIsValid(template) && template[VALIDATING_VERSION] === template[NEXT_VERSION];
}

/**
 * the template is marked as `validating` for one microtask so that all instances
 * found in the tree crawl of `applyStyle` will update themselves,
 * but the template will only be updated once.
 * @param {string} elementName
*/
function startValidating(elementName) {
  var template = _templateMap2.default[elementName];
  startValidatingTemplate(template);
}

/**
 * Begin an asynchronous invalidation cycle.
 * This should be called after every validation of a template
 *
 * After one microtask, the template will be marked as valid until the next call to `invalidateTemplate`
 * @param {HTMLTemplateElement} template
 */
function startValidatingTemplate(template) {
  // remember that the current "next version" is the reason for this validation cycle
  template[VALIDATING_VERSION] = template[NEXT_VERSION];
  // however, there only needs to be one async task to clear the counters
  if (!template._validating) {
    template._validating = true;
    promise.then(function () {
      // sync the current version to let future invalidations cause a refresh cycle
      template[CURRENT_VERSION] = template[NEXT_VERSION];
      template._validating = false;
    });
  }
}

/**
 * @return {boolean}
 */
function elementsAreInvalid() {
  for (var elementName in _templateMap2.default) {
    var template = _templateMap2.default[elementName];
    if (!templateIsValid(template)) {
      return true;
    }
  }
  return false;
}