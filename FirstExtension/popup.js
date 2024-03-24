

// execute the turn on and off function based on click of the switch...
var catswitch = document.getElementById('switch');
catswitch.addEventListener("click", switchClicked);

function switchClicked() {
    alert("toggle clicked!");
    console.debug("something");
}
