const middleware = {}

middleware['auth'] = require('../middleware/auth.js')
middleware['auth'] = middleware['auth'].default || middleware['auth']

middleware['noauth'] = require('../middleware/noauth.js')
middleware['noauth'] = middleware['noauth'].default || middleware['noauth']

export default middleware
