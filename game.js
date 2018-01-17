/*
AUTHOR: Sagar Poudel
*/

// Only triggers once the webpage is fully loaded
$(document).ready(function(){

  // Data structures to hold the data required throughout
  var removedTools;
  var tools;
  var mixedTools;

  $("#options").css("visibility", "hidden");
  
  // After the user presses the play button
  $("#play").on("mousedown",function(){

    $("#userForm").css("display", "none");
    $("#toolList").css("visibility", "visible");
    $("#countDown").css("visibility","visible");


    var numberOfItems = (document.getElementById("numberOfItems")).value;
    // User Form validation
    if(numberOfItems>20){
      alert("We only have 20 items in the shed");
      location.reload();
    }
    var time = (document.getElementById("time")).value;
    var itemsToRemove = (document.getElementById("itemsToRemove")).value;

    // Displays the timer
    $("#timer").html(time);
    // Creates the tools
    createTools(numberOfItems);
    countDown(time, numberOfItems,itemsToRemove);

  });

  // Once the user submits the answers
  $("#options #sub").mousedown(function(){
    score();
  });

});

/*
This function takes a numerical number and
creates the equal number of items. Specifically,
the src attribute associated with images. Random
tiles are created everytime. And, duplicate items area
avoided.
*/
function createTools(n){
  tools = [];

  var arr = [];
  while( arr.length < n )
  {
    var randomnumber = Math.ceil(Math.random()* n);
    if(arr.indexOf(randomnumber) > -1) continue;
    arr[arr.length] = randomnumber;
  }

  for(var i = 0; i<arr.length; i++){
    tools.push("./tools/tool"+(arr[i])+".JPG.jpg");
    $("#toolList").append(` <div class = "col-lg-3 col-md-4 col-xs-6">  <img class = "tiles" id = ${arr[i]}  src = ${tools[i]} />  </div>`)
  }
  return tools;
}

/*
This is a simple function that helps hide a element
for a specified amount of time.
*/
function hideElem(time){
  setTimeout(function(){
    $("#toolList").css("visibility", "hidden");
  }, time*1000);
}

/*
This function takes three parameters and creates
a count down. After the counter is at zero,
the options are displayed.
*/
function countDown(time, a, b){
  var timer = setInterval(function(){
    $("#timer").html(time);
    time--;
    if(time<0){
      $("#timer").html("GOOD LUCK");
      var remArr = removeTools(jumble(a,b));
      clearInterval(timer);
      showOptions(remArr);
    }
  }, 1000);
}

/*
This method helps randomize the tiles
*/
function jumble(totalTiles, toRemove)
{
  var arr = [];
  while( arr.length < toRemove )
  {
    var randomnumber = Math.ceil(Math.random()* totalTiles);
    if(arr.indexOf(randomnumber) > -1) continue;
    arr[arr.length] = randomnumber;
  }
  return arr;
}

// This method removes items from the inventory
function removeTools(arr){
  removedTools = [];
  for(var i = 0; i<arr.length; i++){
    var re =  $(`#${arr[i]}`).remove();
    removedTools.push("./tools/tool"+arr[i]+".JPG.jpg");
  }
  console.log(removedTools);
  return removedTools;
}

// This method shows the options from which the players can choose from
function jumbleOptions(){
  var options = [];
  for(var i = 0; i<removedTools.length; i++){
    options.push(removedTools[i]);
  }
  for(var i = 0; i<tools.length; i++){
    var current = tools[i];
    if(options.indexOf(current)>-1) continue;
    options.push(current);
  }
  for(var i =0; i<options.length; i++){

    var img = $("#optionsHere").append(`<div class = "col-lg-3 col-md-4 col-xs-6"> <input type = "checkbox" id = cb${i+1} > <img class = "tiles"  id = ${i+1} src = ${options[i]} /> </input> </div>`);
  }
  console.log(options);
  return options;
}

// This displays the options and hides others
function showOptions(){
  setTimeout(function(){
    $("#options").css("visibility", "visible");
    $("#toolList").css("display", "none");
    $("#countDown").css("display", "none");
    $("userForm").css("display", "none");

    jumbleOptions();

    $("#sub").css("visibility", "visible");

  }, 3000);
}

/*
This method checks the user's response and assigns them
certain points. Also, provides feedback. Each corrent
selection is rewarded with 10 points
*/
function score(){
  $("#options").css("visibility", "hidden");
  var points = 0;
  for(var i = 0; i<removedTools.length;i++){
    if(document.getElementById(`cb${i+1}`).checked === true){
      points+=10;
    }
  }
  //Making appropriate feedback via alerts
  var msg = "You scored "+points+ " / " + 10*((document.getElementById("itemsToRemove")).value)+" points";
  if(points == 10*((document.getElementById("itemsToRemove")).value)){
    msg+="\n Well Done! You got it all correct!";
  }
  else if(points <10*((document.getElementById("itemsToRemove")).value)){
    msg+= "\n Please Click CANCEL on the next page to review the items removed.";
  }
  alert(msg);

  // Asks user if they want to play again and acts accordingly
  var r = confirm("Play again?");
  if(r==true){
    $("#sub").css("visibility", "hidden");
    location.reload();
  }
  else{
    $("#gamePlay").css("display", "none");
    $("#thanks #send_off").html("Thanks for Playing. Please come again! <br /> <br /> The Removed Items Were: <br />");
    for(var i = 0; i<removedTools.length; i++){
      $("#thanks #send_off").append(` <div class = "col-lg-3 col-md-4 col-xs-6">  <img class = "tiles" id = ${i+1} src = ${removedTools[i]} />  </div>`)
    }
  }
}
