'use strict';

const assert = require('assert');
const deactiveStudents = require('../../../../src/services/account/hooks/deactiveStudents.js');

describe('account deactiveStudents hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    deactiveStudents()(mockHook);

    assert.ok(mockHook.deactiveStudents);
  });
});
