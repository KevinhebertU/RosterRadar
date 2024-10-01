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

let team_map = {
  Ana: "Anaheim Ducks",
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
  Wsh: "Washington Capitals",
  Wpg: "Winnipeg Jets",
};

function getPlayers() {
  var elementsInsideBody = [
    ...document.body.getElementsByClassName("player-column__athlete"),
  ];
  for (var i = 0; i < elementsInsideBody.length; i++) {
    var team_node =
      elementsInsideBody[i].parentNode.childNodes[1].childNodes[0];
    team_name = team_node.innerText;

    var name = elementsInsideBody[i].childNodes[0].innerText;
    var compressed_name = name.replace(/\s/g, "_");
    if (elementsInsideBody[i].id != compressed_name) {
      elementsInsideBody[i].id = compressed_name;
      if (name in players) {
        var d = document.createElement("div");
        d.classList.add("leetsports");
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
              "; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px; font-weight: bold;";
          } else {
            line.style =
              "background-color: gray; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px; font-weight: bold;";
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
                "background-color: green; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px; font-weight: bold;";
            } else if (pp_text == "PP2") {
              pp.style =
                "background-color: #809E1B; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px; font-weight: bold;";
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
                "background-color: green; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px; font-weight: bold;";
            } else if (pp_text == "PK2") {
              pk.style =
                "background-color: #809E1B; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px; font-weight: bold;";
            }
            d.appendChild(pk);
          }
        }
        if (games_enabled || off_nights_enabled) {
          var games_text = "";
          if (games_enabled && off_nights_enabled) {
            games_text =
              games[team_map[team_name]] + "|" + off_days[team_map[team_name]];
          } else if (games_enabled) {
            games_text = games[team_map[team_name]];
          } else if (off_nights_enabled) {
            games_text = off_days[team_map[team_name]];
          }
          var g = document.createElement("p");
          g.classList.add("leetsports");
          g.classList.add(compressed_name);
          g.innerText = games_text;
          g.style =
            "background-color: grey; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px; font-weight: bold;";
          d.appendChild(g);
        }

        elementsInsideBody[i].appendChild(d);
      }
    }
  }
}

window.onload = function () {
  setTimeout(function () {
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
  } else if (message["type"] == "updated") {
    setTimeout(function () {
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
      getPlayers();
    }, 1000);
  } else if (message["type"] === "gamesSettings") {
    let values = message["values"];
    games_enabled = values["games_enabled"];
    off_nights_enabled = values["off_nights_enabled"];
    setTimeout(function () {
      getPlayers();
    }, 1000);
  }
});

var mutationObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.target.classList !== undefined) {
      if (mutation.target.classList.contains("player-column__athlete")) {
        var name = mutation.target.childNodes[0].innerText;
        var compressed_name = name.replace(/\s/g, "_");
        var team_node = mutation.target.parentNode.childNodes[1].childNodes[0];
        team_name = team_node.innerText;
        if (mutation.target.id != compressed_name) {
          mutation.target.id = compressed_name;
          var childNodes = mutation.target.childNodes;
          for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i].classList.contains("leetsports")) {
              mutation.target.removeChild(childNodes[i]);
            }
          }
          if (name in players) {
            var d = document.createElement("div");
            d.classList.add("leetsports");
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
                  "; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px; font-weight: bold;";
              } else {
                line.style =
                  "background-color: gray; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px; font-weight: bold;";
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
                    "background-color: green; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px; font-weight: bold;";
                } else if (pp_text == "PP2") {
                  pp.style =
                    "background-color: gray; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px; font-weight: bold;";
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
                    "background-color: green; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px; font-weight: bold;";
                } else if (pp_text == "PK2") {
                  pk.style =
                    "background-color: #809E1B; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px; font-weight: bold;";
                }
                d.appendChild(pk);
              }
            }
            if (games_enabled || off_nights_enabled) {
              var games_text = "";
              if (games_enabled && off_nights_enabled) {
                games_text =
                  games[team_map[team_name]] +
                  "|" +
                  off_days[team_map[team_name]];
              } else if (games_enabled) {
                games_text = games[team_map[team_name]];
              } else if (off_nights_enabled) {
                games_text = off_days[team_map[team_name]];
              }
              var g = document.createElement("p");
              g.classList.add("leetsports");
              g.classList.add(compressed_name);
              g.innerText = games_text;
              g.style =
                "background-color: grey; padding: 2px; margin-left: 2px; color: white; display:inline-block; border-radius: 1px; font-size: 10px; font-weight: bold;";
              d.appendChild(g);
            }
            mutation.target.appendChild(d);
          }
        }
        // games[team_map[team]]
        // off_days[team_map[team]]
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
