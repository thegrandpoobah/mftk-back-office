'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('division service', function() {
  it('registered the divisions service', () => {
    assert.ok(app.service('divisions'));
  });
});
