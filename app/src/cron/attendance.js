const moment = require('moment-timezone')
const PepipostSDK = require('pepipost-sdk-nodejs')
const app = require('../app')

const Email = PepipostSDK.EmailController;

const data = {
    "api_key": app.get('pepipost_api_key'),
    "email_details": {
        "fromname": "MFTK Martial Arts",
        "subject": "[% DATE %] Attendance Report",
        "from": "attendance@tigerkims.ca",
        "content": '<p>The [% DATE %] Attendance Report can be viewed <a href="https://admin.tigerkims.ca/admin/reports?end=[% DATEISO %]">here</a>.</p>'
    },
    "recipients": [
      "mftk.academy@gmail.com"
    ],
    "attributes": {
      "DATE": [moment().format('MMMM Do YYYY')],
      "DATEISO": [moment().format()]
    }
}

console.log('Sending e-mail to mftk.academy@gmail.com')

Email.send(data, function(err_msg, parsed, context) {
    if (parsed.errorcode == 0) {
        console.log('Mail sent successfully to mftk.academy@gmail.com')
    } else {
        console.log('Failed to send mail to mftk.academy@gmail.com')
        console.log("errormessage("+parsed.errormessage+")")
        console.log("errorcode("+parsed.errorcode+")")
    }
})
