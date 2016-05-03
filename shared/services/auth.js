import cookie from 'react-cookie';
module.exports = {
getToken() {
  var token = cookie.load('token')
  return token.token
},

logout(cb) {
  cookie.remove('token', { path: '/' });
  if (cb) cb()
  this.onChange(false)
},

loggedIn() {
  var token = cookie.load('token')
  if(typeof token === 'undefined' || token === '') {
    console.log('token' + token);
    return false

  }
  else{
    console.log('calling in loggedIn() service')
    console.log(token);
    return true

  }

},

onChange() {}
}

