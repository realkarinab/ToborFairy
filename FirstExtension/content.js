
//alert("wazup");
const img = document.createElement('img');
img.style.zIndex = '99999';
img.style.left = "50px";
img.style.top = "-200px";  
img.style.position = 'absolute';
img.alt = " ݁₊ ⊹ . ݁ToborFairy. ݁₊ ⊹";
img.style.width = "150px";
img.src = chrome.runtime.getURL('toborFairyBlink.gif');
document.body.appendChild(img);
let state = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// Listen for clicks and move the image towards the click coordinates
document.addEventListener("click", function(event) {
    console.log("hey!!!!!!!!!!!!!!");

    console.log((event.clientX - 16) + 'px');
    console.log((event.clientY - 16) + 'px');

  const mouseX = event.clientX -50;
  const mouseY = event.clientY -50;

  const bubble = document.createElement('img');
  const txt = document.createElement('img');
  //move towards mouse
  if (state == 0) {
    moveImage(img, mouseX, mouseY);

    sleep(1000).then(() => { 
        bubble.style.zindex = '999999999';
        bubble.style.left = (mouseX - 160) + "px";
        bubble.style.top = (mouseY + 30) +"px";  
        bubble.style.position = 'absolute';
        bubble.style.width = "190px";

        bubble.style.opacity = 1;

        bubble.src = chrome.runtime.getURL('Rectangle73.png');
        document.body.appendChild(bubble);
    
        txt.style.zindex = '9999999999';
        txt.style.left = (mouseX - 150) + "px";
        txt.style.top = (mouseY + 40) +"px";  
        txt.style.position = 'absolute';
        txt.style.width = "170px";
        txt.src = chrome.runtime.getURL('textBubble1.png');
        
        txt.style.opacity = 1;
        
        document.body.appendChild(txt);
    
        console.log("generated text?");

        sleep(10000).then(() => { 
            bubble.style.opacity = 0;
            txt.style.opacity = 0;
        });

        state = 1;
    });

  }
  //fly up out of screen
  else if (state == 1) {
    moveImage(img, 10, -200);

    state = 0;
  }
});

// Function to move the image towards the specified coordinates
function moveImage(image, targetX, targetY) {
    console.log("move function called :>");
    const start = performance.now();
    const duration = 3300; // Animation duration in milliseconds
  
    function easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function move(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easeInOut(progress);

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

    //generate new img here at the location of the mouse
    //to imitate a speech bubble


  }