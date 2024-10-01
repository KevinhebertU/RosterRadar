function getPercentClass(percentage) {
    if (percentage <= 10) return 'percent-10';
    if (percentage <= 20) return 'percent-20';
    if (percentage <= 30) return 'percent-30';
    if (percentage <= 40) return 'percent-40';
    if (percentage <= 50) return 'percent-50';
    if (percentage <= 60) return 'percent-60';
    if (percentage <= 70) return 'percent-70';
    if (percentage <= 80) return 'percent-80';
    if (percentage <= 90) return 'percent-90';
    return 'percent-100';
}

function populateLines(response) {
    const parser = new DOMParser();
    let teamList = response.teamList;
    let moneypuckHTML = response.moneypuckData;
    const moneypuckDoc = parser.parseFromString(moneypuckHTML, "text/html");

    const rows = moneypuckDoc.querySelectorAll("table tr");

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");

        if (cells.length === 5) {
            const winningOdds1 = cells[0].querySelector("h2")?.textContent.trim() || 'Odds not found';
            const rawTeamName1 = cells[1].querySelector("img")?.alt || 'team-1-name-not-found';
            const teamName1 = rawTeamName1.toLowerCase().replace(/\./g, '').replace(/ /g, '-');

            const winningOdds2 = cells[4].querySelector("h2")?.textContent.trim() || 'Odds not found';
            const rawTeamName2 = cells[3].querySelector("img")?.alt || 'team-2-name-not-found';
            const teamName2 = rawTeamName2.toLowerCase().replace(/\./g, '').replace(/ /g, '-');

            // console.log('Team 1:', teamName1, 'Odds:', winningOdds1);
            // console.log('Team 2:', teamName2, 'Odds:', winningOdds2);

            if (teamList[teamName1]) {
                teamList[teamName1].winningOdds = winningOdds1;
            }
            if (teamList[teamName2]) {
                teamList[teamName2].winningOdds = winningOdds2;
            }
        }
    });

    // console.log(teamList);

    for (const teamKey in teamList) {
        if (teamList.hasOwnProperty(teamKey)) {
            const team = teamList[teamKey];
            if (!team.htmlRaw) continue;  // Skip if htmlRaw is not set

            let doc = parser.parseFromString(team.htmlRaw, 'text/html');
            let players = doc.querySelectorAll('span.text-xs.font-bold');
            team.players = {};  // Initialize the players object
            let count = 1;

            Array.prototype.forEach.call(players, function (player) {
                let playerName = player.innerText;
                if (playerName.includes('\u00fc')) {
                    playerName = playerName.replace(/\u00fc/g, 'u');
                    if (playerName === 'Tim Stutzle') {
                        playerName = 'Tim Stuetzle';
                    }
                }
                let splitPlayerName = playerName.split(' ');
                let lookupName;
                if (playerName.includes('.')) {
                    lookupName = playerName;
                } else if (splitPlayerName.length > 2) {
                    lookupName = splitPlayerName[0][0] + ". " + splitPlayerName[1] + " " + splitPlayerName[2];
                } else {
                    lookupName = splitPlayerName[0][0] + ". " + splitPlayerName[1];
                }
                lookupName = lookupName.toLowerCase();

                switch (count) {
                    case 1:
                    case 2:
                    case 3:
                        team.players[lookupName] = ["L1"];
                        if (team.players["Line1"] != null) {
                            team.players["Line1"].push(lookupName);
                        } else {
                            team.players["Line1"] = [lookupName];
                        }
                        break;
                    case 4:
                    case 5:
                    case 6:
                        team.players[lookupName] = ["L2"];
                        if (team.players["Line2"] != null) {
                            team.players["Line2"].push(lookupName);
                        } else {
                            team.players["Line2"] = [lookupName];
                        }
                        break;
                    case 7:
                    case 8:
                    case 9:
                        team.players[lookupName] = ["L3"]; // 3rd line
                        if (team.players["Line3"] != null) {
                            team.players["Line3"].push(lookupName); // Add player to line
                        } else {
                            team.players["Line3"] = [lookupName];
                        }
                        break;
                    case 10:
                    case 11:
                    case 12:
                        team.players[lookupName] = ["L4"]; // 4th Line
                        if (team.players["Line4"] != null) {
                            team.players["Line4"].push(lookupName); // Add player to line
                        } else {
                            team.players["Line4"] = [lookupName];
                        }
                        break;
                    case 13:
                    case 14:
                        team.players[lookupName] = ["D1"]; // 1st Pair D
                        if (team.players["Defence1"] != null) {
                            team.players["Defence1"].push(lookupName); // Add player to line
                        } else {
                            team.players["Defence1"] = [lookupName];
                        }
                        break;
                    case 15:
                    case 16:
                        team.players[lookupName] = ["D2"]; // 2nd Pair D
                        if (team.players["Defence2"] != null) {
                            team.players["Defence2"].push(lookupName); // Add player to line
                        } else {
                            team.players["Defence2"] = [lookupName];
                        }
                        break;
                    case 17:
                    case 18:
                        team.players[lookupName] = ["D3"]; // 3rd Pair D
                        if (team.players["Defence3"] != null) {
                            team.players["Defence3"].push(lookupName); // Add player to line
                        } else {
                            team.players["Defence3"] = [lookupName];
                        }
                        break;
                    case 19:
                    case 20:
                    case 21:
                    case 22:
                    case 23:
                        if (team.players[lookupName] != null) {
                            team.players[lookupName].push("PP1"); // 1st Powerplay Unit
                        } else {
                            team.players[lookupName] = ["PP1"];
                        }
                        if (team.players["Powerplay1"] != null) {
                            team.players["Powerplay1"].push(lookupName); // Add player to line
                        } else {
                            team.players["Powerplay1"] = [lookupName];
                        }
                        break;
                    case 24:
                    case 25:
                    case 26:
                    case 27:
                    case 28:
                        if (team.players[lookupName] != null) {
                            team.players[lookupName].push("PP2"); // 1st Powerplay Unit
                        } else {
                            team.players[lookupName] = ["PP2"];
                        }
                        if (team.players["Powerplay2"] != null) {
                            team.players["Powerplay2"].push(lookupName); // Add player to line
                        } else {
                            team.players["Powerplay2"] = [lookupName];
                        }
                        break;
                    case 37:
                        team.players[lookupName] = ["G1"]; // Goalie 1
                        break;
                    case 38:
                        team.players[lookupName] = ["G2"]; // Goalie 2
                        break;
                    default:
                        if (team.players[lookupName] == null) {
                            team.players[lookupName] = ["OUT"];
                        }
                        break;
                }
                count += 1;
            });
        }
    }
    return teamList;
}

function runContentScript(force = false) {
    chrome.runtime.sendMessage({ type: 'fetch', force }, response => {
        // console.log(response)
        let listOfTeams = populateLines(response);
        let kkupfldata = response.kkupfldata;
        // read the json data from the kkupflData
        let playersData = kkupfldata.Players;

        let colour = response.colour;
        let elements = document.querySelectorAll('a[href^="https://sports.yahoo.com/nhl/players"]'); // Player elements on Yahoo page
        document.querySelectorAll('.main-container').forEach(e => e.remove()); // Remove old Icons
        elements.forEach((element) => {
            const urlPattern = /^https:\/\/sports\.yahoo\.com\/nhl\/players\/\d+$/;
            if (urlPattern.test(element.href)) {
                // console.log(element);
                // let re = RegExp(/[A-z]{2,3} - (C|F|W|LW|RW|D|G)/).test(element.innerHTML); // Team Name and Position e.g. Car - LW,RW
                let parent = element.parentNode; // Div container for the player name and team name/position elements
                
                let playerNameElement = parent.querySelector('.ysf-player-name .name');
                let playerCityPositionElement = parent.querySelector('.ysf-player-name .Fz-xxs');
                // If not found, try the second structure
                if (!playerNameElement) {
                    playerNameElement = parent.querySelector('.Pbot-xs a[target="sports"]');
                    playerCityPositionElement = parent.querySelector('.Pbot-xs .F-position');
                }
                // If not found, try the third structure
                if (!playerNameElement) {
                    playerNameElement = parent.querySelector('.ysf-player-name .playernote');
                    playerCityPositionElement = parent.querySelector('.ysf-player-name .Fz-xxs');
                }
                // Extract the text content
                const playerName = playerNameElement ? playerNameElement.textContent.trim() : '';
                const playerCityPosition = playerCityPositionElement ? playerCityPositionElement.textContent.trim() : '';

                let teamName = playerCityPosition.split(' ')[0]; // Tor, Mtl, Van
                let splitPlayerName = playerName.split(' ') // Sidney Crosby -> ['Sidney', 'Crosby']
                let lookupName;
                if (playerName.includes('.')) { // T.J. Oshie or J.T. Miller
                    lookupName = playerName;
                } else if (splitPlayerName.length > 2) { // James van Reimsdyk -> J. van Reimsdyk
                    lookupName = splitPlayerName[0][0] + ". " + splitPlayerName[1] + " " + splitPlayerName[2];
                } else {
                    lookupName = splitPlayerName[0][0] + ". " + splitPlayerName[1]; // William Nylander -> W. Nylander
                }
                for (const team in listOfTeams) {
                    if (`${listOfTeams[team].abr}` === teamName) {
                        let mainContainer = document.createElement("div");
                        mainContainer.className = "main-container";
                        if (lookupName.toLowerCase() in listOfTeams[team].players) {
                            //check if the player is in the KKUPFLdata2
                            if (playersData) {
                                let playerEntry = Object.values(playersData).find(player => player.name === playerName);
                                if (playerEntry) {
                                    let percentRostered = playerEntry.Percent;
                                    if (percentRostered) {

                                        //add another div with the KKUPFL rostered percent
                                        let rosteredPercentDiv = document.createElement("div");
                                        rosteredPercentDiv.className = "position-box";
                                        let percentage = percentRostered
                                        if (colour) {
                                            rosteredPercentDiv.id = getPercentClass(percentage);
                                        } else {
                                            rosteredPercentDiv.id = "NOCOLOUR";
                                        }
                                        rosteredPercentDiv.innerText = percentage + "%";
                                        mainContainer.appendChild(rosteredPercentDiv);
                                    }
                                }
                            }

                            for (const lineupPosition of listOfTeams[team].players[lookupName.toLowerCase()]) { // Loop through Positions e.g. L1, PP1
                                let lineupPositionDiv = document.createElement("div");
                                lineupPositionDiv.className = "position-box";
                                if (colour) {
                                    lineupPositionDiv.id = lineupPosition;
                                } else {
                                    lineupPositionDiv.id = "NOCOLOUR";
                                }
                                lineupPositionDiv.innerText = lineupPosition;
                                mainContainer.appendChild(lineupPositionDiv);
                                if (listOfTeams[team].winningOdds && (lineupPosition === 'G1' || lineupPosition === 'G2')) {
                                    let moneypuckDiv = document.createElement("div");
                                    moneypuckDiv.className = "position-box";
                                    if (colour) {
                                        moneypuckDiv.id = 'ODDS';
                                    } else {
                                        moneypuckDiv.id = "NOCOLOUR";
                                    }
                                    moneypuckDiv.innerText = listOfTeams[team].winningOdds;
                                    mainContainer.appendChild(moneypuckDiv);
                                }
                            }
                        } else { // Player was not found in the lineups
                            if (playersData) {
                                let playerEntry = Object.values(playersData).find(player => player.name === playerName);
                                if (playerEntry) {
                                    let percentRostered = playerEntry.Percent;
                                    if (percentRostered) {

                                        //add another div with the KKUPFL rostered percent
                                        let rosteredPercentDiv = document.createElement("div");
                                        rosteredPercentDiv.className = "position-box";
                                        let percentage = percentRostered
                                        if (colour) {
                                            rosteredPercentDiv.id = getPercentClass(percentage);
                                        } else {
                                            rosteredPercentDiv.id = "NOCOLOUR";
                                        }
                                        rosteredPercentDiv.innerText = percentage + "%";
                                        mainContainer.appendChild(rosteredPercentDiv);
                                    }
                                }
                            }
                            let lineupPositionDiv = document.createElement("div");
                            lineupPositionDiv.className = "position-box";
                            if (colour) {
                                lineupPositionDiv.id = "NA";
                            } else {
                                lineupPositionDiv.id = "NOCOLOUR";
                            }
                            lineupPositionDiv.innerText = "N/A";
                            mainContainer.appendChild(lineupPositionDiv);
                            //add ano

                        }
                        parent.appendChild(mainContainer);
                    }
                }
            }
        });
    });
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "GET_REQUEST_MADE") {
        runContentScript();
    }
    if (message.action === "CHANGE_COLOUR") {
        console.log('Lineup colour change requested');
        runContentScript();
    }
    if (message.action === "FORCE_UPDATE_LINES") {
        console.log('Manual line update requested');
        runContentScript(true);
    }
});

runContentScript();