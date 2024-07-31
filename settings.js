document.addEventListener('DOMContentLoaded', () => {
    const activityTimeoutInput = document.getElementById('activityTimeout');
    const sendIntervalInput = document.getElementById('sendInterval');
    const saveButton = document.getElementById('saveSettings');
    
    // Load settings
    chrome.storage.sync.get(['activityTimeout', 'sendInterval'], (items) => {
        activityTimeoutInput.value = items.activityTimeout || 5; // Default value
        sendIntervalInput.value = items.sendInterval || 1; // Default value
    });
    
    // Save settings
    saveButton.addEventListener('click', () => {
        const activityTimeout = parseInt(activityTimeoutInput.value, 10);
        const sendInterval = parseInt(sendIntervalInput.value, 10);
        
        chrome.storage.sync.set({ activityTimeout, sendInterval }, () => {
            alert('Settings saved!');
        });
    });
});
