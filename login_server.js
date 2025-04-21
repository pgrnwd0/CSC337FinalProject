var http = require('http')
var url = require('url')
var qs = require('querystring')
var crypto = require('crypto')
var fs = require('fs')

var userList = [{ username: 'admin', password: hashPassword('admin123'), role: 'admin' }]

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex')
}

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' })

    if (req.url == '/' || req.url.includes('login.html')) {
        fs.readFile('login.html', function (err, data) {
            if (err) {
                res.end('<h1>Error loading login page</h1>')
            } else {
                res.end(data)
            }
        })
    }

    else if (req.url.includes('login_action.html')) {
        var body = ''
        req.on('data', function (data) {
            body += data
        })
        req.on('end', function () {
            var post = qs.parse(body)
            var username = post.username
            var password = post.password
            var action = post.action

            if (!username || !password || !action) {
                res.end('<h1>Missing credentials</h1>')
                return
            }

            var hashedPwd = hashPassword(password)
            var user = null

            for (var i = 0; i < userList.length; i++) {
                if (userList[i].username == username) {
                    user = userList[i]
                    break
                }
            }

            if (action == 'signin') {
                if (user) {
                    res.end('<h1>User already exists</h1><a href="login.html">Back</a>')
                } else {
                    userList.push({ username: username, password: hashedPwd, role: 'user' })
                    res.end(`
                        <script>
                            localStorage.setItem('username', '${username}');
                            localStorage.setItem('role', 'user');
                            window.location = 'home.html';
                        </script>
                    `)
                }
            } else if (action == 'login') {
                if (user && user.password == hashedPwd) {
                    res.end(`
                        <script>
                            localStorage.setItem('username', '${user.username}');
                            localStorage.setItem('role', '${user.role}');
                            window.location = 'home.html';
                        </script>
                    `)
                } else {
                    res.end('<h1>Invalid username or password</h1><a href="login.html">Back</a>')
                }
            } else {
                res.end('<h1>Invalid action</h1>')
            }
        })
    }

    else if (req.url.includes('home.html')) {
        res.end(`
<!DOCTYPE html>
<html>
  <body>
    <h1 id="welcome"></h1>
    <script>
      var role = localStorage.getItem('role');
      var username = localStorage.getItem('username');
      var msg = role == 'admin' 
        ? 'Welcome, Admin ' + username + '!' 
        : 'Welcome, User ' + username + '!';
      document.getElementById('welcome').textContent = msg;
    </script>
  </body>
</html>
        `)
    }

    else {
        res.end('<h1>404 Not Found</h1>')
    }
}).listen(8080)

console.log('Server running at http://localhost:8080/')
