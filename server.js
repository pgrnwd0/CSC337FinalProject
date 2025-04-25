var express = require('express')
var app = express()
var crypto = require('crypto')
var fs = require('fs')
var path = require('path')

var cart = [{'name':'guitar1', 'price':'100'}, {'name':'guitar2', 'price':'100'} ]
var orders = []
function loadUsers(){
    try{
        var users = fs.readFileSync('users.txt', {'encoding':'utf8'})
        var userList2 = users.split('\n')
        var result = []
        for(var i=0;i<userList2.length-1;i++)
        {
            var user = userList2[i]
            user = user.split(',')
            var obj = {'username':user[0], 'password':user[1], 'usertype':user[2]}
            result.push(obj)
        }
        return result
    }catch(err){
        console.log(err)
        return []
    }
}

var userList = loadUsers()

function checkLogin(username, password){
    for(var i=0;i<userList.length;i++)
    {
        var user = userList[i]
        var hashedPass = crypto.createHash('sha256').update(password).digest('hex')
        if((user.username==username)&&(user.password==hashedPass)){
            return true
        }
    }
    return false
}

function checkAdmin(username){
    for(var i=0;i<userList.length;i++){
        var user = userList[i]
        if((user.username==username)&&(user.usertype=='admin'))
        {
            return true
        }
    }
    return false
}

var publicFolder = path.join(__dirname, 'public/')

// home
app.get('/', function(req,res){
    res.sendFile(path.join(publicFolder, 'index2.html'))
})
// source file
app.get('/source.js', function(req, res){
    res.sendFile(path.join(publicFolder, 'source.js'))
})

// style sheet
app.get('/style.css', function(req, res){
    res.sendFile(path.join(publicFolder, 'style.css'))
})

// login
app.get('/login', function(req,res){
    res.sendFile(path.join(publicFolder, 'login.html'))
})
app.post('/login', express.json(), function(req, res){
    res.sendFile(path.join(publicFolder, 'login.html'))
})

app.post('/lgn_action', express.urlencoded({'extended':true}), function(req,res){
     if(checkLogin(req.body.username, req.body.password)){

        if(checkAdmin(req.body.username)){
            res.redirect("/adminHome") 
        }
        else{
            res.redirect("/userHome") 
        }
    }
    else{
        res.sendFile(path.join(publicFolder, 'lgn_action_failure.html'))
    }
})

app.get('/userHome', function(req,res){
    res.sendFile(path.join(publicFolder, 'index_user.html'))
})

app.get('/adminHome', function(req,res){
    res.sendFile(path.join(publicFolder, 'index_user.html'))
})

app.get('/logout', function(req,res){
    res.redirect('/')
})

// create user
app.get('/create_user', function(req, res){
    res.sendFile(path.join(publicFolder, 'create_user.html'))
})
app.post('/create_user', express.json(), function(req, res){
    res.sendFile(path.join(publicFolder, 'create_user.html'))
})

app.post('/create_action', express.urlencoded({'extended':true}), function(req, res){
    var hashedPass = crypto.createHash('sha256').update(req.body.password).digest('hex')

    userList.push({'username':req.body.username, 'password':hashedPass, 'usertype':req.body.usertype})
    console.log('Number of users:', userList.length)

    try{
        var user = `${req.body.username},${hashedPass},${req.body.usertype}\n`
        fs.appendFileSync('users.txt', user, {'encoding':'utf8'})
    }catch(err){
        console.log(err)
    }

    res.sendFile(path.join(publicFolder, 'create_action.html'))
})

app.get('/store', function(req,res){
    res.sendFile(path.join(publicFolder, 'gallery.html'))
})

app.get('/account', function(req,res){
    res.sendFile(path.join(publicFolder, 'account.html'))
})

app.post('/api/user/profile',  express.json(), function (req, res){
    var username = req.body.username
    console.log(username)
    var userID = 0
    for (var i = 0; i < userList.length; i++){
        if (username == userList[i].username) {
            userID = i
            break
        }
    }
    const userData = JSON.stringify(userList[userID]);
    res.json(userData);
  });

app.get('/order', function(req,res){
    
})

app.get('/order_confirm', function(req,res){
    cart = []
})

app.get('/cart', function(req,res){
    res.sendFile(path.join(publicFolder, 'cart.html'))
})

app.get('/api/cart', function(req,res){
    
    res.json(JSON.stringify(cart));
})



// images
app.get('/guitar1', function(req,res){
    res.sendFile(path.join(publicFolder, 'guitar1.html'))
})
app.get('/guitar2', function(req,res){
    res.sendFile(path.join(publicFolder, 'guitar2.html'))
})
app.get('/guitar3', function(req,res){
    res.sendFile(path.join(publicFolder, 'guitar3.html'))
})
app.get('/guitar1_1.jpg', function (req, res){
    res.sendFile(path.join(publicFolder, 'guitar1_1.jpg'))
})
app.get('/guitar1_2.jpg', function (req, res){
    res.sendFile(path.join(publicFolder, 'guitar1_2.jpg'))
})
app.get('/guitar1_3.jpg', function (req, res){
    res.sendFile(path.join(publicFolder, 'guitar1_3.jpg'))
})
app.get('/guitar1_4.jpg', function (req, res){
    res.sendFile(path.join(publicFolder, 'guitar1_4.jpg'))
})
app.get('/guitar2_1.jpg', function (req, res){
    res.sendFile(path.join(publicFolder, 'guitar2_1.jpg'))
})
app.get('/guitar2_2.jpg', function (req, res){
    res.sendFile(path.join(publicFolder, 'guitar2_2.jpg'))
})
app.get('/guitar2_3.jpg', function (req, res){
    res.sendFile(path.join(publicFolder, 'guitar2_3.jpg'))
})
app.get('/guitar2_4.jpg', function (req, res){
    res.sendFile(path.join(publicFolder, 'guitar2_4.jpg'))
})
app.get('/guitar3_1.jpg', function (req, res){
    res.sendFile(path.join(publicFolder, 'guitar3_1.jpg'))
})
app.get('/guitar3_2.jpg', function (req, res){
    res.sendFile(path.join(publicFolder, 'guitar3_2.jpg'))
})
app.get('/guitar3_3.jpg', function (req, res){
    res.sendFile(path.join(publicFolder, 'guitar3_3.jpg'))
})
app.get('/guitar3_4.jpg', function (req, res){
    res.sendFile(path.join(publicFolder, 'guitar3_4.jpg'))
})
app.get('/guitar.png', function(req,res){
    res.sendFile(path.join(publicFolder, 'guitar.png'))
})
app.get('/homeBackdrop.jpg', function(req, res){
    res.sendFile(path.join(publicFolder, 'homeBackdrop.jpg'))
})
app.get('/loginBackground1.jpg', function(req, res){
    res.sendFile(path.join(publicFolder, 'loginBackground1.jpg'))
})
app.get('/loginBackground2.jpg', function(req, res){
    res.sendFile(path.join(publicFolder, 'loginBackground2.jpg'))
})

app.listen(8080)