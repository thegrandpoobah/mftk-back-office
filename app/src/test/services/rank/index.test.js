'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('rank service', function() {
  it('registered the ranks service', () => {
    assert.ok(app.service('ranks'));
  });
});
