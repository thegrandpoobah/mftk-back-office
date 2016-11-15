'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('attendance service', function() {
  it('registered the attendances service', () => {
    assert.ok(app.service('attendances'));
  });
});
