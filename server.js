var express = require('express')
var app = express()

var fs = require('fs')
var path = require('path')

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
    res.sendFile(path.join(publicFolder, 'index.html'))
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
app.post('/login', express.json(), function(req, res){
    res.sendFile(path.join(publicFolder, 'login.html'))
})

app.post('/lgn_action', express.urlencoded({'extended':true}), function(req,res){
     if(checkLogin(req.body.username, req.body.password)){
        res.sendFile(path.join(publicFolder, 'lgn_action.html'))
    }
    else{
        res.sendFile(path.join(publicFolder, 'lgn_action_failure.html'))
    }
})

// create user
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
    
})

app.get('/account', function(req,res){
    
})

app.get('/order', function(req,res){
    
})

app.get('/order_confirm', function(req,res){
    
})

app.get('/cart', function(req,res){
    
})

app.listen(8080)