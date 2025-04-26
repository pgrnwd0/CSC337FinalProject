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
    fetch('/addToCart' , {
        'headers': {'Content-Type': 'application/json'},
        'method': 'POST',
        'body': JSON.stringify({username: item.name, price:item.price})
    })
    .then(function (req,res){

    })
}

function clearUsers(){
    window.localStorage.clear()
}

async function sssssfetchUserData() {
    var username = document.getElementById('username')
    var email = document.getElementById('email')
    var address = document.getElementById('address')
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: window.localStorage.getItem('username')})
      });
   
      const userData = await response.json();
      alert(userData.username)

    } catch (error) {
      console.error('Error:', error);
  
    }
    

  }

function fetchUserData(){
    fetch('/api/user/profile', {
        'headers': {'Content-Type': 'application/json'},
        'method': 'POST',
        'body': JSON.stringify({username: window.localStorage.getItem('username')})
    })
    .then(function(res){
        return res.json()
    })
    .then(function(userData){
        var username = document.getElementById('username')
        var address = document.getElementById('address')
        var email = document.getElementById('email')
        var name = document.getElementById('name')
        
        if (JSON.parse(userData).fullName != undefined){
            name.innerHTML=JSON.parse(userData).fullName
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
        
        window.localStorage.setItem('firstName',JSON.parse(userData).fullName.split(' ')[0])
        window.localStorage.setItem('lastName',JSON.parse(userData).fullName.split(' ')[1])
        window.localStorage.setItem('email', JSON.parse(userData).email)
        window.localStorage.setItem('address',JSON.parse(userData).address)
    })
    .catch(function (err){
        console.log(err)
    })
}

function parseAddress(address){
    var splitAddress = address.split(',')
    if (splitAddress.length == 5){
        return `${splitAddress[0]},${splitAddress[4]},${splitAddress[1]},${splitAddress[2]},${splitAddress[3]}`
    }
    else {
        return address
    }
}
function fetchCart(){
    fetch('/api/cart', {
        'headers': {'Content-Type': 'application/json'}
    })
    .then(function (res){
        return res.json()
    })
    .then(function (cartData){
        var cart = document.getElementById('cart-container')
        var cartItems = JSON.parse(cartData)
        for (var i = 0; i < cartItems.length; i++){
            cart.innerHTML += `
            <div class='cart-item'>
                ${cartItems[i].name}: ${cartItems[i].price} 
                <div class=main-img>
                    <a href='/${cartItems[i].name}'>
                        <img src="${cartItems[i].name}_1.jpg" alt="Guitar Thumbnail" />
                    </a>
                </div>
                <div>
                    <button onclicked='removeCartItem(${i})>Remove Item</button>
                </div>
            </div>`
        }
    })
    .catch(function (err){
        console.log(err)
    })
}

function removeCartItem(index){

}

function changeHref(){
    var username = window.localStorage.getItem('username')
    if (username != undefined){
        var links = document.getElementsByClassName('a')
        for (var i = 0;i < links.length;i++){
            links[i].href += 'userHome'
        }  
    }
    
}

function addFields(){
    var username = window.localStorage.getItem('username')
    var spot = document.getElementById('username')
    spot.value = username

    var firstName = window.localStorage.getItem('firstName')
    var lastName = window.localStorage.getItem('lastName')
    var email = window.localStorage.getItem('email')
    var address = window.localStorage.getItem('address').split(',')
    var line1Spot = document.getElementById('aLine1')
    var line2Spot = document.getElementById('aLine2')
    var citySpot = document.getElementById('aCity')
    var stateSpot = document.getElementById('aState')
    var ZIPSpot = document.getElementById('aZIP')
    line1Spot.placeholder = address[0]
    citySpot.placeholder = address[1]
    stateSpot.placeholder = address[2]
    ZIPSpot.placeholder = address[3]

    if (address.length==5) {
        line2Spot.placeholder = address[4]
    }

    var firstSpot = document.getElementById('firstName')
    var lastSpot = document.getElementById('lastName')
    var emailSpot = document.getElementById('email')

    firstSpot.placeholder = firstName
    lastSpot.placeholder = lastName
    emailSpot.placeholder = email
}
