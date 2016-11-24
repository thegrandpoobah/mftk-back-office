'use strict';

// src/services/account/hooks/populateContacts.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    const account = hook.result.toJSON()

    return hook.app
      .service('/contacts')
      .find({
        query: {accountId: account.id},
        paginate: false
      })
      .then(contacts => {
        account.contacts = contacts
        hook.result = account

        return hook
      })
  };
};
