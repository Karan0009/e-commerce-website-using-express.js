const txt = document.getElementById("para");
const enteredTxt = document.getElementById("enterTxt");
let s = txt.innerHTML;
let temp = s;
var changedString = "";
let randomIndex;
let doChange = true;
const randomChars = ["A", "B", "C", "D", "E", "F"];

function ChangeString() {
  const interval = setInterval(() => {
    //if(doChange){
    changedString = "";
    changedString = getRandomString();
    txt.innerHTML = changedString;
    console.log(txt.innerHTML);
    //}
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    txt.innerHTML = s;
  }, 500);
}

//   function getText() {
//     console.log(enterTxt.value);
//     s = enteredTxt.value;
//     txt.innerHTML = s;
//     console.log(s);
//     //alert(2);
//   }

function getRandomString() {
  var newString = "";
  for (i in s) {
    randomIndex = Math.floor(Math.random() * randomChars.length);
    //console.log(randomIndex);
    newString += randomChars[randomIndex];
  }
  return newString;
}
