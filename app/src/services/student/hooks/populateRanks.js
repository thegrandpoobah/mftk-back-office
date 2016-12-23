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
    let students = getItems(hook)
    let isArray = true

    if (!Array.isArray(students)) {
      isArray = false
      students = [students]
    }

    students = students.map(student => student.toJSON())

    return hook.app
      .service('/api/ranks')
      .find({
        query: {
          studentId: students.map(student => student.id),
          $sort: { promotedOn: -1 }
        },
        paginate: false
      })
      .then(ranks => {
        const studentMap = {}

        students.forEach(student => {
          studentMap[student.id] = student
          studentMap[student.id].ranks = []
        })

        ranks.forEach(rank => {
          studentMap[rank.studentId].ranks.push(rank)
        })

        if (!isArray) {
          students = students[0]
          hook.result = students
        } else {
          hook.result.data = students
        }

        return hook
      })
  };
};
