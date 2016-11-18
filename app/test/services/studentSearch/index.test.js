'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('studentSearch service', function() {
  it('registered the studentSearches service', () => {
    assert.ok(app.service('studentSearches'));
  });
});
