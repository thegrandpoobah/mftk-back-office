'use strict';

// student-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const student = sequelize.define('student', {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    dateOfBirth: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    gender: {
      type: Sequelize.ENUM('Male', 'Female')
    },
    roles: {
      type: Sequelize.ARRAY(Sequelize.STRING)
      // ideally, this would just be Sequelize.ARRAY(Sequelize.ENUM('Student', 'Instructor', 'Demo Team'))
      // but this is prevented by https://github.com/sequelize/sequelize/issues/1498
    }
  }, {
    classMethods: {
      associate() {
        student.belongsTo(sequelize.models.account, { as: 'account' });
        student.hasMany(sequelize.models.attendance, { as: 'attendance' });
        student.hasMany(sequelize.models.note, { as: 'notes' });
        student.hasMany(sequelize.models.rank, { as: 'ranks' });
      },
      getSearchVector() {
        return 'fts_text';
      },
      addFullTextIndex() {
        if(sequelize.options.dialect !== 'postgres') {
          console.log('Not creating search index, must be using POSTGRES to do this');
          return;
        }

        var Student = this;
        var vectorName = Student.getSearchVector();

        sequelize.getQueryInterface().describeTable(Student.tableName).then(attributes => {
          if (attributes[vectorName]) {
            return
          }

          var searchFields = ['"firstName"', '"lastName"'];

          sequelize
            .query('ALTER TABLE "' + Student.tableName + '" ADD COLUMN "' + vectorName + '" TSVECTOR')
            .then(function() {
              return sequelize
                .query('UPDATE "' + Student.tableName + '" SET "' + vectorName + '" = to_tsvector(\'simple\', ' + searchFields.join(' || \' \' || ') + ')')
                .error(console.log);
            }).then(function() {
              return sequelize
                .query('CREATE INDEX student_search_idx ON "' + Student.tableName + '" USING gin("' + vectorName + '");')
                .error(console.log);
            }).then(function() {
              return sequelize
                .query('CREATE TRIGGER student_vector_update BEFORE INSERT OR UPDATE ON "' + Student.tableName + '" FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger("' + vectorName + '", \'pg_catalog.simple\', ' + searchFields.join(', ') + ')')
                .error(console.log);
            }).error(console.log);
        })
      },
      search(role, query) {
        if(sequelize.options.dialect !== 'postgres') {
          console.log('Search is only implemented on POSTGRES database');
          return;
        }

        var Student = this;

        query = sequelize.getQueryInterface().escape(query.toLocaleLowerCase() + ':*');
        role = sequelize.getQueryInterface().escape(role);
        
        return sequelize
          .query('SELECT * FROM "' + Student.tableName + '" WHERE ' + role + ' = ANY(roles) AND "active" = true AND "' + Student.getSearchVector() + '" @@ ' + query + ';', {model: student, type: sequelize.QueryTypes.SELECT})
      }
    }
  });

  return student;
};
