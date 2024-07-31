(function() {
    let activeTime = 0;
    let lastActivity = Date.now();
    let timer;
    let maxScrollDepth = 0;
    let clickCount = 0;
    let keyPressCount = 0;
    let focusStart = Date.now();
    let currentTab = window.location.href;
    let appUsage = {}; // Store app usage data if possible
    let idleStart = Date.now();
    let userAgent = navigator.userAgent;
    let referrer = document.referrer;
    let loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    let viewportSize = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    let networkType = navigator.connection.effectiveType || 'unknown';
    let cookies = document.cookie;
    let headings = [];

    function getHeadings() {
        const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        headings = headingTags.flatMap(tag => 
            Array.from(document.querySelectorAll(tag)).map(element => ({
                tag: tag,
                text: element.innerText
            }))
        );
    }

    function startTimer() {
        timer = setInterval(() => {
            if (document.hasFocus() && (Date.now() - lastActivity < 5000)) { // consider active if focused and mouse moved within last 5 seconds
                activeTime += 1; // increment active time by 1 second
            }
        }, 1000); // check every second
    }

    function resetTimer() {
        clearInterval(timer);
        activeTime = 0;
    }

    function logAndSendData() {
        getHeadings(); // Collect headings before logging data
        const metadata = {
            title: document.title,
            description: document.querySelector('meta[name="description"]')?.getAttribute('content') || 'No description',
            url: window.location.href,
            visitTimestamp: new Date().toISOString(),
            userAgent,
            referrer,
            loadTime,
            activeTime, // time in seconds
            maxScrollDepth,
            clickCount,
            keyPressCount,
            viewportSize,
            networkType,
            cookies,
            currentTab,
            appUsage, // if tracking app usage
            idleTime: Math.max(0, Date.now() - idleStart) / 1000, // idle time in seconds
            focusDuration: Math.max(0, Date.now() - focusStart) / 1000, // focus duration in seconds
            headings, // Include headings
            timestamp: new Date().toISOString()
        };
        chrome.runtime.sendMessage(metadata);
    }

    document.addEventListener('mousemove', () => {
        lastActivity = Date.now();
    });

    document.addEventListener('scroll', () => {
        maxScrollDepth = Math.max(maxScrollDepth, window.scrollY + window.innerHeight);
    });

    document.addEventListener('click', () => {
        clickCount += 1;
    });

    document.addEventListener('keypress', () => {
        keyPressCount += 1;
    });

    window.addEventListener('focus', () => {
        lastActivity = Date.now();
        focusStart = Date.now(); // Start focus timer
        idleStart = Date.now(); // Reset idle timer
    });

    window.addEventListener('blur', () => {
        logAndSendData();
    });

    window.addEventListener('load', () => {
        startTimer();
        getHeadings(); // Collect headings when the page loads
    });
    
    window.addEventListener('beforeunload', () => {
        logAndSendData();
        resetTimer();
    });
})();
