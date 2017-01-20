'use strict';

const assert = require('assert');
const singleAttendance = require('../../../../src/services/attendance/hooks/singleAttendance.js');

describe('attendance singleAttendance hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    singleAttendance()(mockHook);

    assert.ok(mockHook.singleAttendance);
  });
});
