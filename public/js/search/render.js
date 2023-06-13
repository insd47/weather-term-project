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

render.tempSummary = (min, max) => {
  const tempMin = document.getElementById("summary-weather-min");
  const tempMax = document.getElementById("summary-weather-max");

  tempMin.innerText = min + "°C";
  tempMax.innerText = max + "°C";

  tempMin.removeAttribute("data-skeleton");
  tempMax.removeAttribute("data-skeleton");
};

render.byDate = (
  dates,
  weatherList,
  temperatureList,
  { min, max },
  dustList
) => {
  const result = document.getElementById("result");
  const ul = document.createElement("ul");

  dates.forEach((date) => {
    const item = document.createElement("li");

    const dateBox = document.createElement("div");
    const dateText = document.createElement("p");
    const weekText = document.createElement("p");

    const monthDate = date.slice(5).split("-").map(Number);

    dateText.innerText = monthDate.join("월") + "일";
    weekText.innerText = getWeekday(date) + "요일";

    dateBox.classList.add("date");
    dateBox.append(dateText, weekText);

    const weatherBox = document.createElement("div");
    const weatherIcon = document.createElement("insd-weather-icon");
    const weatherText = document.createElement("p");

    const weather = weatherList[date];

    weatherIcon.setAttribute("type", weatherCodes[weather].icon);
    weatherText.innerText = weatherCodes[weather].name;

    weatherBox.classList.add("weather");
    weatherBox.append(weatherIcon, weatherText);

    const othersBox = document.createElement("div");

    const temperatureBox = document.createElement("div");
    const temperatureMin = document.createElement("span");
    const temperatureMax = document.createElement("span");
    const temperatureProgress = document.createElement("div");

    const temperature = temperatureList[date];

    temperatureMin.innerText = temperature.min ? temperature.min : "--" + "°";
    temperatureMax.innerText = temperature.max + "°";

    temperatureProgress.classList.add("progress");
    temperatureProgress.setAttribute(
      "style",
      `--start: ${temperature.min ? temperature.min : min};
      --end: ${temperature.max};
      --min: ${min};
      --max: ${max};`
    );

    temperatureBox.classList.add("temperature");
    temperatureBox.append(temperatureMin, temperatureProgress, temperatureMax);

    const dustBox = document.createElement("div");
    const dustTitle = document.createElement("span");
    const dustGrade = document.createElement("span");

    const dust = dustList[date];

    dustTitle.innerText = "PM2.5";

    dustGrade.innerText = dustCodes[dust].text;
    dustGrade.setAttribute("style", `color: ${dustCodes[dust].color};`);

    dustBox.classList.add("dust");
    dustBox.append(dustTitle, dustGrade);

    othersBox.classList.add("others");
    othersBox.append(temperatureBox, dustBox);

    item.append(dateBox, weatherBox, othersBox);
    ul.append(item);
  });

  result.append(ul);
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
