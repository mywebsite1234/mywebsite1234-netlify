var cloakElement;

var tab = localStorage.getItem("tab");
if (tab) {
  try {
    var tabData = JSON.parse(tab);
  } catch {
    var tabData = {};
  }
} else {
  var tabData = {};
}

var titleElement = document.getElementById("title");
var iconElement = document.getElementById("icon");

if (tabData.title && titleElement) titleElement.value = tabData.title;
if (tabData.icon && iconElement) iconElement.value = tabData.icon;

var settingsDefaultTab = {
  title: "Google",
  icon: "/img/favicon.ico",
};

function setTitle(title = "") {
  if (title) {
    document.title = title;
  } else {
    document.title = settingsDefaultTab.title;
  }

  var tab = localStorage.getItem("tab");

  if (tab) {
    try {
      var tabData = JSON.parse(tab);
    } catch {
      var tabData = {};
    }
  } else {
    var tabData = {};
  }

  if (title) {
    tabData.title = title;
  } else {
    delete tabData.title;
  }

  localStorage.setItem("tab", JSON.stringify(tabData));
}

function setFavicon(icon) {
  if (icon) {
    document.querySelector("link[rel='icon']").href = icon;
  } else {
    document.querySelector("link[rel='icon']").href = settingsDefaultTab.icon;
  }

  var tab = localStorage.getItem("tab");

  if (tab) {
    try {
      var tabData = JSON.parse(tab);
    } catch {
      var tabData = {};
    }
  } else {
    var tabData = {};
  }

  if (icon) {
    tabData.icon = icon;
  } else {
    delete tabData.icon;
  }

  localStorage.setItem("tab", JSON.stringify(tabData));
}

function setCloak() {
  var cloak = cloakElement.value;

  switch (cloak) {
    case "search":
      setTitle('Google');
      setFavicon("/img/cloaks/gsearch.png");
      break;
    case "wikipedia":
      setTitle("Wikipedia, the free encyclopedia");
      setFavicon("/img/cloaks/wiki.png");
      break;
    case "bsite":
      setTitle("Billibilli");
      setFavicon("/img/cloaks/bb.png");
      break;
    case "drive":
      setTitle("My Drive - Google Drive");
      setFavicon("/img/cloaks/gdrive.png");
      break;
    case "gmail":
      setTitle("Gmail");
      setFavicon("/img/cloaks/gmail.png");
      break;
    case "calendar":
      setTitle("Google Calendar");
      setFavicon("/img/cloaks/calendar.png");
      break;
    case "meets":
      setTitle("Google Meet");
      setFavicon("/img/cloaks/meet.png");
      break;
    case "classroom":
      setTitle("Classes");
      setFavicon("/img/gclassroom.png");
      break;
    case "canvas":
      setTitle("Dashboard");
      setFavicon("/img/cloaks/canvas.png");
      break;
    case "zoom":
      setTitle("Zoom");
      setFavicon("/img/cloaks/zoom.png");
      break;
    case "khan":
      setTitle("Dashboard | Khan Academy");
      setFavicon("/img/cloaks/khan.png");
      break;
    case "itchio":
      setTitle("Download the latest indie games - itch.io");
      setFavicon("/assets/cloaks/itch.png");
      break;
    case "deltamath":
      setTitle("DeltaMath Student Application");
      setFavicon("/img/cloaks/deltamath.png");
      break;
    case "ed":
      setTitle("Edpuzzle");
      setFavicon("/img/cloaks/edpuzzle.png");
      break;
  }
}
function resetTab() {
  document.title = "Dashboard";
  document.querySelector("link[rel='icon']").href = "/img/favicon.ico";
  document.getElementById("title").value = "";
  document.getElementById("icon").value = "";
  localStorage.setItem("tab", JSON.stringify({}));
}

var panicKey = localStorage.getItem("panicKey") || "`";
var panicLink = localStorage.getItem("PanicLink") || "https://google.com/";

var toggled = localStorage.getItem("aboutBlank") || "false";

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("key").value = panicKey;
  document.getElementById("link").value = panicLink;
  cloakElement = document.getElementById("premadecloaks");

  const toggle = document.getElementById("toggle");
  if (toggled === "true") {
    toggle.checked = true;
  } else {
    toggle.checked = false;
  }
  toggle.addEventListener("change", function () {
    if (toggle.checked) {
      localStorage.setItem("aboutBlank", "true");
      toggle.checked = true;
    } else {
      localStorage.setItem("aboutBlank", "false");
      toggle.checked = false;
    }
  });
});

document.addEventListener("keydown", function (e) {
    if (e.key === `${panicKey}`) {
      window.location.href = `${panicLink}`;
    }
});

function setPanicKey() {
  var key = document.getElementById("key").value;
  localStorage.setItem("panicKey", key);
}

function setPanicLink() {
  var link = document.getElementById("link").value;
  localStorage.setItem("PanicLink", link);
}

function cloak() {
  let inFrame;

  try {
    inFrame = window !== top;
  } catch (e) {
    inFrame = true;
  }

  if (!inFrame && !navigator.userAgent.includes("Firefox")) {
    const popup = open("about:blank", "_blank");
    if (!popup || popup.closed) {
      alert("Please allow popups and redirects.");
    } else {
      const doc = popup.document;
      const iframe = doc.createElement("iframe");
      const style = iframe.style;
      const link = doc.createElement("link");

      const name = tabData.title || "Google";
      const icon = tabData.icon || "/img/favicon.ico";

      doc.title = name;
      link.rel = "icon";
      link.href = icon;

      iframe.src = location.href;
      style.position = "fixed";
      style.top = style.bottom = style.left = style.right = 0;
      style.border = style.outline = "none";
      style.width = style.height = "100%";

      doc.head.appendChild(link);
      doc.body.appendChild(iframe);

      const pLink =
        localStorage.getItem(encodeURI("pLink")) || "https://google.com";
      location.replace(pLink);

      const script = doc.createElement("script");
      script.textContent = `
        window.onbeforeunload = function (event) {
          const confirmationMessage = 'Leave Site?';
          (event || window.event).returnValue = confirmationMessage;
          return confirmationMessage;
        };
      `;
      doc.head.appendChild(script);
    }
  }
}

var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function convertDate(date_str) {
  temp_date = date_str.split("-");
  return (
    temp_date[2] + " " + months[Number(temp_date[1]) - 1] + " " + temp_date[0]
  );
}

var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function convertDate(date_str) {
  temp_date = date_str.split("-");
  return (
    months[Number(temp_date[1]) - 1] + " " + temp_date[2] + ", " + temp_date[0]
  );
}

fetch("https://api.github.com/repos/useclassplay/useclassplay.github.io/commits")
  .then((response) => response.json())
  .then((data) => {
    var unformatted = new Date(data[0].commit.author.date)
      .toISOString()
      .split("T")[0];
    var lastCommitDate = convertDate(unformatted);
    document.querySelector(
      "#updated"
    ).textContent = `Last Updated: ${lastCommitDate}`;
});

document.getElementById('updated').textContext = `Last Updated: ${lastCommitDate}`;
