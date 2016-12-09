'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('accountSearch service', function() {
  it('registered the accountSearches service', () => {
    assert.ok(app.service('accountSearches'));
  });
});
