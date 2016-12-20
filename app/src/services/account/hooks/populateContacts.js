'use strict';

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

    const accountIds = accounts.map(function(i) {
      return i.id
    })

    accounts = accounts.map(function(i) {
      return i.toJSON()
    })

    return hook.app
      .service('/api/contacts')
      .find({
        query: {
          accountId: accountIds,
          $sort: { rank: 1 }
        },
        paginate: false
      })
      .then(contacts => {
        const accountMap = {}

        accounts.forEach(function(i) {
          accountMap[i.id] = i
          accountMap[i.id].contacts = []
        })

        contacts.forEach(function(i) {
          accountMap[i.accountId].contacts.push(i)
        })

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
