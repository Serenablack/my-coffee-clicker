/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // your code here
  document.querySelector("#coffee_counter").innerText = coffeeQty;
}

function clickCoffee(data) {
  // your code here
  data.coffee += 1; //why data?is it because  the same has been used in the
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  for (let i = 0; i < producers.length; i++) {
    if (coffeeCount >= 0.5 * producers[i].price) {
      producers[i].unlocked = true;
    } else producers[i].unlocked;
    // producers.forEach(producer => {
    //   if (producer.price / 2 <= coffeeCount) producer.unlocked = true;
    // });
  }
}

function getUnlockedProducers(data) {
  // your code here
  return data.producers.filter((pro) => pro.unlocked === true);
}

function makeDisplayNameFromId(id) {
  // your code here
  let str = "";
  str = str.concat(id[0].toUpperCase());

  for (let i = 1; i < id.length; i++) {
    if (id[i] !== "_") {
      str = str.concat(id[i]);
    } else {
      str = str.concat(" ");
      continue;
    }
    if (id[i - 1] === "_") {
      str = str.slice(0, str.length - 1) + id[i].toUpperCase();
    }
  }
  id = str;
  return id;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  // your code here
  let cont = document.getElementById("producer_container");
  deleteAllChildNodes(cont);
  unlockProducers(data.producers, data.coffee);
  getUnlockedProducers(data).forEach((prod) => {
    cont.appendChild(makeProducerDiv(prod));
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  for (let i = 0; i < data.producers.length; i++) {
    if (data.producers[i].id === producerId) return data.producers[i];
  }
}

function canAffordProducer(data, producerId) {
  // your code here

  if (data.coffee >= getProducerById(data, producerId).price) return true;
  return false;
}

function updateCPSView(cps) {
  // your code here
  let cosPerSec = document.getElementById("cps");
  cosPerSec.innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  let prod;
  if (canAffordProducer(data, producerId)) {
    prod = getProducerById(data, producerId);
    prod.qty += 1;
    data.coffee -= prod.price;
    prod.price = updatePrice(prod.price);
    data.totalCPS += prod.cps;
    return true;
  } else return false;
}

function buyButtonClick(event, data) {
  // your code here
  let amount = getProducerById(data, event.target.id);
  if (canAffordProducer) {
    if (event.target.TagName === "BUTTON") {
      renderProducers(data);
      data.coffee -= amount.price;
      data.totalCPS += amount.cps;
    }
    // but.addEventListener("click",event)
    //
    else window.alert("Not enough coffee!");
  }
}

function tick(data) {
  // your code here
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
