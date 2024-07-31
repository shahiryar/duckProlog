(function() {
    let activeTime = 0;
    let lastActivity = Date.now();
    let timer;
    let maxScrollDepth = 0;
    let clickCount = 0;
  
    const visitTimestamp = new Date().toISOString();
    const userAgent = navigator.userAgent;
    const referrer = document.referrer;
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    const viewportSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    const networkType = navigator.connection.effectiveType || 'unknown';
    const cookies = document.cookie;
  
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
      const metadata = {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') || 'No description',
        url: window.location.href,
        visitTimestamp,
        userAgent,
        referrer,
        loadTime,
        activeTime, // time in seconds
        maxScrollDepth,
        clickCount,
        viewportSize,
        networkType,
        cookies,
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
  
    window.addEventListener('focus', () => {
      lastActivity = Date.now();
    });
  
    window.addEventListener('blur', () => {
      logAndSendData();
    });
  
    window.addEventListener('load', startTimer);
    window.addEventListener('beforeunload', () => {
      logAndSendData();
      resetTimer();
    });
  })();
  