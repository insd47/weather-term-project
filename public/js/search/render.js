const render = {};

render.summary = (weatherList, rainList) => {
  console.log("summary");
  console.log("weatherList", weatherList);
  console.log("rainList", rainList);
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
  console.log("warn");
  console.log("warningList", warningList);
};
