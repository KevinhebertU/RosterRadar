var line_enabled = true;
var pp_enabled = true;
var pk_enabled = true;
var games_enabled = true;
var off_nights_enabled = true;

chrome.storage.sync.get({ line_enabled: true }, function (data) {
  line_enabled = data.line_enabled;
});
chrome.storage.sync.get({ pp_enabled: true }, function (data) {
  pp_enabled = data.pp_enabled;
});
chrome.storage.sync.get({ pk_enabled: true }, function (data) {
  pk_enabled = data.pk_enabled;
});
chrome.storage.sync.get({ games_enabled: true }, function (data) {
  games_enabled = data.games_enabled;
});
chrome.storage.sync.get({ off_nights_enabled: true }, function (data) {
  off_nights_enabled = data.off_nights_enabled;
});

var players = {};
var PlayersKK = {};
var alt_players = {};
var games = {};
var off_days = {};

let background_colors = {
  L1: "green",
  D1: "green",
  G1: "green",
  L2: "#809E1B",
  D2: "#809E1B",
  G2: "#809E1B",
  L3: "#D1B94B",
  D3: "#D1B94B",
  G3: "#D1B94B",
  L4: "#FFD687",
  D4: "#FFD687",
  G4: "#FFD687",
};

// use a switch statement to get a color scale that goes form #008000 at 100% to #FF0000 at 0%
// based on the percent value
function getColor(percent) {
  switch (true) {
    case percent >= 90:
      return "#008000";
    case percent >= 80:
      return "#00A000";
    case percent >= 70:
      return "#00C000";
    case percent >= 60:
      return "#00E000";
    case percent >= 50:
      return "#00FF00";
    case percent >= 40:
      return "#E0E000";
    case percent >= 30:
      return "#C0C000";
    case percent >= 20:
      return "#A0A000";
    case percent >= 10:
      return "#800000";
    default:
      return "#FF0000";
  }
}

//create a list of players exception for players with different names on yahoo and source
 let players_exception = {
  	"Alexander Kerfoot": "Alex Kerfoot",
    "Jake Middleton": "Jacob Middleton",
    "Will Borgen": "William Borgen",
    "Tim Stutzle": "Tim St\u00fctzle",
    "Nicholas Paul": "Nick Paul",
    "Alexis Lafreniere": "Alexis Lafreni\u00e8re",

}




let team_map = {
  Anh: "Anaheim Ducks",
  Ari: "Arizona Coyotes",
  Bos: "Boston Bruins",
  Buf: "Buffalo Sabres",
  Cgy: "Calgary Flames",
  Car: "Carolina Hurricanes",
  Chi: "Chicago Blackhawks",
  Col: "Colorado Avalanche",
  Cls: "Columbus Blue Jackets",
  Dal: "Dallas Stars",
  Det: "Detroit Red Wings",
  Edm: "Edmonton Oilers",
  Fla: "Florida Panthers",
  LA: "Los Angeles Kings",
  Min: "Minnesota Wild",
  Mon: "Montréal Canadiens",
  Nsh: "Nashville Predators",
  NJ: "New Jersey Devils",
  NYI: "New York Islanders",
  NYR: "New York Rangers",
  Ott: "Ottawa Senators",
  Phi: "Philadelphia Flyers",
  Pit: "Pittsburgh Penguins",
  SJ: "San Jose Sharks",
  Sea: "Seattle Kraken",
  StL: "St. Louis Blues",
  TB: "Tampa Bay Lightning",
  Tor: "Toronto Maple Leafs",
  Van: "Vancouver Canucks",
  VGK: "Vegas Golden Knights",
  Was: "Washington Capitals",
  Wpg: "Winnipeg Jets",
};

let team_map2 = {
  Cls: "CBJ",
  LA: "LAK",
  Mon: "MTL",
  NJ: "NJD",
  SJ: "SJS",
  TB: "TBL",
  Was: "WSH",
};

function getAltPlayers() {
  for (const [key, value] of Object.entries(players)) {
    var s = key.split(" ");
    var alt_player = s[0][0] + ". " + s[1];
    alt_players[alt_player] = key;
  }
}

 /* function hideYahooPlus() {
   var teamAnalysis = document.getElementById("hybrid_entry_point");
   teamAnalysis.style.display = "none";
 } */

function getPlayers() {
  if (
    Object.keys(players).length == 0 ||
    Object.keys(PlayersKK).length == 0 ||
    Object.keys(games).length == 0 ||
    Object.keys(off_days).length == 0
  ) {
    return;
  }players
  PlayersKK
  var elementsInsideBody = [
    ...document.body.getElementsByClassName("ysf-player-name"),
  ];
  for (var i = 0; i < elementsInsideBody.length; i++) {
    var name = elementsInsideBody[i].childNodes[0].innerText;
    console.log(name)
    var pid = elementsInsideBody[i].childNodes[0].getAttribute("data-ys-playerid");
    console.log(pid)
    var team_name = elementsInsideBody[i].childNodes[1].innerText.split(" ")[0];
    if (name in alt_players) {
      name = alt_players[name];
    }
    if (name in players_exception) {
      name = players_exception[name];
    }
    var compressed_name = name.replace(/\s/g, "_");
    
    if (elementsInsideBody[i].id != compressed_name) {
      elementsInsideBody[i].id = compressed_name;
      console.log(compressed_name)
      console.log(name)
      var d = document.createElement("div");
        d.classList.add("leetsports");
      
        
        if (pid in PlayersKK) {
          console.log(pid +"in PlayersKK")
          var Percent_text = PlayersKK[pid]["Percent"]+"%";
          var Percent_text2 = PlayersKK[pid]["Percent"];
          var Percent = document.createElement("p");
          Percent.classList.add("leetsports");
          Percent.classList.add(compressed_name);
          Percent.innerText = Percent_text;
          var color = getColor(Percent_text2);
          if (color.length > 0) {
            Percent.style =
              "background-color: "+color+"; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
          }
          d.appendChild(Percent);
        }
        else {
          console.log(pid +"not in PlayersKK")
          var Percent_text = "0%";
          var Percent_text2 = 0;
          var Percent = document.createElement("p");
          Percent.classList.add("leetsports");
          Percent.classList.add(compressed_name);
          Percent.innerText = Percent_text;
          var color = getColor(Percent_text2);
          if (color.length > 0) {
            Percent.style =
              "background-color: "+color+"; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
          }
          d.appendChild(Percent);
        }
      
      if (name in players) {
        if ("line" in players[name] && line_enabled) {
          var line_text = players[name]["line"];
          var line = document.createElement("p");
          line.classList.add("leetsports");
          line.classList.add(compressed_name);
          line.innerText = line_text;
          if (line_text in background_colors) {
            line.style =
              "background-color: " +
              background_colors[line_text] +
              "; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
          } else {
            line.style =
              "background-color: gray; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
          }
          d.appendChild(line);
        }
        if ("pp" in players[name] && pp_enabled) {
          var pp_text = players[name]["pp"];
          if (pp_text.length > 0) {
            var pp = document.createElement("p");
            pp.classList.add("leetsports");
            pp.classList.add(compressed_name);
            pp.innerText = pp_text;
            if (pp_text == "PP1") {
              pp.style =
                "background-color: green; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
            } else if (pp_text == "PP2") {
              pp.style =
                "background-color: #809E1B; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
            }
            d.appendChild(pp);
          }
        }
        if ("pk" in players[name] && pk_enabled) {
          var pp_text = players[name]["pk"];
          if (pp_text.length > 0) {
            var pk = document.createElement("p");
            pk.classList.add("leetsports");
            pk.classList.add(compressed_name);
            pk.innerText = pp_text;
            if (pp_text == "PK1") {
              pk.style =
                "background-color: green; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
            } else if (pp_text == "PK2") {
              pk.style =
                "background-color: #809E1B; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
            }
            d.appendChild(pk);
          }
        }
        if (games_enabled && off_nights_enabled) {
          var games_text = "";
          if (games_enabled && off_nights_enabled) {
            games_text =
              games[team_map[team_name]] + "|" + off_days[team_map[team_name]];
          } else if (games_enabled && games.length > 0) {
            games_text = games[team_map[team_name]];
          } else if (off_nights_enabled && off_days.length > 0) {
            games_text = off_days[team_map[team_name]];
          }
          var g = document.createElement("p");
          g.classList.add("leetsports");
          g.classList.add(compressed_name);
          g.innerText = games_text;
          g.style =
            "background-color: grey; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
          d.appendChild(g);
        }
        elementsInsideBody[i].appendChild(d);
      }
    }
  }
}

window.onload = function () {
   //hideYahooPlus();
   setTimeout(function () {
     getAltPlayers();
     getPlayers();
   }, 2000);
};

chrome.storage.local.get("last_checked", function (result) {
  // check every hour
  const d = new Date();
  const last_checked = new Date(result.last_checked);
  last_checked.setHours(last_checked.getHours() + 4);

  if (true) {
    // if (last_checked < d) {
    chrome.runtime.sendMessage(
      { from: "content", type: "update_players" },
      function (response) {
        // do something
      }
    );
    chrome.runtime.sendMessage(
      { from: "content", type: "update_games" },
      function (response) {
        // do something
      }
    );
  } else {
    chrome.runtime.sendMessage(
      { from: "content", type: "get_players" },
      function (response) {
        // do something
      }
    );
    chrome.runtime.sendMessage(
      { from: "content", type: "get_games" },
      function (response) {
        // do something
      }
    );
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message["type"] == "players") {
    players = message["player_data"];
    PlayersKK = message["player_data2"];
    getAltPlayers();
  } else if (message["type"] == "updated") {
    setTimeout(function () {
      getAltPlayers();
      getPlayers();
    }, 1000);
  } else if (message["type"] == "games") {
    games = message["games_data"];
    off_days = message["off_days_data"];
    start_date = message["start_date"];
    end_date = message["end_date"];
    setTimeout(function () {
      getPlayers();
    }, 1000);
  } else if (message["type"] === "deploymentSettings") {
    let values = message["values"];
    line_enabled = values["line_enabled"];
    pp_enabled = values["pp_enabled"];
    pk_enabled = values["pk_enabled"];
    setTimeout(function () {
      getAltPlayers();
      getPlayers();
    }, 1000);
  } else if (message["type"] === "gamesSettings") {
    let values = message["values"];
    games_enabled = values["games_enabled"];
    off_nights_enabled = values["off_nights_enabled"];
    setTimeout(function () {
      getAltPlayers();
      getPlayers();
    }, 1000);
  }
});

var mutationObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.target.classList !== undefined) {
      if (
        mutation.target.classList.contains("Nav-h") ||
        mutation.target.classList.contains("Navitem")
      ) {
        getPlayers();
      }
      if (mutation.target.classList.contains("ysf-player-name")) {
        var name = mutation.target.childNodes[0].innerText;
        
        var pid = mutation.target.childNodes[0].getAttribute("data-ys-playerid");
        
        var team_name = mutation.target.childNodes[1].innerText.split(" ")[0];
        //check if team name is in team_map2
        if (team_name in team_map2) {
          team_name = team_map2[team_name];
        }
        console.log("team_name  = " +team_name )
        if (name in alt_players) {
          name = alt_players[name];
        }
        if (name in players_exception) {
          name = players_exception[name];
        }
        var compressed_name = name.replace(/\s/g, "_");
        console.log(compressed_name)
        if (mutation.target.id != compressed_name) {
          mutation.target.id = compressed_name;
          var childNodes = mutation.target.childNodes;
          for (var i = 0; i < childNodes.length; i++) {
            if (
              childNodes[i].classList !== undefined &&
              childNodes[i].classList.contains("leetsports")
            ) {
              mutation.target.removeChild(childNodes[i]);
            }
          }
          console.log("compressed name = " + compressed_name)
          console.log("name = " +name)
          console.log(pid)
          var d = document.createElement("div");
          d.classList.add("leetsports");
              if (pid in PlayersKK) {
                console.log(pid +" is in PlayersKK")
              var Percent_text = PlayersKK[pid]["Percent"]+"%";
              var Percent_text2 = PlayersKK[pid]["Percent"];
              var Percent = document.createElement("p");
              Percent.classList.add("leetsports");
              Percent.classList.add(compressed_name);
              Percent.innerText = Percent_text;
              var color = getColor(Percent_text2);
          if (color.length > 0) {
            Percent.style =
               "background-color: "+color+"; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
          }
              d.appendChild(Percent);
            }
            else {
              console.log(pid +" is not in PlayersKK")
              var Percent_text = "0%";
              var Percent_text2 = 0;
              var Percent = document.createElement("p");
              Percent.classList.add("leetsports");
              Percent.classList.add(compressed_name);
              Percent.innerText = Percent_text;
              var color = getColor(Percent_text2);
              if (color.length > 0) {
                Percent.style =
                  "background-color: "+color+"; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
              }
              d.appendChild(Percent);
            }
          
          if (name in players) {
            if ("line" in players[name] && line_enabled) {
              var line_text = players[name]["line"];
              var line = document.createElement("p");
              line.classList.add("leetsports");
              line.classList.add(compressed_name);
              line.innerText = line_text;
              if (line_text in background_colors) {
                line.style =
                  "background-color: " +
                  background_colors[line_text] +
                  "; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
              } else {
                line.style =
                  "background-color: gray; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
              }
              d.appendChild(line);
            }
            if ("pp" in players[name] && pp_enabled) {
              var pp_text = players[name]["pp"];
              if (pp_text.length > 0) {
                var pp = document.createElement("p");
                pp.classList.add("leetsports");
                pp.classList.add(compressed_name);
                pp.innerText = pp_text;
                if (pp_text == "PP1") {
                  pp.style =
                    "background-color: green; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
                } else if (pp_text == "PP2") {
                  pp.style =
                    "background-color: gray; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
                }
                d.appendChild(pp);
              }
            }
            if ("pk" in players[name] && pk_enabled) {
              var pp_text = players[name]["pk"];
              if (pp_text.length > 0) {
                var pk = document.createElement("p");
                pk.classList.add("leetsports");
                pk.classList.add(compressed_name);
                pk.innerText = pp_text;
                if (pp_text == "PK1") {
                  pk.style =
                    "background-color: green; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
                } else if (pp_text == "PK2") {
                  pk.style =
                    "background-color: #809E1B; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
                }
                d.appendChild(pk);
              }
            }
            
                var gdt = document.createElement("p");
                gdt.classList.add("leetsports");
                gdt.classList.add(compressed_name);
                // add link to game day thread in a new tab, make the text color white
                var link = document.createElement("a");
                link.href = "https://www.gamedaytweets.com/lines?team=" + team_name;
                link.innerText = "GDT";
                link.target = "_blank"; // Open link in a new tab
                link.style = "color: white;"; // Set text color to white
                gdt.appendChild(link);
                gdt.style =
                  "background-color: #214b59; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
                d.appendChild(gdt);
              
            
            if (games_enabled && off_nights_enabled) {
              var games_text = "";
              if (games_enabled && off_nights_enabled) {
                games_text =
                  games[team_map[team_name]] +
                  "|" +
                  off_days[team_map[team_name]];
              } else if (games_enabled && games.length > 0) {
                games_text = games[team_map[team_name]];
              } else if (off_nights_enabled && off_days.length > 0) {
                games_text = off_days[team_map[team_name]];
              }
              var g = document.createElement("p");
              g.classList.add("leetsports");
              g.classList.add(compressed_name);
              g.innerText = games_text;
              g.style =
                "background-color: grey; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px;";
              d.appendChild(g);
            }

           
          }
           mutation.target.appendChild(d);
        }
      }
    }
  });
});

// Starts listening for changes in the root HTML element of the page.
mutationObserver.observe(document.documentElement, {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true,
});
