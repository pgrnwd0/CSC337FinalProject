
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
    alert("AHHHHHHHHHH!")
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
        username.innerHTML=JSON.parse(userData).username
    })
    .catch(function (err){
        console.log(err)
    })
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
