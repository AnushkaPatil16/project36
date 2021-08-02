var dag,sadDog,happyDog,database;
var foodS,foodStock;

var addFoods;
var foodObj;

//create feed and lastfeed variable here
var feed,lastFed;

function preload(){
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");

}


function setup(){
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new FOOD();

  foodStock = database.ref('Food');
  foodStock.on('value', readStock);

  dog = createSprite(800,200,150,150);
  dog.addImage(sadDog)
  dog.scale = 0.15;

  //create feed the dog buttom here
  addFood = createButton("Add Food")
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  feed = createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  
 
}


function draw(){
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value formthe database
  fedTime = database.ref('FeedTime');
  fedTime.on('value' ,function(data){
    lastFed = data.val();
  }) 

  //write code to display text lastfed time here
  fill(255,255,255);

  if(lastFed>=12){
    text("Last Feed: " + lastFed%12 +" PM",350,30);
  }else if(lastFed == 0){
    text("Last Feed: 12 AM",350,30);
  }else{
    text("Last Feed: " + lastFed + "AM" ,350,30);
  }

  drawSprites();

}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food Stock and last feed time
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <=0){
    foodObj.updateFoodStock(food_stock_val * 0)
  }else{
    foodObj.updateFoodStock(food_stock_val -1);
  }  

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
     FeedTime:hour()
  })
}

function addFood(){
  foodS++
  database.ref('/').update({
    Food:foodS
  })
}