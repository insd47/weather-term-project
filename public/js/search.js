// 시작일이 3일 이내인지 확인
const getIsShort = (startDate) => {
  const nowDate = new Date(date.dustDate);
  const startDate = new Date(startDateString);
  const day = 24 * 60 * 60 * 1000;

  return startDate - nowDate < day * 3;
};

// 관련 API를 전부 호출하여 Object의 형태로 정리함
const fetchAll = async (pos, date, areaCodes, isShort) => {
  const res = {
    weather: {
      forecast: {
        mid: {
          weather: await fetchWithParams("/api/weather/forecast/mid/weather", {
            tmFc: date.weatherDate + date.weatherTime,
            regId: areaCodes.midWeatherForecast,
          }),
          temperature: await await fetchWithParams(
            "/api/weather/forecast/mid/temperature",
            {
              tmFc: date.weatherDate + date.weatherTime,
              regId: areaCodes.midTemperatureForecast,
            }
          ),
        },
      },
      warn: await fetchWithParams("/api/weather/warn", {
        pageNo: 1,
        stnId: areaCodes.weatherWarn,
      }),
    },
    dust: {
      forecast: {
        mid: await fetchWithParams("/api/dust/forecast/mid", {
          searchDate: date.dustDate,
        }),
      },
      warn: await fetchWithParams("/api/dust/warn", {
        year: date.weatherDate.slice(0, 4),
      }),
    },
  };

  // 시작일이 3일 이내일 경우
  // 중기예보에서 제공하지 않는 값이 있으므로
  // 단기예보 정보도 호출함.
  if (isShort) {
    res.weather.forecast.short = await fetchWithParams(
      "/api/weather/forecast/short",
      {
        pageNo: 1,
        baseDate: date.weatherDate,
        baseTime: date.weatherTime,
        nx: pos.x,
        ny: pos.y,
      }
    );
    res.dust.forecast.short = await fetchWithParams(
      "/api/dust/forecast/short",
      {
        pageNo: 1,
        searchDate: date.dustDate,
      }
    );
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

  const pos = convertPos(latitude, longitude);
  const date = getTime();

  console.log("query data:", {
    searchQuery: query,
    date,
    position: { x, y },
    areaCodes: areaCodes[city],
  });

  // 요청하기
  const res = await fetchAll(pos, date, areaCodes[city], getIsShort(startDate));
  console.log(res);
};
