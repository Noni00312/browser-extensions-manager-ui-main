let allExtensions = [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  const switchImg = document.getElementById("switch-theme-img");
  const savedTheme = localStorage.getItem("currentTheme");

  if (savedTheme === "light") {
    toggleThemeClassList(true);
    switchImg.src = "assets/images/icon-moon.svg";
  } else {
    toggleThemeClassList(false);
    switchImg.src = "assets/images/icon-sun.svg";
  }
  parseJSON();
});

document.getElementById("filter-all-button").addEventListener("click", () => {
  currentFilter = "all";
  displayExtension("all");
});

document
  .getElementById("filter-active-button")
  .addEventListener("click", () => {
    currentFilter = "active";
    displayExtension("active");
  });

document
  .getElementById("filter-inactive-button")
  .addEventListener("click", () => {
    currentFilter = "inactive";
    displayExtension("inactive");
  });

document.getElementById("switch-theme-button").addEventListener("click", () => {
  let switchImg = document.getElementById("switch-theme-img");
  let currentTheme = localStorage.getItem("currentTheme") || "dark";

  if (currentTheme === "dark") {
    switchImg.src = "assets/images/icon-moon.svg";
    localStorage.setItem("currentTheme", "light");
    changeToLightMode();
    displayExtension();
  } else {
    switchImg.src = "assets/images/icon-sun.svg";
    localStorage.setItem("currentTheme", "dark");
    changeToDarkMode();
    displayExtension();
  }
});

function changeToLightMode() {
  toggleThemeClassList(true);
}

function changeToDarkMode() {
  toggleThemeClassList(false);
}

function toggleThemeClassList(lightMode = false) {
  document.getElementById("logo-text").classList.toggle("logo-text", lightMode);
  document
    .getElementById("search-input")
    .classList.toggle("search-input-light", lightMode);

  document
    .querySelector(".search-container")
    .classList.toggle("search-container-light", lightMode);

  document
    .getElementById("switch-theme-button")
    .classList.toggle("switch-theme-button-light", lightMode);

  document.querySelector(".filter-container h1").style.color = lightMode
    ? "hsl(227, 75%, 14%)"
    : "hsl(200, 60%, 99%)";

  document.querySelector("footer").classList.toggle("footer-light", lightMode);
  document.body.classList.toggle("body-light-mode", lightMode);

  document
    .querySelectorAll("button")
    .forEach((btn) => btn.classList.toggle("button-light-mode", lightMode));

  document
    .querySelectorAll("footer a")
    .forEach((a) => a.classList.toggle("footer-a", lightMode));
}

function parseJSON() {
  fetch("./data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      allExtensions = data;
      displayExtension();
    })
    .catch((error) => console.error("Failed to fetch data:", error));
}

function displayExtension() {
  const extensionContainer = document.getElementById("extention-container");
  extensionContainer.innerHTML = ""; // remove current content
  let currentTheme = localStorage.getItem("currentTheme");

  //filter
  let result = filterData(currentFilter, allExtensions);

  for (let x of result) {
    let isActive = x.isActive ? "checked" : "";
    let containerTheme =
      currentTheme === "light"
        ? " extension-card extension-card-light "
        : "extension-card";

    let titleTheme =
      currentTheme === "light" ? "card-title card-title-light" : "card-title";

    let descriptionTheme =
      currentTheme === "light" ? "card-desc card-desc-light" : "card-desc";

    let buttonTheme = currentTheme === "light" ? "button-light-mode" : "";

    extensionContainer.innerHTML += `<div class="${containerTheme}">
              <div class="icon-title-container">
                  <img src="${x.logo}" alt="icon" />
                  <div class="title-description-container">
                      <h2 class="${titleTheme}">${x.name}</h2>
                      <p class="${descriptionTheme}">
                      ${x.description}
                      </p>
                  </div>
              </div>
              <div class="btn-container">
                  <button class="${buttonTheme}"  data-name="${x.name}">Remove</button>
                  <label class="switch">
                      <input type="checkbox" data-state="${x.isActive}" ${isActive}/>
                      <span class="slider round"></span>
                  </label>
              </div>
          </div>`;
  }
  addRemoveHandlers();
}

function filterData(filterType, data) {
  if (filterType === "active") {
    return data.filter((item) => item.isActive);
  } else if (filterType === "inactive") {
    return data.filter((item) => !item.isActive);
  }
  return data;
}

function addRemoveHandlers() {
  document.querySelectorAll(".btn-container button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".extension-card, .extension-card-light");
      const nameToRemove = e.target.dataset.name;

      if (card) {
        card.classList.add("card-removing");

        setTimeout(() => {
          allExtensions = allExtensions.filter(
            (ext) => ext.name !== nameToRemove
          );
          displayExtension();
        }, 500);
      }
    });
  });
}
