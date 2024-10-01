chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Metadata:', message);
    // Additional processing or storing of data can be implemented here
});

chrome.runtime.onMessage.addListener(
    (message)=>{

        console.log("Schema: ", extract_schema(message))
        const data = extract_schema(message)

        appendToCSV(data, './data/logs.csv')
    }
);


const SCHEMA = {
    title: "",
    description: "",
    url: "",
    referer: "",

    contentHeadings: [],
    selectedText: [],
    typedkeys: [],
    visitTimestamp: "",
    clickCount: "",
    keyPressCount: 0,
    maxScrollDepth: 0,
    focusDuration: "",
    viewPortSize: {},
  

    userAgent: "",
    networkType: "",
    loadTime:0,

    cookies: "",
}

function extract_schema(message) {
    return {
        title: message.title || SCHEMA.title,
        description: message.description || SCHEMA.description,
        url: message.url || SCHEMA.url,
        referer: message.referrer || SCHEMA.referer,
        contentHeadings: JSON.stringify(message.headings) || SCHEMA.contentHeadings,
        selectedText: JSON.stringify(message.selectedText) || SCHEMA.selectedText,
        typedKeys: JSON.stringify(getTypedTextAsString(message.typedText)) || SCHEMA.typedKeys,
        visitTimestamp: message.visitTimestamp || SCHEMA.visitTimestamp,
        clickCount: message.clickCount || SCHEMA.clickCount,
        keyPressCount: message.keyPressCount || SCHEMA.keyPressCount,
        maxScrollDepth: message.maxScrollDepth || SCHEMA.maxScrollDepth,
        focusDuration: message.focusDuration || SCHEMA.focusDuration,
        viewPortSize: message.viewportSize || SCHEMA.viewPortSize,
        userAgent: message.userAgent || SCHEMA.userAgent,
        networkType: message.networkType || SCHEMA.networkType,
        loadTime: message.loadTime || SCHEMA.loadTime,
        cookies: message.cookies || SCHEMA.cookies,
    };
}

function appendToCSV(data) {
    // Convert the data object to a CSV format

    console.log(data)
    const keys = Object.keys(data);
    const values = keys.map(key => {
        if (Array.isArray(data[key])) {
            return `"${data[key].join(",")}"`; // Handle arrays by joining their values
        } else if (typeof data[key] === 'object' && data[key] !== null) {
            return `"${JSON.stringify(data[key])}"`; // Handle objects by converting them to JSON strings
        } else {
            return `"${data[key]}"`; // Handle primitive values
        }
    });


    console.log(values)

    // Construct a single line of CSV
    const csvLine = values.join(",") + "\n";

    // Read existing CSV data from chrome storage (or initialize)
    chrome.storage.local.get(['csvData'], function(result) {
        let csvData = result.csvData || "";
        
        // If this is the first entry, add the headers
        if (!csvData) {
            const headers = keys.join(",") + "\n";
            csvData += headers;
        }

        // Append the new line to the existing data
        csvData += csvLine;

        // Save updated CSV data back to chrome storage
        chrome.storage.local.set({ csvData: csvData }, function() {
            console.log('CSV data saved.');
        });
    });
}

function getTypedTextAsString(typedKeys) {
    return typedKeys.map(entry => entry.text).join('');
}
