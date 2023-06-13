const render = {};

render.summary = (dates, weatherList, rainList) => {
  const weathericon = document.getElementById("summary-weather-icon");
  const weathermessage = document.getElementById("summary-weather-message");
  const termbar = document.getElementById("summary-termbar");

  // 날씨 요약 그리기
  const maxWeatherCode = dates
    .reduce(
      (acc, date) => {
        const now = weatherList[date];

        const code = Math.floor(now / 10);
        const rain = now % 10;

        if (rain > acc[1] || (rain === acc[1] && code > acc[0])) {
          return [code, rain];
        }

        return acc;
      },
      [1, 0]
    )
    .join("");

  const maxWeather = weatherCodes[maxWeatherCode];
  const message = getSummaryMessage(maxWeatherCode);

  weathermessage.innerText = message;
  weathermessage.removeAttribute("data-skeleton");

  const newIcon = document.createElement("insd-weather-icon");
  newIcon.setAttribute("type", maxWeather.icon);
  newIcon.setAttribute("width", "96px");
  newIcon.setAttribute("height", "96px");

  weathericon.append(newIcon);
  weathericon.removeAttribute("data-skeleton");

  // 수직선 그리기
  dates.forEach((date) => {
    const item = document.createElement("div");
    const icon = document.createElement("insd-weather-icon");

    item.classList.add("item");

    const weather = weatherList[date];
    const rain = rainList[date];

    if (weather % 10 > 0) {
      item.setAttribute("data-rain", true);
    }

    icon.setAttribute("type", weatherCodes[weather].icon);

    const texts = document.createElement("div");
    const dateText = document.createElement("p");
    const rainText = document.createElement("p");

    dateText.innerText = date.slice(5).replace("-", "/");
    rainText.innerText = rain + "%";

    texts.append(dateText, rainText);
    item.append(icon, texts);
    termbar.append(item);
  });

  termbar.children[0].remove();
  termbar.removeAttribute("data-skeleton");
};

render.tempSummary = (dates, temperatureList) => {
  const tempMin = document.getElementById("summary-weather-min");
  const tempMax = document.getElementById("summary-weather-max");

  const min = Math.min(
    ...dates.map((date) =>
      temperatureList[date].min ? temperatureList[date].min : 0
    )
  );
  const max = Math.max(...dates.map((date) => temperatureList[date].max));

  tempMin.innerText = min + "°C";
  tempMax.innerText = max + "°C";

  tempMin.removeAttribute("data-skeleton");
  tempMax.removeAttribute("data-skeleton");
};

render.byDate = (weatherList, temperatureList, dustList) => {
  console.log("byDate");
  console.log("weatherList", weatherList);
  console.log("temperatureList", temperatureList);
  console.log("dustList", dustList);
};

render.byCategory = (weatherList, temperatureList, dustList) => {
  console.log("byCategory");
  console.log("weatherList", weatherList);
  console.log("temperatureList", temperatureList);
  console.log("dustList", dustList);
};

render.warn = (warningList) => {
  const warn = document.getElementById("warn");
  const newIcon = document.createElement("insd-icon");

  if (warningList.length <= 0) {
    warn.setAttribute("data-type", "clear");

    newIcon.setAttribute("type", "complete");
    warn.children[0].replaceWith(newIcon);

    warn.children[1].innerText = "유효한 기상 특보가 없습니다.";
  } else {
    warn.setAttribute("data-type", "warn");

    newIcon.setAttribute("type", "warn");
    warn.children[0].replaceWith(newIcon);

    warn.children[1].innerText = "유효한 기상 특보가 있습니다.";
  }

  warn.removeAttribute("data-skeleton");
};
