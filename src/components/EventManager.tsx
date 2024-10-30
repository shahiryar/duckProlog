import { useEffect } from "react"

const EventManger = () => {
    useEffect(() => {
        let activeTime = 0;
        let lastActivity = Date.now();
        let timer: any;
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
        let networkType = (navigator as any)?.connection?.effectiveType || 'unknown';
        let cookies = document.cookie;
        let headings: any[] = [];
        let selectedText: any[] = [];
        let typedText: any[] = [];

        function getHeadings() {
            const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
            headings = headingTags.flatMap(tag => 
                Array.from(document.querySelectorAll(tag)).map(element => ({
                    tag: tag,
                    text: (element as HTMLElement).innerText
                }))
            );
        }

        function getSelectedText() {
            const selection = window.getSelection();
            if (selection?.toString().trim()) {
                selectedText.push({
                    text: selection.toString(),
                    timestamp: new Date().toISOString()
                });
            }
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
            getSelectedText(); // Collect selected text
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
                selectedText, // Include selected text
                typedText, // Include typed text
                timestamp: new Date().toISOString()
            };
            chrome.runtime.sendMessage(metadata);
        }

        const mouseMove = () => lastActivity = Date.now();
        document.addEventListener('mousemove', mouseMove);

        const onScroll = () => maxScrollDepth = Math.max(maxScrollDepth, window.scrollY + window.innerHeight);
        document.addEventListener('scroll', onScroll);

        const onClick = () => clickCount += 1;
        document.addEventListener('click', onClick);

        const onKeyPress = (event: KeyboardEvent) => {
            keyPressCount += 1;
            typedText.push({
                text: event.key,
                timestamp: new Date().toISOString()
            });
        }
        document.addEventListener('keypress', onKeyPress);

        document.addEventListener('mouseup', getSelectedText);

        const onFocus = () => {
            lastActivity = Date.now();
            focusStart = Date.now(); // Start focus timer
            idleStart = Date.now(); // Reset idle timer
        }
        window.addEventListener('focus', onFocus);

        window.addEventListener('blur', logAndSendData);

        const onLoad = () => {
            startTimer();
            getHeadings(); // Collect headings when the page loads
        }
        window.addEventListener('load', onLoad);
        
        const onBeforeUnload = () => {
            logAndSendData();
            resetTimer();
        }
        window.addEventListener('beforeunload', onBeforeUnload);

        return () => {
            document.removeEventListener("mousemove", mouseMove)
            document.removeEventListener("scroll", onScroll)
            document.removeEventListener("click", onClick)
            document.removeEventListener("keypress", onKeyPress)
            document.removeEventListener("mouseup", getSelectedText)
            window.removeEventListener("focus", onFocus)
            window.removeEventListener("blur", logAndSendData)
            window.removeEventListener("load", onLoad)
            window.removeEventListener("beforeunload", onBeforeUnload)
        }
    }, [])
    
    return <></>
}

export default EventManger
