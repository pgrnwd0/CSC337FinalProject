var express = require('express')
var app = express()
var crypto = require('crypto')
var fs = require('fs')
var path = require('path')
var {MongoClient, ObjectId} = require('mongodb')
var client = new MongoClient('mongodb://127.0.0.1:27017/')

var orderNumber = 0

function insertManyPromise(docList){
    client.connect()
    .then(function(){
        console.log('connected to Mongodb ...')
        var db = client.db('guitarWorldDB')
        var coll = db.collection('users')
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
        var db = client.db('guitarWorldDB')
        var coll = db.collection('users')
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

function updatePromise(search, changes, type){
    client.connect()
    .then(function(){
        console.log('connected to Mongodb ...')
        var db = client.db('guitarWorldDB')
        var coll = db.collection(type)
        return coll.updateMany(search, changes)
    })
    .then(function(){
        console.log('Updated one')
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
        var db = client.db('guitarWorldDB')
        var coll = db.collection('users')
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

async function insertOrder(doc){
    try{
        
        await client.connect()
        console.log('connected to Mongodb ...')
        var db = client.db('guitarWorldDB')
        var coll = db.collection('orders')
        await coll.insertOne(doc)
        console.log('Inserted one ...')
        await client.close()
    }catch(err){
        console.log(err)
    }
}
    
async function find(search, type){
    try {
        await client.connect()
        var db = client.db('guitarWorldDB')
        var coll = db.collection(type)
        var user = await coll.findOne(search)
        client.close()
        return user
    }
    catch(err){
        console.log(err)
    }
}
async function findMany(search, type){
    try {
        await client.connect()
        var db = client.db('guitarWorldDB')
        var coll = db.collection(type)
        user = await coll.find(search).toArray()
        client.close()
        return user
    }
    catch(err){
        console.log(err)
    }
}

async function checkLogin(username, password){
    try{
        var user =  await find({'username':username}, 'users')
        console.log(user)
        if (user != null){
            var hashedPass = crypto.createHash('sha256').update(password).digest('hex')
            if (username == user.username && hashedPass == user.password){
                if (user.usertype == 'admin'){
                    return 2
                }
                return 1
            }
        }
        return 0
    }
    catch(err){
        console.log(err)
    }
}


var publicFolder = path.join(__dirname, 'public/')

// home
app.get('/', function (req,res){
    res.sendFile(path.join(publicFolder, 'index.html'))
    })

app.post('/' , express.json(), function (req,res){
    if (req.body.username != undefined){
        res.sendFile(path.join(publicFolder, 'index.html'))
    }
    else {
        res.sendFile(path.join(publicFolder, 'index_user.html'))
    }
})

app.get('/user', function (req,res){
    res.sendFile(path.join(publicFolder, 'index_user.html'))
})
app.get('/admin', function (req, res){
    res.sendFile(path.join(publicFolder, 'index_admin.html'))
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

app.post('/lgn_action', express.urlencoded({'extended':true}), async function(req,res){
    try {
        var login = await checkLogin(req.body.username, req.body.password)
        if (login == 1){
            res.redirect('/user')
        }
        else if (login == 2){
            res.redirect('/admin')
        }
        else {
            res.sendFile(path.join(publicFolder, 'lgn_action_failure.html'))
        }
    }
    catch(err){
        console.log(err)
    }
})

app.get('/logout', function(req,res){
    res.sendFile(path.join(publicFolder, 'logout.html'))
})

// create user
app.get('/create_user', function(req, res){
    res.sendFile(path.join(publicFolder, 'create_user.html'))
})

app.post('/create_action', express.urlencoded({'extended':true}), function(req, res){
    var hashedPass = crypto.createHash('sha256').update(req.body.password).digest('hex')

    var user = {'username':req.body.username, 'password':hashedPass, 'usertype':req.body.usertype}

    insertPromise(user)

    res.redirect('/')
})

app.get('/store', function(req, res){
    res.sendFile(path.join(publicFolder, 'gallery.html'))
})
app.get('/store_user', function(req, res){
    res.sendFile(path.join(publicFolder, 'gallery_user.html'))
})
app.get('/account',function(req,res){
    res.sendFile(path.join(publicFolder, 'account.html'))
})


app.post('/api/user/profile',  express.json(),  async function (req, res){
    var username = req.body.username
    try{
        var user = await find({'username':username}, 'users')
        console.log(user)
        var userData = JSON.stringify(user);
        res.json(userData);
    }
    catch(err){
        console.log(err)
    }
  });

app.get('/order', function(req,res){
    res.sendFile(path.join(publicFolder, 'order.html'))
})
app.get('/order_user', function(req,res){
    res.sendFile(path.join(publicFolder, 'order_user.html'))
})
app.get('/orders_admin', function(req,res){
    res.sendFile(path.join(publicFolder, 'order_admin.html'))
})
app.get('/order_confirm', function(req,res){
    res.sendFile(path.join(publicFolder, 'order_confirm.html'))
})
app.post('/order_confirm', express.json(), function(req,res){

    res.sendFile(path.join(publicFolder, 'order_confirm.html'))
})
app.get('/order_confirm_user', function(req,res){
    res.sendFile(path.join(publicFolder, 'order_confirm_user.html'))
})
app.post('/order_confirm_user', express.urlencoded({'extended':true}), function (req, res){
    res.sendFile(path.join(publicFolder, 'order_confirm_user.html'))
})
app.get('/cart', function(req,res){
    res.sendFile(path.join(publicFolder, 'cart.html'))
})
app.get('/cart_user', function(req,res){
    res.sendFile(path.join(publicFolder, 'cart_user.html'))
})

app.post('/api/unorders', express.json(), async function(req, res) {
    try{
        var orders = await findMany({'fullfilled':'no'}, 'orders')
        for (var i = 0; i < orders.length; i++){
            console.log(orders[i])
        }
        res.json(orders)
    }
    catch(err){
        console.log(err)
    }
})

app.post('/api/order',express.json(), async function(req,res){ 
    try{
        var username = req.body.username
        console.log(req.body.cart)
        if (username == undefined){
            username = 'guest'
        }
        body = {'username':username, 'order':req.body.cart, 'name':req.body.name, 'address':req.body.address, 'orderNumber':orderNumber, 'fullfilled':'no', 'total':req.body.total}
        orderNumber += 1
        await insertOrder(body)
        console.log('inserted order')
        res.send('order successfull')
    }
    catch(err){
        console.log(err)
    }
    
})
app.get('/edit_account', function(req,res){ 
    res.sendFile(path.join(publicFolder, 'edit_account.html'))
})

app.post('/update_account', express.urlencoded({'extended':true}), async function(req, res){
    try{
        username = req.body.username
        console.log(req.body)
        fullName = req.body.firstName + " " + req.body.lastName
        email = req.body.email
        address = `${req.body.aLine1},${req.body.aLine2},${req.body.aCity},${req.body.aState},${req.body.aZIP}`

        updatePromise({'username':username}, {"$set":{'address':address, 'fullname': fullName, 'email':email}}, 'users')
        res.sendFile(path.join(publicFolder, 'account.html')) 
    }
    catch(err){
        console.log(err)
    }
        
    
    
})

app.post('/api/userOrders',express.json(), async function(req,res){
    var username = req.body.username
    try{
        var orders = await findMany({'username':username}, 'orders')
        for (var i = 0; i< user.length;i++){
            console.log(orders[i])
        }
        
        var userData = JSON.stringify(user.orders);
        res.json(user);
    }
    catch(err){
        console.log(err)
    }
}) 

app.get('/past_orders', function(req,res){
    res.sendFile(path.join(publicFolder, 'order_account.html'))
})

app.post('/api/fullfill', express.json(), async function (req, res){
    try{
        var id = new ObjectId(`${req.body._id}`)
        console.log(id)
        updatePromise({'_id':id}, {"$set": {'fullfilled':'yes'}}, 'orders')
        res.send("go for it")
    }
    catch(err){
        console.log(err)
    }
})
app.post('/dashboard', express.json(), async function(req, res){
    try{
        var totalOrders = await findMany({} , 'orders')
        var totalLength = totalOrders.length
        var pendingOrders = 0
        
        var total = 0 
        for (var i = 0; i < totalOrders.length;i++ ){
            if (totalOrders[i].fullfilled == 'no'){
                pendingOrders += 1;
            }
            total += Number(totalOrders[i].total)
        }
        var ttt = await findMany({}, 'users')
        var totalUsers = await findMany({}, 'users')
        var data = {'orderTotal':totalLength ,'pendingOrders':pendingOrders, 'totalUsers':totalUsers.length -1, 'moneyMade':total}
        console.log(data)
        res.json(data)
    }
    catch(err){
        console.log(err)
    }
})
// images
app.get('/guitar1', function(req,res){
    res.sendFile(path.join(publicFolder, 'guitar1.html'))
})
app.get('/guitar1_user', function(req,res){
    res.sendFile(path.join(publicFolder, 'guitar1_user.html'))
})
app.get('/guitar2', function(req,res){
    res.sendFile(path.join(publicFolder, 'guitar2.html'))
})
app.get('/guitar2_user', function(req,res){
    res.sendFile(path.join(publicFolder, 'guitar2_user.html'))
})
app.get('/guitar3', function(req,res){
    res.sendFile(path.join(publicFolder, 'guitar3.html'))
})
app.get('/guitar3_user', function(req,res){
    res.sendFile(path.join(publicFolder, 'guitar3_user.html'))
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