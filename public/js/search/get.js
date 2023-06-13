const get = {};

// 날씨, 강수량 조회
get.summary = async (
  weatherDate,
  startIndex,
  endIndex,
  dates,
  areaCodes,
  position
) => {
  // 기상청 중기육상예보조회 API
  const midWeather = await fetchWithParams(
    "/api/weather/forecast/mid/weather",
    {
      tmFc: weatherDate.date + weatherDate.time,
      regId: areaCodes.midWeatherForecast,
    }
  );

  // 반환값을 담을 객체
  const weatherList = {};
  const rainList = {};
  const shortTempList = {};

  // 데이터 정리
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
  if (startIndex < 3) {
    delay(500);

    // 단기예보는 하루 전의 23:00의 데이터를 사용함.
    const shortBaseDate = new Date();
    shortBaseDate.setDate(shortBaseDate.getDate() - 1);

    // 기상청 단기예보조회 API
    const short = await fetchWithParams("/api/weather/forecast/short", {
      pageNo: 1,
      base_date: shortBaseDate.toISOString().split("T")[0].replace(/-/g, ""),
      base_time: "2300",
      nx: position.x,
      ny: position.y,
    });

    // 단기예보의 SKY, PTY값을 모아서 함께 정리하기 위해
    // 날짜와 시간으로 묶어서 객체에 저장
    const shortWeatherList = {};

    // 데이터 정리
    short.items.item.forEach((now) => {
      const fcstDate = changeDateForm(now.fcstDate);
      const itemDate = new Date(fcstDate);
      const nowDate = new Date(weatherDate.formatted);

      // 3일 이후의 데이터 및 시작일 이전의 데이터 제외
      if (itemDate - nowDate >= 3 * day || !dates.includes(fcstDate)) return;

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
        console.log("TMN", fcstDate);
        if (!(fcstDate in shortTempList)) shortTempList[fcstDate] = {};
        shortTempList[fcstDate].min = parseInt(now.fcstValue);
      } else if (now.category === "TMX") {
        if (!(fcstDate in shortTempList)) shortTempList[fcstDate] = {};
        shortTempList[fcstDate].max = parseInt(now.fcstValue);
      }
    });

    // 정리한 시간별 단기예보 날씨 정보에서
    // 우선순위가 가장 높은 날씨를 해당 일자의 날씨로 반영함
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

  // 다른 parse 함수에서 데이터를 활용할 수 있도록 리턴해줌.
  return { weatherList, rainList, shortTempList };
};

// 최저, 최고 기온 조회
get.temperature = async (
  weatherDate,
  startIndex,
  endIndex,
  dates,
  areaCodes,
  shortTempList
) => {
  // 기상청 중기기온조회 API
  const midTemperature = await fetchWithParams(
    "/api/weather/forecast/mid/temperature",
    {
      tmFc: weatherDate.date + weatherDate.time,
      regId: areaCodes.midTemperatureForecast,
    }
  );

  // 반환할 최저, 최고 기온 정보
  // 단기예보 정보는 getSummary()에서 조회하였으므로
  // 값을 그대로 받아서 반영함.
  const temperatureList = shortTempList;

  // 데이터 정리
  Object.entries(midTemperature.items.item[0]).forEach((now) => {
    const [key, value] = now;

    if (key.includes("taMin") && key.length <= 7) {
      // 최저기온
      const index = parseInt(key.slice(5, 6));
      if (index < startIndex || index > endIndex) return;

      const date = dates[index - startIndex];

      if (!(date in temperatureList)) temperatureList[date] = {};
      temperatureList[date].min = parseInt(value);
    } else if (key.includes("taMax") && key.length <= 7) {
      // 최고기온
      const index = parseInt(key.slice(5, 6));
      if (index < startIndex || index > endIndex) return;

      const date = dates[index - startIndex];

      if (!(date in temperatureList)) temperatureList[date] = {};
      temperatureList[date].max = parseInt(value);
    }
  });

  return { temperatureList };
};

// 미세먼지
get.dust = async (startDate, endDate, areaCodes) => {
  // 요청 데이터 정리
  const strIndex = ["One", "Two", "Three", "Four"];
  const grades = {
    낮음: 0,
    높음: 2,
    좋음: 0,
    보통: 1,
    나쁨: 2,
  };

  const dustDate = getDustDate();
  const nowDate = new Date(dustDate);

  const startIndex = (startDate - nowDate) / day;
  const endIndex = (endDate - nowDate) / day;

  // 조회 일자 구하기
  const dates = new Array(endIndex - startIndex + 1).fill().map((_, i) => {
    const date = new Date(dustDate);
    date.setDate(date.getDate() + startIndex + i);

    return date.toISOString().split("T")[0];
  });

  // 에어코리아 초미세먼지 주간예보 조회 API
  const dustMid = await fetchWithParams("/api/dust/forecast/mid", {
    searchDate: dustDate,
  });

  const compensatedEnd = endIndex > 6 ? 6 : endIndex;
  const dustList = {};

  // 초미세먼지 주간예보는 최대 7일까지 조회할 수 있으므로
  // 7일 이후의 데이터는 -1 (알 수 없음)으로 처리함.
  if (endIndex > 7) {
    dates.slice(7 - startIndex).forEach((date) => {
      dustList[date] = -1;
    });
  }

  // 요청 데이터 정리
  for (let i = Math.max(3, startIndex); i <= compensatedEnd; i++) {
    const date = dates[i - startIndex];
    const itemId = `frcst${strIndex[i - 3]}Cn`;

    let grade = -1;
    dustMid.items[0][itemId]
      .replace(/ /g, "")
      .split(",")
      .every((now) => {
        const [key, value] = now.split(":");

        // 조회 지역을 찾으면 해당 지역의 미세먼지 등급을 저장하고
        // 반복을 종료함.
        if (key === areaCodes.dustMidName) {
          grade = grades[value];
          return false;
        }

        return true;
      });

    dustList[date] = grade;
  }

  if (startIndex < 3) {
    // 에어코리아 대기질 예보통보 조회 API
    const dustShort = await fetchWithParams("/api/dust/forecast/short", {
      pageNo: 1,
      searchDate: dustDate,
      informCode: "PM25",
    });

    // 요청 데이터 정리
    dustShort.items.forEach((now) => {
      const date = now.informData;

      if (dates.includes(date) && now.dataTime.includes("17시 발표")) {
        now.informGrade
          .replace(/ /g, "")
          .split(",")
          .every((now) => {
            const [key, value] = now.split(":");

            if (key === areaCodes.dustShortName) {
              dustList[date] = grades[value];
              return false;
            }

            return true;
          });
      }
    });
  }

  return { dustList };
};

// 기상특보 및 미세먼지 경보
get.warn = async (areaCodes) => {
  const weekago = new Date();
  weekago.setDate(weekago.getDate() - 5);
  const fromTmFc = weekago.toISOString().split("T")[0].replace(/-/g, "");

  // 기상청 기상특보조회 API
  const warning = await fetchWithParams(
    "/api/weather/warn",
    {
      stnId: areaCodes.weatherWarn,
      fromTmFc,
    },
    {
      noAPIError: true,
    }
  );

  if (!warning) return { warningList: [] };

  const warningList = {};

  warning.items.item.forEach((now) => {
    const { areaCode, areaName, warnVar, warnStress, command, cancel } = now;
    const id = areaCode + "-" + warnVar;

    // 발표
    if (command === "1") {
      warningList[id] = {
        areaName,
        command,
        warnVar,
        warnStress,
        changes: {},
      };
    }

    // 변경발표
    if (command === "7") {
      if (id in warningList)
        warningList[id].changes = {
          areaName,
          command,
          warnVar,
          warnStress,
        };
    }

    // 변경해제
    if (command === "8") {
      if (id in warningList) warningList[id].changes = {};
    }

    // 해제, 취소
    if (command === "2" || cancel === "1") {
      if (id in warningList) delete warningList[id];
    }
  });

  return { warningList };
};
