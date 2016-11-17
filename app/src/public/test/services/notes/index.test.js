'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('notes service', function() {
  it('registered the notes service', () => {
    assert.ok(app.service('notes'));
  });
});
