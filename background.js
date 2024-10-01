var players = {};
var PlayersKK = {};
var games = {};
var off_days = {};

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
start_date = yyyy + "-" + mm + "-" + dd;

if (today.getDay() == 0) {
  end_date = start_date;
} else {
  var end_week = new Date(today.setDate(today.getDate() - today.getDay() + 7));
  var dd = String(end_week.getDate()).padStart(2, "0");
  var mm = String(end_week.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = end_week.getFullYear();
  end_date = yyyy + "-" + mm + "-" + dd;
}

function get_kkupfl_data() {
  fetch(
    "https://kkupfl-db-call.azurewebsites.net/api/KKUPFL_Percent_Rostered?code=rerrKeQJmQd55s9nR76E3hscoZTdT13e_2jn8RMVcTmlAzFu8AmAFw==",
    { mode: "no-cors" }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data2) {
      chrome.storage.local.set(
        { player_data2: JSON.stringify(data2["Players"]) },
        function () {
          // do something
        }
      );
           const d = new Date();
      chrome.storage.local.set({ last_checked: d.toJSON() }, function () {
        // do something
      });
    })
    .catch(function () {
      console.log("Failed!");
    });
}

function get_updated_data() {
  fetch(
    "http://leetsports-env.eba-fr7wdxc8.us-west-2.elasticbeanstalk.com/api/stats",
    { mode: "cors" }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      chrome.storage.local.set(
        { player_data: JSON.stringify(data["players"]) },
        function () {
          // do something
        }
      );
      chrome.storage.local.set(
        { last_updated: data["last_updated"] },
        function () {
          // do something
        }
      );
      const d = new Date();
      chrome.storage.local.set({ last_checked: d.toJSON() }, function () {
        // do something
      });
    })
    .catch(function () {
      console.log("Failed!");
    });
}

function load_data() {
  chrome.storage.local.get("player_data", function (result) {
    if ("player_data" in result) {
      players = JSON.parse(result["player_data"])
      ;
    } else {
      players = {};
    }
  });
}


function load_data2() {
  chrome.storage.local.get("player_data2", function (result) {
    if ("player_data2" in result) {
  PlayersKK = JSON.parse(result["player_data2"])
  ;
} else {
  PlayersKK = {};
}
});
}

function load_game_data() {
  chrome.storage.local.get("games_data", function (result) {
    if ("games_data" in result) {
      games = JSON.parse(result["games_data"]);
    } else {
      games = {};
    }
  });
}

function load_dates() {
  chrome.storage.sync.get({ start_date: "", end_date: "" }, function (result) {
    if (result.start_date != "") {
      start_date = result.start_date;
    }
    if (result.end_date != "") {
      end_date = result.end_date;
    }
    get_updated_games(null);
  });
}

function load_off_days_data() {
  chrome.storage.local.get("off_days_data", function (result) {
    if ("off_days_data" in result) {
      off_days = JSON.parse(result["off_days_data"]);
    } else {
      off_days = {};
    }
  });
}

get_kkupfl_data();
get_updated_data();
load_data();
load_data2()
load_dates();
// get_updated_games();
load_game_data();
load_off_days_data();

chrome.runtime.onMessage.addListener((message, sender) => {
  const { from, type } = message;
  const tabId = sender.tab.id;

  if (type == "get_players") {
    chrome.tabs.sendMessage(tabId, {
      player_data: players,
      player_data2: PlayersKK,
      from: "background",
      type: "players",
    });
  } else if (type == "update_players") {
    get_kkupfl_data()
    get_updated_data();
    chrome.tabs.sendMessage(tabId, {
      player_data: players,
      player_data2: PlayersKK,
      from: "background",
      type: "players",
    });
  } else if (type == "get_games") {
    send_games(tabId);
  } else if (type == "update_games") {
    send_games(tabId);
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data and do something with it (like read the url)
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tab.id, {
      updated: true,
      from: "background",
      type: "updated",
    });
  }
});

function send_games(tabId) {
  chrome.storage.sync.get({ start_date: "", end_date: "" }, function (result) {
    if (result.start_date != "") {
      start_date = result.start_date;
    }
    if (result.end_date != "") {
      end_date = result.end_date;
    }
    get_updated_games(tabId);
  });
}

function get_updated_games(tabId) {
  fetch(
    "http://leetsports-env.eba-fr7wdxc8.us-west-2.elasticbeanstalk.com/api/games?startDate=" +
      start_date +
      "&endDate=" +
      end_date,
    { mode: "cors" }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (tabId != null) {
        chrome.tabs.sendMessage(tabId, {
          games_data: data["games"],
          off_days_data: data["off_days"],
          start_date: start_date,
          end_date: end_date,
          from: "background",
          type: "games",
        });
      }

      chrome.storage.local.set(
        { games_data: JSON.stringify(data["games"]) },
        function () {
          // do something
        }
      );
      chrome.storage.local.set(
        { off_days_data: JSON.stringify(data["off_days"]) },
        function () {
          // do something
        }
      );
      chrome.storage.local.set(
        { games_last_updated: data["last_updated"] },
        function () {
          // do something
        }
      );
      const d = new Date();
      chrome.storage.local.set({ games_last_checked: d.toJSON() }, function () {
        // do something
      });
    })
    .catch(function () {
      console.log("Failed!");
    });
}
