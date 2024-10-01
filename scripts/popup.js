document.addEventListener('DOMContentLoaded', function () {
  let button = document.getElementsByClassName('btn')[0];
  button.addEventListener('click', function (e) {
    alert('Please refresh your fantasy hockey tab to see changes.');
    updateLineups();
  });

  chrome.storage.local.get(['lastFetchTime'], function (result) {
    const dateElement = document.getElementById('lastUpdatedDate');
    if (result.lastFetchTime) {
      const chromeDate = new Date(result.lastFetchTime);
      dateElement.innerText = formatDateToCustomString(chromeDate);
    }
  });

  let colourSwitch = document.querySelector("input[type=checkbox]");

  chrome.storage.local.get(['coloursOn'], function (data) {
    colourSwitch.checked = data.coloursOn;
    let switchLabel = document.getElementById('iconColours');
    if (data.coloursOn) {
      switchLabel.innerText = "Icon Colours: ON";
    } else {
      switchLabel.innerText = "Icon Colours: OFF";
    }
  });

  colourSwitch.addEventListener('change', function () {
    let switchLabel = document.getElementById('iconColours');
    if (this.checked) {
      console.log("Checkbox is checked.");
      switchLabel.innerText = "Icon Colours: ON";
      chrome.storage.local.set({ 'coloursOn': true }, function () {
        console.log('Icon colours are set to true');
        sendMessageToTabs({ from: "popupChangeColour" });
      });
    } else {
      console.log("Checkbox is not checked.");
      switchLabel.innerText = "Icon Colours: OFF";
      chrome.storage.local.set({ 'coloursOn': false }, function () {
        console.log('Icon colours are set to false');
        sendMessageToTabs({ from: "popupChangeColour" });
      });
    }
  });
});

function formatDateToCustomString(date) {
  // Pad single digit numbers with a leading zero
  const pad = num => num < 10 ? '0' + num : num;

  let year = date.getFullYear();
  let month = pad(date.getMonth() + 1); // Months are 0-indexed, add 1 for correct month
  let day = pad(date.getDate());
  let hours = date.getHours();
  let minutes = pad(date.getMinutes());
  let ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = pad(hours);

  // Combine into desired format
  return `Last Updated: ${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
}

function sendMessageToTabs(message) {
  chrome.runtime.sendMessage(message, response => {
    console.log(response);
  });
}

function updateLineups() {
  sendMessageToTabs({ from: "popupUpdateLines" });
}
