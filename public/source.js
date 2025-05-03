
function storeUser(){
    var username = document.getElementById('username').value
    window.localStorage.setItem('username', username)
}
function updateUrls()
{
    var username = window.localStorage.getItem('username')
    if(username!=null){
        var alist = document.getElementsByTagName('a')
        for(var i=0;i<alist.length;i++)
        {
            var par = '?username=' + username
            alist[i].href += par
        }
    }
}
function sendReq(url){
    var username = window.localStorage.getItem('username')
    var body = {}
    if(username!=null){
        body = {'username':username}
    }
    fetch(url, {
        'headers': {'Content-Type': 'application/json'},
        'method': 'POST',
        'body': JSON.stringify(body)
    })
    .then(function(res){
        return res.text()
    })
    .then(function(text){
        document.open()
        document.write(text)
        document.close()
    })
    .catch(function(err){
        console.log(err)
    })
}

function switchImage(thumbnail){
    var newImage = document.getElementsByTagName('img')[thumbnail]
    var mainImage = document.getElementById('mainImage')
    mainImage.src = newImage.src
}

function addToCart(item){
    var cartStr = window.localStorage.getItem('cart')
    var total = Number(window.localStorage.getItem('total'))
    var cart = JSON.parse(cartStr)
    if (cartStr == undefined){
        cart = []
        cart.push(item)
    }
    else {
        cart.push(item)
    }
    if (total == undefined){
        total = item.price
    }
    else {
        total += item.price
    }
    console.log(cart)
    window.localStorage.setItem('cart', JSON.stringify(cart))
    window.localStorage.setItem('total' , total)
    alert('Added to cart. Total: ' + total)

}

function clearUsers(){
    console.log("User: " + window.localStorage.getItem('username'))
    window.localStorage.clear()
    console.log(" Cleared user: " + window.localStorage.getItem('username'))
}

function fetchUserData(){
    fetch('/api/user/profile', {
        'headers': {'Content-Type': 'application/json'},
        'method': 'POST',
        'body': JSON.stringify({'username': window.localStorage.getItem('username')})
    })
    .then(function(res){
        return res.json()
    })
    .then(function(userData){
        var username = document.getElementById('username')
        var address = document.getElementById('address')
        var email = document.getElementById('email')
        var name = document.getElementById('name')
        
        if (JSON.parse(userData).fullname != undefined){
            name.innerHTML=JSON.parse(userData).fullname
        }
        else {
            name.innerHTML="none"
        }
        username.innerHTML=window.localStorage.getItem('username')
    
        if (JSON.parse(userData).email != undefined){
            email.innerHTML=JSON.parse(userData).email
        }
        else {
            email.innerHTML="none"
        }
        if (JSON.parse(userData).address != undefined){
            address.innerHTML=parseAddress(JSON.parse(userData).address)
        }
        else {
            address.innerHTML="none"
        }
    })
    .catch(function (err){
        console.log(err)
    })
}

function fetchUserOrders(){
    fetch('/api/userOrders', {
        'headers': {'Content-Type': 'application/json'},
        'method': 'POST',
        'body': JSON.stringify({username: window.localStorage.getItem('username')})
    })
    .then(function(res){
        return res.json()
    })
    .then(function(userData){

        var table = document.getElementById('order-table')

        console.log(userData)
        for(var k=0;k<userData.length;k++){
            console.log(userData[k])
            

            for(var i=0;i<JSON.parse(userData[k].order).length;i++){
                    var tr = document.createElement('tr')
                    var td = document.createElement('td')
                    var text = document.createTextNode(JSON.parse(userData[k].order)[i].name)
                    td.appendChild(text)
                    tr.appendChild(td)
                    price = document.createElement('td')
                    pricetext = document.createTextNode(JSON.parse(userData[k].order)[i].price)
                    price.appendChild(pricetext)
                    tr.appendChild(price)
                    
                    
                    var td = document.createElement('td')
                    var button = document.createElement('input')
                    button.type = 'button'
                    button.value = 'Order again'

                    var str = `<td><input type="button" value="Order again" onclick='addToCart(` + JSON.stringify(JSON.parse(userData[k].order)[i]) + `)'></td>`
                    tr.appendChild(td)
                    tr.innerHTML += str
                    table.appendChild(tr)
                    

            }
            
        }
    })
    .catch(function (err){
        console.log(err)
    })
}
function parseAddress(address){
    var splitAddress = address.split(',')
    if (splitAddress.length == 5){
        return `${splitAddress[0]},${splitAddress[1]},${splitAddress[2]},${splitAddress[3]} ${splitAddress[4]}`
    }
    else {
        return `${splitAddress[0]},${splitAddress[2]},${splitAddress[3]} ${splitAddress[4]}`
    }
}
function fetchCart(){
    var cart = JSON.parse(window.localStorage.getItem('cart'))
    console.log(cart)
    var table = document.getElementById('cart-table')
    var keys = Object.keys(cart[0])
    console.log(keys)

    var tr = document.createElement('tr')
        for(var i=0;i<keys.length;i++){
            if(keys[i]!='_id'){
                
                var td = document.createElement('th')
                var text = document.createTextNode(keys[i])
                td.appendChild(text)
                tr.appendChild(td)

            }
        }
        var td = document.createElement('th')
        var text = document.createTextNode('Action')
        td.appendChild(text)
        tr.appendChild(td)


        table.appendChild(tr)

        for(var k=0;k<cart.length;k++){

            var tr = document.createElement('tr')
            for(var i=0;i<keys.length;i++){
                if(keys[i]!='_id'){
                    
                    var td = document.createElement('td')
                    var text = document.createTextNode(cart[k][keys[i]])
                    td.appendChild(text)
                    tr.appendChild(td)

                }
                
            }tr.innerHTML +='<td><input type="button" value="Delete" onclick="deleteRow(' + k +')"></td>'

            




            table.appendChild(tr)

        }
    
}
function initialize(){
    window.localStorage.setItem("total", 0)
    window.localStorage.setItem("cart","[]")
}
function deleteRow(index){
    var order = JSON.parse(window.localStorage.getItem('cart'))
    var total = Number(window.localStorage.getItem('total'))
    var row = document.getElementsByTagName('tr')[index + 1].remove()
    console.log(order[index])
    total -= order[index].price
    order.pop(index)
    window.localStorage.setItem('cart', JSON.stringify(order))
    window.localStorage.setItem('total', total)
    var total_display = document.getElementById('total-display')
    total_display.innerHTML = `Total: $${total}.00`
    

}

function addFields(){
    fetch('/api/user/profile', {
        'headers': {'Content-Type': 'application/json'},
        'method': 'POST',
        'body': JSON.stringify({username: window.localStorage.getItem('username')})
    })
    .then(function(res){
        return res.json()
    })
    .then(function(user){
        var username = window.localStorage.getItem('username')
        var spot = document.getElementById('username')
        spot.value = username

        var address = JSON.parse(user).address.split(',')
        var name = JSON.parse(user).fullname.split(' ')
        var line1Spot = document.getElementById('aLine1')
        var line2Spot = document.getElementById('aLine2')
        var citySpot = document.getElementById('aCity')
        var stateSpot = document.getElementById('aState')
        var ZIPSpot = document.getElementById('aZIP')
        line1Spot.value = address[0]
        citySpot.value = address[2]
        stateSpot.value = address[3]
        ZIPSpot.value = address[4]
        line2Spot.value = address[1]

        var firstSpot = document.getElementById('firstName')
        var lastSpot = document.getElementById('lastName')
        var emailSpot = document.getElementById('email')

        firstSpot.value= name[0]
        lastSpot.value = name[1]
        emailSpot.value = JSON.parse(user).email
    })
    
}

function sendCart(){
    var username = window.localStorage.getItem('username')
    var cart = window.localStorage.getItem('cart')
    var total = window.localStorage.getItem('total')
    var name = document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value 
    var address = [document.getElementById('aLine1').value,document.getElementById('aLine2').value, 
        document.getElementById('aCity').value,document.getElementById('aState').value,
        document.getElementById('aZIP').value]
       
    var body = {}
    if (name != " " && address.length == 5){
        if(username!=null){
        body = {'username':username, 'cart':cart, 'address':address, 'name':name, 'total':total}
    }
    else{
        body = {'username':'guest','cart':cart , 'address':address, 'name':name, 'total':total}
    }
    console.log('sending order: ' + cart)
    fetch('/api/order', {
        'headers': {'Content-Type': 'application/json'},
        'method': 'POST',
        'body': JSON.stringify(body)
    })
    .then(function(){
        console.log('success. deleting old cart')
        window.localStorage.setItem('cart' , JSON.stringify([]))
        window.localStorage.setItem('total', 0)
    })
    .catch(function(err){
        console.log(err)
    })
    }
else {
    alert("Please fill out required information")
}
    }
    

function getUnfufilledOrders(){
    fetch('/api/unorders', {
        'headers': {'Content-Type': 'application/json'},
        'method': 'POST',
    })
    .then(function (res){
        return res.json()
    })
    .then(function (orders){
        var table = document.getElementById('order-table')

        for(var k=0;k<orders.length;k++){
            console.log(orders[k])
            
                    var tr = document.createElement('tr')
                    var td = document.createElement('td')
                    for (var i = 0; i < JSON.parse(orders[k].order).length; i++){
                        var text = document.createTextNode("[" + JSON.parse(orders[k].order)[i].name + "]")
                        td.appendChild(text)
                    }
                    
                    
                    tr.appendChild(td)
                    var name = document.createElement('td')
                    var nametext = document.createTextNode(orders[k].name)
                    name.appendChild(nametext)
                    tr.appendChild(name)
                    var address= document.createElement('td')
                    var addresstext = document.createTextNode(parseAddress(JSON.stringify(orders[k].address)))
                    address.appendChild(addresstext)
                    tr.appendChild(address)
                    
                    
                    var td = document.createElement('td')
                    var button = document.createElement('input')
                    button.type = 'button'
                    button.value = 'Order again'
                    var str = `<td><input type="button" value="Mark as fullfilled" onclick='fullfill(` + JSON.stringify(orders[k]._id)+ `,` + k+ `)'></td>`
                    tr.appendChild(td)
                    tr.innerHTML += str
                    table.appendChild(tr)
                    

            
        }
    })
    .catch(function (err){
        console.log(err)
    })
}

function fullfill(id, index){
    body = {'_id':id}
    fetch('/api/fullfill', {
        'headers': {'Content-Type': 'application/json'},
        'method': 'POST',
        'body': JSON.stringify(body)
    })
    .then(function (res){
        console.log('order marked fullfilled')
        var row = document.getElementsByTagName('tr')[index + 1].remove()

    })
    .catch(function (err){
        console.log(err)
    })

}

function dashboard(){
    fetch('/dashboard', {
        'headers': {'Content-Type': 'application/json'},
        'method': 'POST'}
    )
    .then(function(res){
        return res.json()
    })
    .then(function(data){
        console.log(data)
        var orderTotal = document.getElementById('orderTotal')
        var pendingOrders = document.getElementById('pendingOrders')
        var totalUsers = document.getElementById('users')
        var moneyMade = document.getElementById('moneyMade')
        if (data.orderTotal == 0){
            orderTotal.innerText += 0
        }
        else {
            orderTotal.innerText += data.orderTotal
        }
        
        if (data.pendingOrders == 0){
            pendingOrders.innerText += 0
        }
        else {
            pendingOrders.innerText += data.pendingOrders
        }
        if (data.totalUsers == 0){
            totalUsers.innerText += 0
        }
        else {
            totalUsers.innerText += data.totalUsers
        }

        if (data.moneyMade == 0){
            moneyMade.innerHTML += 0
        }
        else{
            moneyMade.innerHTML += data.moneyMade
        }
        
    })
    .catch(function(err){
        console.log(err)
    })
}