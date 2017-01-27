'use strict';

// contact-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const contact = sequelize.define('contact', {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gender: {
      type: Sequelize.ENUM('Male', 'Female')
    },
    emails: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    phones: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    addresses: {
      type: Sequelize.JSON
    },
    rank: {
      type: Sequelize.INTEGER
    }
  }, {
    classMethods: {
      associate() {
        contact.belongsTo(sequelize.models.account, { as: 'account' })
      },
      getSearchVector() {
        return 'fts_text';
      },
      addFullTextIndex() {
        if(sequelize.options.dialect !== 'postgres') {
          console.log('Not creating search index, must be using POSTGRES to do this');
          return;
        }

        var Contact = this;
        var vectorName = Contact.getSearchVector();

        sequelize.getQueryInterface().describeTable(Contact.tableName).then(attributes => {
          if (attributes[vectorName]) {
            return
          }

          var searchFields = ['"firstName"', '"lastName"'];

          sequelize
            .query('ALTER TABLE "' + Contact.tableName + '" ADD COLUMN "' + vectorName + '" TSVECTOR')
            .then(function() {
              return sequelize
                .query('UPDATE "' + Contact.tableName + '" SET "' + vectorName + '" = to_tsvector(\'simple\', ' + searchFields.join(' || \' \' || ') + ')')
                .error(console.log);
            }).then(function() {
              return sequelize
                .query('CREATE INDEX contact_search_idx ON "' + Contact.tableName + '" USING gin("' + vectorName + '");')
                .error(console.log);
            }).then(function() {
              return sequelize
                .query('CREATE TRIGGER contact_vector_update BEFORE INSERT OR UPDATE ON "' + Contact.tableName + '" FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger("' + vectorName + '", \'pg_catalog.simple\', ' + searchFields.join(', ') + ')')
                .error(console.log);
            }).error(console.log);
        })
      },
      search(query) {
        if(sequelize.options.dialect !== 'postgres') {
          console.log('Search is only implemented on POSTGRES database');
          return;
        }

        var Contact = this;

        query = sequelize.getQueryInterface().escape(query.toLocaleLowerCase() + ':*');
        
        return sequelize
          .query('SELECT * FROM "' + Contact.tableName + '" WHERE "' + Contact.getSearchVector() + '" @@ ' + query + ';', {model: contact, type: sequelize.QueryTypes.SELECT})
      }
    }
  });

  return contact;
};
