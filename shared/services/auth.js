module.exports = {
  login(email, pass, cb) {
  cb = arguments[arguments.length - 1]
  if (localStorage.token) {
    if (cb) cb(true)
    this.onChange(true)
    return
  }
  pretendRequest(email, pass, (res) => {
    if (res.authenticated) {
    localStorage.token = res.token
    if (cb) cb(true)
    this.onChange(true)
  } else {
    if (cb) cb(false)
    this.onChange(false)
  }
})
},

getToken() {
  return localStorage.token
},

logout(cb) {
  delete localStorage.token
  if (cb) cb()
  this.onChange(false)
},

loggedIn() {

  if(typeof localStorage.token === 'undefined') {
    //this means that u are not logged in
    return false

  }
  else{
    console.log('calling in loggedIn() service')
    return !!localStorage.token

  }

},

onChange() {}
}

