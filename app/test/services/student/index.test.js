'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('student service', function() {
  it('registered the students service', () => {
    assert.ok(app.service('students'));
  });
});
