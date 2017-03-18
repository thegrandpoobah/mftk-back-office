const moment = require('moment-timezone')
const PepipostSDK = require('pepipost-sdk-nodejs')
const fs = require('fs')
const path = require('path')
const app = require('../app')

const sequelize = app.get('sequelize')

const today = moment()
const template = fs.readFileSync(path.resolve(__dirname, 'birthday.html'))

app.services['api/students'].Model.findAll({
	where: { 
		$and: [
			sequelize.where(sequelize.fn('date_part', 'month', sequelize.col('dateOfBirth')), { $eq: today.month() + 1 }),
			sequelize.where(sequelize.fn('date_part', 'day', sequelize.col('dateOfBirth')), { $eq: today.date() - 1 })
		],
		active: true
	},
	include: [{
		model: app.services['api/accounts'].Model,
		as: 'account',
		where: {
			active: true
		},
		include: [
			{
				model: app.services['api/contacts'].Model,
				as: 'contacts',
				where: {
					'rank': 0
				}
			}
		]
	}]
}).then(function(results) {
	results.forEach(student => {
		if (!student.account ||
			!student.account.contacts ||
			!student.account.contacts[0] ||
			!student.account.contacts[0].emails ||
			!student.account.contacts[0].emails[0]) {
			return
		}

		const Email = PepipostSDK.EmailController;

		const data = {
		    "api_key": "",
		    "email_details": {
		        "fromname": "MFTK Martial Arts Academy",
		        "subject": "Happy Birthday [%NAME%]!",
		        "from": "birthday@tigerkims.ca",
		        "content": template
		    },
		    "recipients": [
		    	student.account.contacts[0].emails[0]
		    ],
		    "attributes": {
		    	"NAME": [student.firstName]
		    }
		}

		Email.send(data, function(err_msg, parsed, context) {
		    if (parsed.errorcode == 0) {
		        console.log("mail sent successfully.\n");
		    } else {
		        console.log("Email sent Failed.\n");
		        console.log("errormessage("+parsed.errormessage+")\n");
		        console.log("errorcode("+parsed.errorcode+")\n");
		    }    
		})
	})
})
