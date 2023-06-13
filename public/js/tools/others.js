const day = 1000 * 60 * 60 * 24;

const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

const getPriority = (weather) => {
  let priority = 0;

  // 맑음, 구름많음, 흐림
  if (weather.includes("구름많")) priority += 30;
  else if (weather.includes("흐림") || weather.includes("흐리고"))
    priority += 40;

  // 비, 소나기, 눈, 비/눈
  if (weather.includes("비")) priority += 1;
  else if (weather.includes("비/눈")) priority += 2;
  else if (weather.includes("눈")) priority += 3;
  else if (weather.includes("소나기")) priority += 4;

  return priority;
};

const handleError = async (res, noAPIError, callback) => {
  if (res.status !== 200) {
    const params = {
      type: "RequestError",
      details: JSON.stringify({
        code: res.status,
        message: res.statusText,
      }),
    };

    if (callback) callback(params);
    else
      window.location.href = `/error?${new URLSearchParams(params).toString()}`;
    return;
  }

  const { response } = await res.json();

  if (response.header.resultCode !== "00" && (!noAPIError || callback)) {
    const params = {
      type: "APIError",
      details: JSON.stringify({
        code: response.header.resultCode,
        message: response.header.resultMsg,
      }),
    };

    if (callback) callback(params);
    else
      window.location.href = `/error?${new URLSearchParams(params).toString()}`;
    return;
  }

  return response.body;
};

const fetchWithParams = (url, params, options, timeout) => {
  const { noAPIError, callback, ...restOptions } = {
    noAPIError: false,
    callback: () => {},
    ...options,
  };

  return new Promise((resolve, reject) => {
    let timer = timeout
      ? setTimeout(
          () =>
            reject({
              statusCode: 408,
              statusMessage: "Request Timeout",
            }),
          timeout
        )
      : null;

    fetch(url + "?" + new URLSearchParams(params).toString(), restOptions)
      .then((res) => {
        if (timer) clearTimeout(timer);
        return res;
      })
      .then((res) => handleError(res, noAPIError, callback))
      .then(resolve)
      .catch((err) => reject(err));
  });
};

const getWeatherDate = () => {
  const now = new Date();

  // 기상청 API에 사용할 요청 시간
  // 업로드 주기가 부정확하여 현재 시간을 6시간 전으로 잡음.
  // 06:00, 18:00으로 현재 시간을 보정해야 함.
  const hour24 = parseInt(now.getHours().toString());

  const { year, month, date, hour } = {
    year: now.getFullYear().toString().padStart(4, "0"),
    month: (now.getMonth() + 1).toString().padStart(2, "0"),
    date: hour24 < 12 ? now.getDate() - 1 : now.getDate(),
    hour: hour24 < 12 ? "18" : "06",
  };

  return {
    date: `${year}${month}${date}`,
    time: `${hour}00`,
    formatted: `${year}-${month}-${date}`,
    original: { year, month, date, hour },
  };
};

const getDustDate = () => {
  const now = new Date();

  // 에어코리아 API에 사용할 요청 시간
  // 중기예보는 17:30에 업로드되므로
  // 18시 이전은 하루 전의 데이터를 사용하도록 함.
  const hour24 = parseInt(now.getHours().toString());

  const { year, month, date } = {
    year: now.getFullYear().toString().padStart(4, "0"),
    month: (now.getMonth() + 1).toString().padStart(2, "0"),
    date: hour24 < 18 ? now.getDate() - 1 : now.getDate(),
  };

  return `${year}-${month}-${date}`;
};

const changeDateForm = (yyyymmdd) => {
  const year = yyyymmdd.slice(0, 4);
  const month = yyyymmdd.slice(4, 6);
  const date = yyyymmdd.slice(6, 8);

  return `${year}-${month}-${date}`;
};
