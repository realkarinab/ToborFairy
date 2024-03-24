//alert("wazup");
const img = document.createElement('img');
img.style.zIndex = '999999';
img.style.left = "50px";
img.style.bottom = "40px";  
img.style.position = 'absolute';
img.alt = " ݁₊ ⊹ . ݁ToborFairy. ݁₊ ⊹";
img.style.width = "150px";
img.src = chrome.runtime.getURL('toborFairyBlink.gif');
document.body.appendChild(img);

chrome.runtime.onMessage.addListener(function(request, sender, sendresponse) {
  console.log(request);
  moveToDayHour(request.day, request.hour);
});

// Function to move the image towards the specified coordinates
function moveImage(image, targetX, targetY) {
    console.log("move function called :>");
    const start = performance.now();
    const duration = 1000; // Animation duration in milliseconds
  
    function move(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const deltaX = targetX - image.offsetLeft;
      const deltaY = targetY - image.offsetTop;
      const newX = image.offsetLeft + deltaX * progress;
      const newY = image.offsetTop + deltaY * progress;
      image.style.left = newX + 'px';
      image.style.top = newY + 'px';
      if (progress < 1) {
        requestAnimationFrame(move);
      }
    }
  
    requestAnimationFrame(move);
}


function moveToDayHour(day, hour) {
  var dayNum = day;
  var hourNum = hour;
  var dayDiv = document.querySelectorAll(".QIYAPb")[dayNum];
  var window2 = document.querySelector('[jsname="QbbJ2c"]');
  dayDiv.classList.add("highlighted_div");
  window2.scrollTo(0, dayDiv.clientHeight - window2.clientHeight);
  console.log("height of div:" + dayDiv.clientHeight + ", " + dayDiv.offsetHeight);
  console.log(window2.clientHeight);
  console.log("boundingClientRect: " + dayDiv.getBoundingClientRect().left);
  var x = dayDiv.getBoundingClientRect().left;
  var y = dayDiv.clientHeight * (hourNum/24) - window2.scrollY + window2.getBoundingClientRect().top;
  console.log(dayDiv.clientHeight * (hourNum/24) - window2.scrollY);
  if (y > window2.clientHeight - 15) {
    y = window2.clientHeight - 15;
  }
  const mouseX = x - 30;
  const mouseY = y - 65;
  moveImage(img, mouseX, mouseY);
}
// window2.scrollTo(0, dayDiv.clientHeight - window2.clientHeight);
// window2.scrollBy(0, dayDiv.clientHeight - window2.clientHeight);