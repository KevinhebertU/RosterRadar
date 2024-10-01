chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {
    chrome.storage.local.get(['teamListCache', 'moneypuckCache','kkupflCache', 'coloursOn', 'lastFetchTime'], function (result) {
        if (message.from === 'popupChangeColour') {
            chrome.tabs.query({ url: "https://hockey.fantasysports.yahoo.com/*" }, function (tabs) {
                // Iterate through all tabs that match the specified URL pattern
                tabs.forEach(function (tab) {
                    // Send a message to each matching tab
                    chrome.tabs.sendMessage(tab.id, { action: "CHANGE_COLOUR" });
                });
            });
            senderResponse({ acknowledged: true });
        } else if (message.from === 'popupUpdateLines') {
            chrome.tabs.query({ url: "https://hockey.fantasysports.yahoo.com/*" }, function (tabs) {
                // Iterate through all tabs that match the specified URL pattern
                tabs.forEach(function (tab) {
                    // Send a message to each matching tab
                    chrome.tabs.sendMessage(tab.id, { action: "FORCE_UPDATE_LINES" });
                });
            });
            senderResponse({ acknowledged: true });
        } else {
            const currentTime = Date.now();
            const force = message.force;
            // Check if data is older than one hour (3600000 milliseconds)
            if (!result.lastFetchTime) {
                // First Install
                chrome.storage.local.set({ 'coloursOn': true });
                fetchData(senderResponse);

            } else if (force || currentTime - result.lastFetchTime > 3600000) {
                fetchData(senderResponse);

            } else {
                // Send cached data
                senderResponse({ teamList: result.teamListCache, kkupfldata: result.kkupflCache, moneypuckData: result.moneypuckCache, colour: result.coloursOn });
            }
        }
    });
    return true; // indicates you want to send a response asynchronously
});

function fetchData(senderResponse) {
    console.log('fetch');
    let fetchPromises = [];

    let teamList = {
        "anaheim-ducks": {
            abr: "ANA",
        },
        "utah-hockey-club": {
            abr: "UTA",
        },
        "boston-bruins": {
            abr: "BOS",
        },
        "buffalo-sabres": {
            abr: "BUF",
        },
        "calgary-flames": {
            abr: "CGY",
        },
        "carolina-hurricanes": {
            abr: "CAR",
        },
        "chicago-blackhawks": {
            abr: "CHI",
        },
        "colorado-avalanche": {
            abr: "COL",
        },
        "columbus-blue-jackets": {
            abr: "CBJ",
        },
        "dallas-stars": {
            abr: "DAL",
        },
        "detroit-red-wings": {
            abr: "DET",
        },
        "edmonton-oilers": {
            abr: "EDM",
        },
        "florida-panthers": {
            abr: "FLA",
        },
        "los-angeles-kings": {
            abr: "LA",
        },
        "minnesota-wild": {
            abr: "MIN",
        },
        "montreal-canadiens": {
            abr: "MTL",
        },
        "nashville-predators": {
            abr: "NSH",
        },
        "new-jersey-devils": {
            abr: "NJ",
        },
        "new-york-islanders": {
            abr: "NYI",
        },
        "new-york-rangers": {
            abr: "NYR",
        },
        "ottawa-senators": {
            abr: "OTT",
        },
        "philadelphia-flyers": {
            abr: "PHI",
        },
        "pittsburgh-penguins": {
            abr: "PIT",
        },
        "san-jose-sharks": {
            abr: "SJ",
        },
        "st-louis-blues": {
            abr: "STL",
        },
        "tampa-bay-lightning": {
            abr: "TB",
        },
        "toronto-maple-leafs": {
            abr: "TOR",
        },
        "vancouver-canucks": {
            abr: "VAN",
        },
        "vegas-golden-knights": {
            abr: "VGK",
        },
        "washington-capitals": {
            abr: "WSH",
        },
        "winnipeg-jets": {
            abr: "WPG",
        },
        "seattle-kraken": {
            abr: "SEA",
        }
    };
    for (const team in teamList) {
        let url = "https://www.dailyfaceoff.com/teams/" + team + "/line-combinations/";
        let fetchPromise = fetch(url).then(response => response.text()).then(html => {
            teamList[team].htmlRaw = html;
        }).catch(err => {
            console.warn('Something went wrong with team ' + team, err);
            teamList[team].htmlRaw = null; // or some error indication
        });
        fetchPromises.push(fetchPromise);
    }




    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const moneypuckUrl = `https://www.moneypuck.com/moneypuck/dates/${year}${month}${day}.htm`;
    // const moneypuckUrl = `https://www.moneypuck.com/moneypuck/dates/20231024.htm`;
    let moneypuckPromise = fetch(moneypuckUrl)
        .then(response => response.text())
        .catch(error => {
            console.error('Error fetching Moneypuck data:', error);
            return null; // or some error indication
        });
    fetchPromises.push(moneypuckPromise);

// Get KKUPFL data
const kkupflUrl = `https://kkupfl-db-call.azurewebsites.net/api/KKUPFL_Percent_Rostered?code=rerrKeQJmQd55s9nR76E3hscoZTdT13e_2jn8RMVcTmlAzFu8AmAFw%3D%3D`; // Replace with the actual URL
let kkupflPromise = fetch(kkupflUrl,  { mode: 'no-cors' })
    .then(response => response.json())
    .catch(error => {
        console.error('Error fetching KKUPFL data:', error);
        return null; // or some error indication
    });
fetchPromises.push(kkupflPromise);


// Wait for all promises to resolve
Promise.all(fetchPromises).then((results) => {
    // The last promise in the array is for KKUPFL
    let kkupfldata = results.pop();
    // The last promise in the array is for Moneypuck
    let moneypuckData = results.pop();
    chrome.storage.local.set({ teamListCache: teamList, moneypuckCache: moneypuckData, kkupflCache: kkupfldata ,lastFetchTime: Date.now() });
    chrome.storage.local.get(['coloursOn'], function (result) {
        senderResponse({ teamList, moneypuckData, kkupfldata, colour: result.coloursOn });
    });
});
}

chrome.webRequest.onCompleted.addListener(
    (details) => {
        if (details.method === "GET") {
            // Define the regex pattern to match the URL format
            const pattern1 = /^https:\/\/hockey\.fantasysports\.yahoo\.com\/hockey\/[\w\/]+(\?.*&)?ajaxrequest=1$/;
            const pattern2 = /^https:\/\/hockey\.fantasysports\.yahoo\.com\/hockey\/(\d+)\/players\?.*(status|sort)=/;

            // Check if the URL matches the pattern
            if (pattern1.test(details.url) || pattern2.test(details.url)) {
                console.log(`GET request made to ${details.url} matches the pattern`);
                // Since the URL matches, send a message to the content script
                chrome.tabs.sendMessage(details.tabId, { action: "GET_REQUEST_MADE", url: details.url });
            }
        }
    },
    { urls: ["<all_urls>"] } // This ensures all URLs are captured for filtering
);