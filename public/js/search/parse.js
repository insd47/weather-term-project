// 시작일이 3일 이내인지 확인
const getIsShort = (startDate, nowDate) => {
  const day = 24 * 60 * 60 * 1000;
  return startDate - nowDate < day * 3;
};

// 날씨, 강수량 조회
const getSummary = async (
  startDateString,
  endDateString,
  thisDate,
  areaCodes,
  position
) => {
  const day = 1000 * 60 * 60 * 24;

  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  const nowDate = new Date(thisDate.dustDate);

  const isShort = getIsShort(startDate, nowDate);

  // 중기예보는 3일 이후부터 제공하므로
  // 시작일을 조회 시각으로부터 3일 이후로 자름.
  const startIndex = isShort ? 3 : (startDate - nowDate) / day;
  const endIndex = Math.floor((endDate - nowDate) / day);

  // 조회 일자 구하기
  const dates = new Array(endIndex - startIndex + 1).fill().map((_, i) => {
    const date = new Date(thisDate.dustDate);
    date.setDate(date.getDate() + startIndex + i);

    return date.toISOString().split("T")[0];
  });

  // 기상청 중기육상예보조회 API
  const midWeather = await fetchWithParams(
    "/api/weather/forecast/mid/weather",
    {
      tmFc: thisDate.weatherDate + thisDate.weatherTime,
      regId: areaCodes.midWeatherForecast,
    }
  );

  const weatherList = {};
  const rainList = {};
  const shortTempList = {};

  Object.entries(midWeather.items.item[0]).forEach((now) => {
    const [key, value] = now;

    if (key.includes("rnSt")) {
      // 강수량
      const index = parseInt(key.slice(4, 5));
      if (index < startIndex || index > endIndex) return;

      const date = dates[index - startIndex];

      // 오전, 오후 두 개의 데이터가 있을 시
      // 더 큰 값으로 반영
      if (date in rainList) {
        rainList[date] = Math.max(rainList[date], parseInt(value));
        return;
      }

      rainList[date] = parseInt(value);
    } else if (key.includes("wf")) {
      // 날씨
      const index = parseInt(key.slice(2, 3));
      if (index < startIndex || index > endIndex) return;

      const date = dates[index - startIndex];

      // 오전, 오후 두 개의 데이터가 있을 시
      // 우선순위가 높은 날씨로 반영
      if (date in weatherList) {
        weatherList[date] = Math.max(getPriority(value), weatherList[date]);
        return;
      }

      weatherList[date] = getPriority(value);
    }
  });

  // 시작일이 3일 이내일 경우
  // 중기예보에서 제공하지 않는 값이 있으므로
  // 단기예보 정보도 호출함.
  if (isShort) {
    delay(500);

    const shortBaseTime = (parseInt(thisDate.weatherTime) - 100)
      .toString()
      .padStart(4, 0);

    const short = await fetchWithParams("/api/weather/forecast/short", {
      pageNo: 1,
      base_date: thisDate.weatherDate,
      base_time: shortBaseTime,
      nx: position.x,
      ny: position.y,
    });

    const shortWeatherList = {};

    short.items.item.forEach((now) => {
      // 3일 이후의 데이터는 제외
      const fcstDate = changeDateForm(now.fcstDate);
      const itemDate = new Date(fcstDate);

      if (itemDate - nowDate >= 3 * day) return;

      if (now.category === "SKY") {
        // 맑음, 구름많음, 흐림
        const date = now.fcstDate + now.fcstTime;

        if (!(date in shortWeatherList)) shortWeatherList[date] = {};
        shortWeatherList[date].SKY = parseInt(now.fcstValue) * 10;
      } else if (now.category === "PTY") {
        // 비, 비/눈, 눈, 소나기
        const date = now.fcstDate + now.fcstTime;

        if (!(date in shortWeatherList)) shortWeatherList[date] = {};
        shortWeatherList[date].PTY = parseInt(now.fcstValue);
      } else if (now.category === "POP") {
        // 강수량
        if (fcstDate in rainList) {
          rainList[fcstDate] = Math.max(
            rainList[fcstDate],
            parseInt(now.fcstValue)
          );
          return;
        }

        rainList[fcstDate] = parseInt(now.fcstValue);
      } else if (now.category === "TMN") {
        if (!(fcstDate in shortTempList)) shortTempList[fcstDate] = {};
        shortTempList[fcstDate].min = parseInt(now.fcstValue);
      } else if (now.category === "TMX") {
        if (!(fcstDate in shortTempList)) shortTempList[fcstDate] = {};
        shortTempList[fcstDate].max = parseInt(now.fcstValue);
      }
    });

    // 우선순위가 가장 높은 날씨만 등록함
    Object.entries(shortWeatherList).forEach((now) => {
      const priority = now[1].SKY + now[1].PTY;
      const date = changeDateForm(now[0].slice(0, 8));

      if (date in weatherList) {
        weatherList[date] = Math.max(priority, weatherList[date]);
        return;
      }

      weatherList[date] = priority;
    });
  }

  display.weather(weatherList, rainList); // 요약 정보를 표시합니다.

  // 다른 parse 함수에서 데이터를 활용할 수 있도록 리턴해준다.
  return { weatherList, rainList, shortTempList };
};
