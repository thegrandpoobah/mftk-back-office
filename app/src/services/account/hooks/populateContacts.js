'use strict';

const _ = require('lodash')

// src/services/account/hooks/populateContacts.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html
const defaults = {};

// this is in https://github.com/feathersjs/feathers-hooks-common/blob/master/src/utils.js
// couldn't find a way of referencing it, so i'm just going to cut and paste it
const getItems = hook => {
  const items = hook.type === 'before' ? hook.data : hook.result;
  return items && hook.method === 'find' ? items.data || items : items;
};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    let accounts = getItems(hook)
    let isArray = true

    if (!Array.isArray(accounts)) {
      isArray = false
      accounts = [accounts]
    }

    accounts = accounts.map(acct => acct.toJSON())

    return hook.app
      .service('/api/contacts')
      .find({
        query: {
          accountId: accounts.map(acct => acct.id),
          $sort: { rank: 1 }
        },
        paginate: false
      })
      .then(contacts => {
        const accountMap = {}

        accounts.forEach(acct => {
          accountMap[acct.id] = acct
          accountMap[acct.id].contacts = []
        })

        contacts.forEach(contact => {
          accountMap[contact.accountId].contacts.push(contact)
        })

        accounts = _.sortBy(accounts, ['contacts[0].firstName', 'contacts[0].lastName'])
        
        if (!isArray) {
          accounts = accounts[0]
          hook.result = accounts
        } else {
          hook.result.data = accounts
        }

        return hook
      })
  };
};
