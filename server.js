var express = require('express')
var app = express()
var crypto = require('crypto')
var fs = require('fs')
var path = require('path')
var {MongoClient} = require('mongodb')
var client = new MongoClient('mongodb://127.0.0.1:27017/')

var cart = [{'name':'guitar1', 'price':'100'}, {'name':'guitar2', 'price':'100'} ]
var orders = []

function insertManyPromise(docList){
    client.connect()
    .then(function(){
        console.log('connected to Mongodb ...')
        var db = client.db('testDB2')
        var coll = db.collection('newCollection')
        return coll.insertMany(docList)
    })
    .then(function(){
        console.log('Inserted many ...')
    })
    .catch(function(err){
        console.log(err)
    })
    .finally(function(){
        client.close()
    })
}

function deletePromise(search){
    client.connect()
    .then(function(){
        console.log('connected to Mongodb ...')
        var db = client.db('testDB2')
        var coll = db.collection('newCollection')
        //return coll.deleteOne(search)
        return coll.deleteMany(search)
    })
    .then(function(){
        console.log('Deleted one')
    })
    .catch(function(err){
        console.log(err)
    })
    .finally(function(){
        client.close()
    })
}

function updatePromise(search, changes){
    client.connect()
    .then(function(){
        console.log('connected to Mongodb ...')
        var db = client.db('testDB2')
        var coll = db.collection('newCollection')
        return coll.updateMany(search, changes)
    })
    .then(function(){
        console.log('Deleted one')
    })
    .catch(function(err){
        console.log(err)
    })
    .finally(function(){
        client.close()
    })
}

function insertPromise(doc){
    client.connect()
    .then(function(){
        console.log('connected to Mongodb ...')
        var db = client.db('testDB2')
        var coll = db.collection('newCollection')
        return coll.insertOne(doc)
    })
    .then(function(){
        console.log('Inserted one ...')
    })
    .catch(function(err){
        console.log(err)
    })
    .finally(function(){
        client.close()
    })
}

function mongodbConnectPromise(){
    client.connect()
    .then(function(){
        console.log('connected to Mongodb ...')
        var db = client.db('testDB2')
        var coll = db.collection('newCollection')
    })
    .catch(function(err){
        console.log(err)
    })
    .finally(function(){
        client.close()
    })
}
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
app.get('/', function (req,res){
    res.sendFile(path.join(publicFolder, 'index2.html'))
    })
app.post('/' , express.json(), function (req,res){
    if (req.body.username != undefined){
        res.sendFile(path.join(publicFolder, 'index_user.html'))
    }
    else {
        res.sendFile(path.join(publicFolder, 'index2.html'))
    }
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
            res.sendFile(path.join(publicFolder, 'index_user.html'))
        }
    }
    else{
        res.sendFile(path.join(publicFolder, 'lgn_action_failure.html'))
    }
})

//app.get('/userHome', function(req,res){
    //res.sendFile(path.join(publicFolder, 'index_user.html'))
//})

//app.get('/adminHome', function(req,res){
  //  res.sendFile(path.join(publicFolder, 'index_user.html'))
//})

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

app.post('/store',express.json(), function(req,res){
    if (req.body.username != undefined){
        res.sendFile(path.join(publicFolder, 'gallery.html'))
    }
    else {
       res.sendFile(path.join(publicFolder, 'gallery.html')) 
    }
    
})

app.post('/account', express.json(),function(req,res){
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
app.post('/cart', express.json(),function(req,res){
    res.sendFile(path.join(publicFolder, 'cart.html'))
})

app.get('/api/cart', function(req,res){
    
    res.json(JSON.stringify(cart));
})
app.get('/edit_account', function(req,res){
    
    res.sendFile(path.join(publicFolder, 'edit_account.html'))
})
app.post('/update_account', express.urlencoded({'extended':true}), function(req, res){

    username = req.body.username
    fullName = req.body.firstName + " " + req.body.lastName
    email = req.body.email
    if (req.body.aLine2 == ''){
        address = `${req.body.aLine1}, ${req.body.aCity},${req.body.aState},${req.body.aZIP}`
    }
    else {
        address = `${req.body.aLine1},${req.body.aCity},${req.body.aState},${req.body.aZIP},${req.body.aLine2}`
    }
    

    for (var i = 0; i < userList.length; i++){
        if (username == userList[i].username){
            userList[i]['fullName'] = fullName
            userList[i]['email'] = email
            userList[i]['address'] = address
            break
        }
    }
    console.log(userList[i])

    res.redirect('/account')
})

app.post('/logout', express.json(),function(req,res){
    res.sendFile(path.join(publicFolder, 'logout.html'))
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