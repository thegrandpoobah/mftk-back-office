'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('curriculumLog service', function() {
  it('registered the curriculumLogs service', () => {
    assert.ok(app.service('curriculumLogs'));
  });
});
