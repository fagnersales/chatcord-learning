const moment = require('moment')
moment.locale('pt-br')

const formatMessage = (username, content) => {
    return {
        author: {
            username: username
        },
        content,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage