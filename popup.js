chrome.storage.local.get("last_updated", function (result) {
  document.getElementById("last_updated").innerHTML =
    "Last updated: " + result.last_updated;
});

window.addEventListener("DOMContentLoaded", function () {
  var link = document.getElementById("feedback");
  link.addEventListener("click", function () {
    var newURL = "mailto:leetsportsofficial@gmail.com?subject=Feedback";
    chrome.tabs.create({ url: newURL });
  });
});

function sendDeploymentSettings() {
  let line_enabled = document.getElementById("line").checked;
  let pp_enabled = document.getElementById("powerplay").checked;
  let pk_enabled = document.getElementById("penaltykill").checked;
  console.log(line_enabled);
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, {
        from: "popup",
        type: "deploymentSettings",
        values: {
          line_enabled: line_enabled,
          pp_enabled: pp_enabled,
          pk_enabled: pk_enabled,
        },
      });
    });
  });
  chrome.storage.sync.set({ line_enabled: line_enabled });
  chrome.storage.sync.set({ pp_enabled: pp_enabled });
  chrome.storage.sync.set({ pk_enabled: pk_enabled });
}

function sendGamesSettings() {
  let games_enabled = document.getElementById("games_enabled").checked;
  let off_nights_enabled =
    document.getElementById("off_nights_enabled").checked;
  let custom_range = document.getElementById("radio_custom_range").checked;
  var start_date = "";
  var end_date = "";
  if (custom_range) {
    start_date = document.getElementById("start_date").value;
    end_date = document.getElementById("end_date").value;
  } else {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    start_date = yyyy + "-" + mm + "-" + dd;

    if (today.getDay() == 0) {
      end_date = start_date;
    } else {
      var end_week = new Date(
        today.setDate(today.getDate() - today.getDay() + 7)
      );
      var dd = String(end_week.getDate()).padStart(2, "0");
      var mm = String(end_week.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = end_week.getFullYear();
      end_date = yyyy + "-" + mm + "-" + dd;
    }
  }
  console.log(custom_range);
  console.log(start_date);
  console.log(end_date);
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, {
        from: "popup",
        type: "gamesSettings",
        values: {
          games_enabled: games_enabled,
          off_nights_enabled: off_nights_enabled,
          custom_range: custom_range,
          start_date: start_date,
          end_date: end_date,
        },
      });
    });
  });
  chrome.storage.sync.set({ games_enabled: games_enabled });
  chrome.storage.sync.set({ off_nights_enabled: off_nights_enabled });
  chrome.storage.sync.set({ custom_range: custom_range });
  chrome.storage.sync.set({ start_date: start_date });
  chrome.storage.sync.set({ end_date: end_date });
}

window.onload = function () {
  chrome.storage.sync.get({ line_enabled: true }, function (data) {
    document.getElementById("line").checked = data.line_enabled;
  });
  chrome.storage.sync.get({ pp_enabled: true }, function (data) {
    document.getElementById("powerplay").checked = data.pp_enabled;
  });
  chrome.storage.sync.get({ pk_enabled: true }, function (data) {
    document.getElementById("penaltykill").checked = data.pk_enabled;
  });
  document
    .getElementById("save_deployment")
    .addEventListener("click", () => sendDeploymentSettings());

  chrome.storage.sync.get({ games_enabled: true }, function (data) {
    document.getElementById("games_enabled").checked = data.games_enabled;
  });
  chrome.storage.sync.get({ off_nights_enabled: true }, function (data) {
    document.getElementById("off_nights_enabled").checked =
      data.off_nights_enabled;
  });

  chrome.storage.sync.get(
    { custom_range: false, start_date: "", end_date: "" },
    function (data) {
      document.getElementById("radio_this_week").checked = !data.custom_range;
      document.getElementById("radio_custom_range").checked = data.custom_range;
      if (document.getElementById("radio_custom_range").checked) {
        document.getElementById("start").style.display = "block";
        document.getElementById("end").style.display = "block";
        document.getElementById("start_date").value = data.start_date;
        document.getElementById("end_date").value = data.end_date;
      } else {
        document.getElementById("start").style.display = "none";
        document.getElementById("end").style.display = "none";

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        start_date = yyyy + "-" + mm + "-" + dd;

        if (today.getDay() == 0) {
          end_date = start_date;
        } else {
          var end_week = new Date(
            today.setDate(today.getDate() - today.getDay() + 7)
          );
          var dd = String(end_week.getDate()).padStart(2, "0");
          var mm = String(end_week.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = end_week.getFullYear();
          end_date = yyyy + "-" + mm + "-" + dd;
        }

        document.getElementById("start_date").value = start_date;
        document.getElementById("end_date").value = end_date;
      }
    }
  );

  document.getElementById("radio_this_week").addEventListener("change", () => {
    console.log("radio_this_week changed");
    console.log(document.getElementById("radio_custom_range").checked);
    if (!document.getElementById("radio_custom_range").checked) {
      document.getElementById("start").style.display = "none";
      document.getElementById("end").style.display = "none";

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      start_date = yyyy + "-" + mm + "-" + dd;

      if (today.getDay() == 0) {
        end_date = start_date;
      } else {
        var end_week = new Date(
          today.setDate(today.getDate() - today.getDay() + 7)
        );
        var dd = String(end_week.getDate()).padStart(2, "0");
        var mm = String(end_week.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = end_week.getFullYear();
        end_date = yyyy + "-" + mm + "-" + dd;
      }

      document.getElementById("start_date").value = start_date;
      document.getElementById("end_date").value = end_date;
    }
  });

  document
    .getElementById("radio_custom_range")
    .addEventListener("change", () => {
      console.log("radio_custom_range changed");
      console.log(document.getElementById("radio_custom_range").checked);
      if (document.getElementById("radio_custom_range").checked) {
        document.getElementById("start").style.display = "block";
        document.getElementById("end").style.display = "block";
      }
    });

  document
    .getElementById("save_games")
    .addEventListener("click", () => sendGamesSettings());

  // Controls collapsible settings
  var coll = document.getElementsByClassName("collapsible");
  var i;
  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
};
