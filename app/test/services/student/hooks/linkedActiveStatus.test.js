'use strict';

const assert = require('assert');
const linkedActiveStatus = require('../../../../src/services/student/hooks/linkedActiveStatus.js');

describe('student linkedActiveStatus hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    linkedActiveStatus()(mockHook);

    assert.ok(mockHook.linkedActiveStatus);
  });
});
