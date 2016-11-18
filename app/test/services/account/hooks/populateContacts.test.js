'use strict';

const assert = require('assert');
const populateContacts = require('../../../../src/services/account/hooks/populateContacts.js');

describe('account populateContacts hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    populateContacts()(mockHook);

    assert.ok(mockHook.populateContacts);
  });
});
