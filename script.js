function Customer(userName,passWord){
  this.userName = userName;
  this.passWord = passWord;
  this.cart = [];
  this.address = '';
  this.payment = '';
}



function register(){
  let userName = document.getElementById('userName').value;
  let passWord = document.getElementById('passWord').value;;
  let rePassWord =  document.getElementById('rePassWord').value;;
  let email =  document.getElementById('email').value;;

  let arr = [userName,passWord,rePassWord,email];


  //Error check 
  if (errorCheck(arr)){
      alert("Please fill out all form inputs");
      return;
  }


  //Check to see if user name is already registered in local storage
  if(checkUserName(userName)){
    alert("This username is already taken. Please try again");
    return;
  }

  //Check to see if password match
  if(!matchPasswords(passWord,rePassWord)){
    alert("Passwords do not match");
    return;
  }


  //Create a new customer object and save to local storage
  let user = new Customer(userName,passWord);
  localStorage.setItem(userName,JSON.stringify(user));

  //Go to login

  window.location.href = 'login.html';


  
}

function login(){
  let  enteredUserName = document.getElementById('enteredUN').value;;
  let enteredPassWord = document.getElementById('enteredPW').value;;

  //Error check
  if ([enteredUserName,enteredPassWord].includes('')){
    alert("Please fill out all form inputs");
    return;
  }

  //Check to see if usermane exists
  if(!checkUserName(enteredUserName)){
    alert("Username does not exist");
    return;
  }

  let user = JSON.parse(localStorage.getItem(enteredUserName));

  //Check to see if passwords match
  if (!matchPasswords(enteredPassWord,user.passWord)){
    alert("Incorrect password");
    return;
  }

  //load current username to localstroage
  localStorage.setItem("currentUser",enteredUserName);

    //move to catalogue page
    window.location.href='products.html';
}

function checkUserName(enteredUN){

  let keys = Object.keys(localStorage);

  //Loop thorugh all keys
  for(i = 0; i<keys.length;i++){
    if(keys[i] == enteredUN)
    return true;
  }

  return false;
}

//Used to error check forms
function errorCheck(arr){

  if (arr.includes('')){
    return true;
  }

  return false;

}


//Check passwords
function matchPasswords(pW1,pW2){
  return pW1 == pW2;
}



// function checkUserName(enteredUN){

//   if (localStorage.getItem(enteredUN) == null){
//     return true;
//   }

//   return false;
// }


function addToCart(button){

  let product = button.parentElement.parentElement;

  //Get the products image, name, quantity and price;
  //Use query selector

  let imgProduct = product.querySelector(".imgProduct").src;
  let itemName = product.querySelector(".itemName").textContent;
  let quantity = product.querySelector(".quantity").value;
 let price = product.querySelector('.price').textContent;

 //Store in arr

 let arr = [imgProduct,itemName,quantity,price];

 //Store into the current user's shooping cart

 let currentUser = JSON.parse(localStorage.getItem(localStorage.getItem('currentUser')));

 //Check to see if a product already exists in cart
 let itemsArr = itemNames();

 //If yes, just add the quantity to it
 if (itemsArr.includes(itemName)){
  let indexItem = itemsArr.indexOf(itemName);
  currentUser.cart[indexItem][2] =  parseInt(currentUser.cart[indexItem][2]) + parseInt(quantity);
 }
 else{
 currentUser.cart.push(arr);
 }

 //Resave to local storage
 localStorage.setItem(localStorage.getItem("currentUser"),JSON.stringify(currentUser));

 //Confirm item was added to cart
 alert(quantity + " unit(s) of " + itemName.toLowerCase() + " was added to your cart.");

}


function loadCart(){

  //Get cart from local storage

  let currentUser = JSON.parse(localStorage.getItem(localStorage.getItem('currentUser')));

  let cart = currentUser.cart;

  //Create array of totals 
  let totals = [];


  //Print out the cart items

  for (let i =0; i<cart.length;i++){
    //Create elements post in the body

    //Div for each row
    let newDiv = document.createElement('div');
    newDiv.classList.add('cartDisplay');

    //Displays name, pric,e and quantity
    let desciptionDiv  = document.createElement('div');
    desciptionDiv.classList.add('itemDescription');

    //Append img first
    let img = document.createElement('img');
    img.classList.add('imgs');
    img.src = cart[i][0];
    newDiv.append(img);

    let newItemH4 = document.createElement('h4');

    let newQandPH4 = document.createElement('h4');
   

    for(let j = 1; j<cart[i].length;j++){


      if (j == 1){
        newItemH4 = document.createElement('h4');
        newItemH4.innerHTML = cart[i][j];

      }
      else if (j == 2){
        newQandPH4.innerHTML = "Quantity: " +cart[i][j];
        

      }
      else if (j==3){
        let price = cart[i][j-1] * cart[i][j];
        newQandPH4.innerHTML += "     Price: $" + price.toFixed(2);
        totals[i] = price;
      }

    }
    
       //Append to div 
        desciptionDiv.append(newItemH4);
        desciptionDiv.append(newQandPH4);

     //Append to div
     newDiv.append(desciptionDiv);

    //Add a button to delete the item 
    let deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('add');
    deleteButton.textContent = 'Delete';


    

    //Create delete action event 
    deleteButton.onclick = function(){
      deleteItem(i);
    }


    //Append button to div
    newDiv.append(deleteButton);

    //Append div to the page 
    document.getElementById('cartPosts').append(newDiv);



  }



  //After printing calcaulte subtotal
  let subtotal = 0;

  for (let k = 0; k<totals.length;k++){
    subtotal += totals[k];
  }

  let HST = 0.13 * subtotal;

  let finalTotal = subtotal + HST;

  //Display on webpage

  let totalDiv = document.createElement('div');
  totalDiv.classList.add('styleTotal');
  let totalH4 = document.createElement('h4');
  totalH4.innerHTML = "Subtotal: $" + subtotal.toFixed(2) + "<br><br>" +"HST Tax: $" + HST.toFixed(2) + "<br><br>" + "Total: $" +finalTotal.toFixed(2);

  totalDiv.append(totalH4);

  document.getElementById('cartPosts').append(totalDiv);


}


function deleteItem(num){
  
  //Load cart from current user

  let currentUser = JSON.parse(localStorage.getItem(localStorage.getItem("currentUser")));

  //remove the item
  currentUser.cart.splice(num,1);


  //Resave currentuser's cart

  localStorage.setItem(localStorage.getItem('currentUser'),JSON.stringify(currentUser));

  //Clear page 

  let page = document.getElementById('cartPosts');
  cartPosts.innerHTML = '';
  //Reload the page 

  loadCart();
}


function itemNames(){

  //Get the current user
  let currentUser = JSON.parse(localStorage.getItem(localStorage.getItem("currentUser")));
  let cart = currentUser.cart;
  let namesArr = [];

  //Store all the names of the product 
  for (let i = 0; i < cart.length; i++){
    namesArr[i] = cart[i][1];
    
  }
  return namesArr;
}


function confirmCart(){

  //Get cart to see if empty
  let currentUser = JSON.parse(localStorage.getItem(localStorage.getItem("currentUser")));


  //Error check 
  let address =  document.getElementById('address').value;
  let payment = document.getElementById('payment').value;

  if ([address,payment].includes('')){
    alert("Please fill out all form inputs");
    return;
  }


  //Save new address and payment method to current user
  currentUser.address = address;
  currentUser.payment = payment;


  //Empty cart 
  currentUser.cart = [];

  //Resave current user 
  localStorage.setItem(localStorage.getItem('currentUser'),JSON.stringify(currentUser));


  window.location.href = 'confirmation.html';
}

function messageConfirm(){

  let currentUser = JSON.parse(localStorage.getItem(localStorage.getItem("currentUser")));
  document.getElementById('customerInfo').innerHTML = 'We will arrive at ' + currentUser.address + ' soon. Please have your ' + currentUser.payment + " ready.";
  
}


function move(fileName){
  window.location.href = fileName;
  }


  function loadAddress(){
     //Load current address to the input box 
     let currentUser = JSON.parse(localStorage.getItem(localStorage.getItem("currentUser")));
  document.getElementById('address').value = currentUser.address || '';
  }


  function emptyCart(){

    let currentUser = JSON.parse(localStorage.getItem(localStorage.getItem("currentUser")));

  if (currentUser.cart.length == 0){
    alert("No items in cart to checkout. Please select items at the catalogue page ");
    window.location.href = 'products.html';
    return;
  }

  window.location.href = 'checkout.html';
  }







  // for (let i =0; i<cart.length;i++){
  //   //Create elements post in the body
  //   let newDiv = document.createElement('div');
  //   newDiv.classList.add('cartDisplay');
  //   let newH4 = document.createElement('h4');
  //   newH4.classList.add('itemDescription');

  //   //Append img first
  //   let img = document.createElement('img');
  //   img.classList.add('imgs');
  //   img.src = cart[i][0];
  //   newDiv.append(img);

  //   for(let j = 1; j<cart[i].length;j++){


  //     if (j == 2){
  //       newH4.innerHTML += "Quantity: " +cart[i][j] + " ";
  //     }
  //     else if (j==3){
  //       let price = cart[i][j-1] * cart[i][j];
  //       newH4.innerHTML += "$" + price.toFixed(2);
  //       totals[i] = price;
  //     }
  //     else{
  //       newH4.innerHTML += cart[i][j] + " ";
  //     }

  //   }
    
  //    //Append to div
  //    newDiv.append(newH4);

  //   //Add a button

  //   let deleteButton = document.createElement('button');
  //   deleteButton.classList.add('.add');
  //   deleteButton.textContent = 'Delete';


  //   deleteButton.type = 'button';

  //   deleteButton.onclick = function(){
  //     deleteItem(i);
  //   }

  //   // deleteButton.classList.add('add');

  //   newDiv.append(deleteButton);

  //   document.getElementById('cartPosts').append(newDiv);



  // }