var express = require('express')
var app = express()

var fs = require('fs')
var path = require('path')

var rootFolder = path.join(__dirname, 'public/')

// home
app.get('/', function(req,res){

})
// login
app.get('/login', function(req,res){

})

app.get('/lgn_action', function(req,res){
    
})

app.get('/create_user', function(req,res){
    
})

app.get('/create_action', function(req,res){
    
})

app.get('/store', function(req,res){
    
})

app.get('/account', function(req,res){
    
})

app.get('/order', function(req,res){
    
})

app.get('/order_confirm', function(req,res){
    
})

app.listen(8080)