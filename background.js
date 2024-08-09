chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Metadata:', message);
    // Additional processing or storing of data can be implemented here
});

chrome.runtime.onMessage.addListener(
    (message)=>{

        console.log("Schema: ", extract_schema(message))
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
        contentHeadings: message.headings || SCHEMA.contentHeadings,
        selectedText: message.selectedText || SCHEMA.selectedText,
        typedKeys: message.typedText || SCHEMA.typedKeys,
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