document.addEventListener('DOMContentLoaded', () => {
    const activityTimeoutInput = document.getElementById('activityTimeout');
    const sendIntervalInput = document.getElementById('sendInterval');
    const saveButton = document.getElementById('saveSettings');
    const downloadButton = document.getElementById('downloadCsv'); // New download button
    
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

    // Download data as CSV
    downloadButton.addEventListener('click', () => {
        // Assuming your data is stored in chrome.storage.local with key 'csvData'
        chrome.storage.local.get(['csvData'], (result) => {
            const csvData = result.csvData || '';

            // If there's no data, alert the user
            if (!csvData) {
                alert('No data available for download.');
                return;
            }

            // Create a Blob with the CSV data
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);

            // Create a download link and trigger it
            const link = document.createElement('a');
            link.href = url;
            link.download = 'data.csv';
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    });
});
