const render = {};

render.byDateSkeleton = (dates) => {
  const result = document.getElementById("result");
  const ul = document.createElement("ul");
  ul.setAttribute("data-skeleton", true);
  ul.setAttribute("style", "backround-color: var(--color-background);");

  dates.forEach(() => {
    const item = document.createElement("li");

    const dateBox = document.createElement("div");
    const dateText = document.createElement("p");
    const weekText = document.createElement("p");

    dateText.innerHTML = "-";
    weekText.innerHTML = "-";

    dateText.classList.add("dateText", "skeleton");
    weekText.classList.add("weekText", "skeleton");

    dateText.setAttribute("data-skeleton", true);
    weekText.setAttribute("data-skeleton", true);

    dateBox.classList.add("date");
    dateBox.append(dateText, weekText);

    const weatherBox = document.createElement("div");
    const weatherText = document.createElement("p");

    weatherText.innerHTML = "-";
    weatherText.classList.add("weatherText", "skeleton");
    weatherText.setAttribute("data-skeleton", true);

    weatherBox.classList.add("weather");
    weatherBox.append(weatherText);

    const othersBox = document.createElement("div");
    othersBox.classList.add("others");

    const tempBox = document.createElement("div");
    const tempDummy = document.createElement("p");

    tempDummy.innerHTML = "-";
    tempDummy.classList.add("tempDummy", "skeleton");
    tempDummy.setAttribute("data-skeleton", true);

    tempBox.classList.add("temperature");
    tempBox.append(tempDummy);

    const dustBox = document.createElement("div");
    const dustDummy = document.createElement("span");

    dustDummy.innerHTML = "-";
    dustDummy.classList.add("dustDummy", "skeleton");
    dustDummy.setAttribute("data-skeleton", true);

    dustBox.classList.add("dust");
    dustBox.append(dustDummy);

    othersBox.append(tempBox, dustBox);
    item.append(dateBox, weatherBox, othersBox);

    ul.append(item);
  });

  result.append(ul);
};

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

    dateText.innerText = monthDate.join("월 ") + "일";
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

    temperatureMin.innerText = temperature.min + "°";
    temperatureMax.innerText = temperature.max + "°";

    temperatureProgress.classList.add("progress");
    temperatureProgress.setAttribute(
      "style",
      `--start: ${temperature.min};
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

  if (
    result.children.length > 0 &&
    result.children[0].getAttribute("data-skeleton")
  ) {
    result.children[0].classList.add("fadeout");
    setTimeout(() => result.children[0].remove(), 1000);
  }

  result.append(ul);
};

render.byCategory = (dates, temperatureList, dustList) => {
  const result = document.getElementById("result");

  // 최고 기온
  const maxTempElement = document.createElement("div");
  maxTempElement.classList.add("item");

  const maxTempTitle = document.createElement("h2");
  maxTempTitle.innerText = "최고 기온";

  const maxGraph = document.createElement("div");
  maxGraph.classList.add("graph");

  const maxGraphAxis = document.createElement("div");
  maxGraphAxis.classList.add("graphaxis");

  const minOfMax = Math.min(
    ...Object.values(temperatureList).map((t) => t.max)
  );
  const maxOfMax = Math.max(
    ...Object.values(temperatureList).map((t) => t.max)
  );

  dates.forEach((date, index) => {
    const graphItem = document.createElement("div");
    const axisItem = document.createElement("div");
    const text = document.createElement("span");
    const dateText = document.createElement("span");

    const temperature = temperatureList[date];

    graphItem.setAttribute(
      "style",
      `--value: ${temperature.max};
      --next: ${temperatureList[dates[index + 1]]?.max || temperature.max};
      --min: ${minOfMax === maxOfMax ? minOfMax - 1 : minOfMax};
      --max: ${maxOfMax === minOfMax ? maxOfMax + 1 : maxOfMax};
      --color: var(--color-yellow);`
    );

    text.innerText = temperature.max + "°";
    graphItem.append(text);

    dateText.innerText = date.slice(5).replace("-", "/");
    axisItem.append(dateText);

    maxGraph.append(graphItem);
    maxGraphAxis.append(axisItem);
  });

  maxTempElement.append(maxTempTitle, maxGraph, maxGraphAxis);

  // 최저 기온
  const minTempElement = document.createElement("div");
  minTempElement.classList.add("item");

  const minTempTitle = document.createElement("h2");
  minTempTitle.innerText = "최저 기온";

  const minGraph = document.createElement("div");
  minGraph.classList.add("graph");

  const minGraphAxis = document.createElement("div");
  minGraphAxis.classList.add("graphaxis");

  const minOfMin = Math.min(
    ...Object.values(temperatureList).map((t) => t.min)
  );
  const maxOfMin = Math.max(
    ...Object.values(temperatureList).map((t) => t.min)
  );

  dates.forEach((date, index) => {
    const graphItem = document.createElement("div");
    const axisItem = document.createElement("div");
    const text = document.createElement("span");
    const dateText = document.createElement("span");

    const temperature = temperatureList[date];

    graphItem.setAttribute(
      "style",
      `--value: ${temperature.min};
      --next: ${temperatureList[dates[index + 1]]?.min || temperature.min};
      --min: ${minOfMin === maxOfMin ? minOfMin - 1 : minOfMin};
      --max: ${maxOfMin === minOfMin ? maxOfMin + 1 : maxOfMin};
      --color: var(--color-blue);`
    );

    text.innerText = temperature.min + "°";
    graphItem.append(text);

    dateText.innerText = date.slice(5).replace("-", "/");
    axisItem.append(dateText);

    minGraph.append(graphItem);
    minGraphAxis.append(axisItem);
  });

  minTempElement.append(minTempTitle, minGraph, minGraphAxis);

  // 초미세먼지
  const dustElement = document.createElement("div");
  dustElement.classList.add("item");

  const dustTitle = document.createElement("h2");
  dustTitle.innerText = "초미세먼지";

  const dustGraph = document.createElement("div");
  dustGraph.classList.add("dustgraph");

  dates.forEach((date) => {
    const item = document.createElement("div");

    const text = document.createElement("span");
    const dateText = document.createElement("span");

    text.setAttribute("style", `color: ${dustCodes[dustList[date]].color};`);
    item.setAttribute("style", `--color: ${dustCodes[dustList[date]].color};`);

    text.innerText = dustCodes[dustList[date]].text;
    dateText.innerText = date.slice(5).replace("-", "/");

    item.append(text, dateText);
    dustGraph.append(item);
  });

  dustElement.append(dustTitle, dustGraph);

  // 반영
  result.append(maxTempElement, minTempElement, dustElement);
};

render.warn = (city, warningList) => {
  const warn = document.getElementById("warn");
  const newIcon = document.createElement("insd-icon");

  if (warningList.length <= 0) {
    warn.setAttribute("data-type", "clear");

    newIcon.setAttribute("type", "complete");
    warn.children[0].replaceWith(newIcon);

    warn.children[1].innerText = "유효한 기상 특보가 없습니다.";
  } else {
    warn.setAttribute("data-type", "warn");

    warn.onclick = () => {
      const params = {
        warningList: JSON.stringify(warningList),
        city: city,
      };

      window.location.href = "/warn?" + new URLSearchParams(params).toString();
    };

    newIcon.setAttribute("type", "warn");
    warn.children[0].replaceWith(newIcon);

    warn.children[1].innerText = "유효한 기상 특보가 있습니다.";
  }

  warn.removeAttribute("data-skeleton");
};
