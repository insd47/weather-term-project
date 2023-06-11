const parseResponse = () => {};

// 관련 API를 전부 호출하여 Object의 형태로 정리함
const fetchAll = async (pos, date, areaCodes, isShort) => {
  const res = {
    weather: {
      forecast: {
        mid: {},
      },
    },
    dust: {
      forecast: {
        mid: {},
      },
    },
  };

  delay(500);

  // 기상청 중기기온조회 API
  res.weather.forecast.mid.temperature = await fetchWithParams(
    "/api/weather/forecast/mid/temperature",
    {
      tmFc: date.weatherDate + date.weatherTime,
      regId: areaCodes.midTemperatureForecast,
    }
  ).then((res) => res.response);

  delay(500);

  // 기상청 특보코드조회 API
  res.weather.warn = await fetchWithParams("/api/weather/warn", {
    pageNo: 1,
    stnId: areaCodes.weatherWarn,
  }).then((res) => res.response);

  delay(500);

  // 에어코리아 초미세먼지 주간예보 조회 API
  res.dust.forecast.mid = await fetchWithParams("/api/dust/forecast/mid", {
    searchDate: date.dustDate,
  }).then((res) => res.response);

  delay(500);

  // 에어코리아 미세먼지 경보 현황 정보 조회 API
  res.dust.warn = await fetchWithParams("/api/dust/warn", {
    year: date.weatherDate.slice(0, 4),
  }).then((res) => res.response);

  // 시작일이 3일 이내일 경우
  // 중기예보에서 제공하지 않는 값이 있으므로
  // 단기예보 정보도 호출함.
  if (isShort) {
    delay(500);

    // 기상청 단기예보조회 API
    res.weather.forecast.short = await fetchWithParams(
      "/api/weather/forecast/short",
      {
        pageNo: 1,
        base_date: date.weatherDate,
        base_time: "0500",
        nx: pos.x,
        ny: pos.y,
      }
    ).then((res) => res.response);

    delay(500);

    // 에어코리아 대기질 예보통보 조회 API
    res.dust.forecast.short = await fetchWithParams(
      "/api/dust/forecast/short",
      {
        pageNo: 1,
        searchDate: date.dustDate,
      }
    ).then((res) => res.response);
  }

  return res;
};

// 해당 페이지로 전환하면
window.onload = async () => {
  const query = Object.fromEntries(
    new URLSearchParams(window.location.search).entries()
  );

  if (
    !query.startDate ||
    !query.endDate ||
    !query.placeName ||
    !query.address ||
    !query.latitude ||
    !query.longitude
  ) {
    document.location.href = "/error";
    return;
  }

  // query 받기
  const { startDate, endDate, placeName, address, latitude, longitude } = query;

  // 요청 데이터 정리
  const pageTitle = document.getElementById("pageTitle");
  pageTitle.innerText = placeName;

  const splitedAddress = address.split(" ");
  const [city] = splitedAddress;

  const position = convertPos(latitude, longitude);
  const date = getDate();

  console.log("query data:", {
    searchQuery: query,
    date,
    position,
    areaCodes: areaCodes[city],
  });

  // 요약 정보 API 불러오기
  const { weatherList, rainList, shortTempList } = await getSummary(
    startDate,
    endDate,
    date,
    areaCodes[city],
    position
  );
};
