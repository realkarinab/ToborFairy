chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'moveImage') {
      chrome.tabs.sendMessage(sender.tab.id, {action: 'moveImage', coords: request.coords});
    }
  });