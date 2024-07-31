chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Metadata:', message);
    // Additional processing or storing of data can be implemented here
});
