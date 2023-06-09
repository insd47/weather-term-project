// 해당 페이지로 전환하면
window.onload = async () => {
  // 스크롤 상태에 따라 헤더의 구분선을 보여주는 코드
  const scrollBox = document.getElementById("contents");
  const header = document.getElementsByTagName("header");
  const topTrigger = document.getElementById("topTrigger");
  const tabs = document.getElementById("tabs");

  const topObserver = new IntersectionObserver(
    () => {
      header[0].toggleAttribute("data-scroll", scrollBox.scrollTop > 0);
    },
    { threshold: [1] }
  );

  const tabObserver = new IntersectionObserver(
    ([tabs]) => {
      if (window.innerWidth >= 900) return;

      if (tabs.intersectionRect.top < 65)
        header[0].toggleAttribute(
          "data-scroll",
          scrollBox.scrollTop > 0 && tabs.intersectionRatio >= 1
        );
      tabs.target.toggleAttribute("data-sticky", tabs.intersectionRatio < 1);
    },
    { threshold: [1] }
  );

  topObserver.observe(topTrigger);
  tabObserver.observe(tabs);

  // 요청 관련 코드
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
    const query = {
      type: "noParameterError",
      details: JSON.stringify({
        code: "",
        message: "잘못된 접근",
      }),
    };

    document.location.href = "/error?" + new URLSearchParams(query);
    return;
  }

  // 1. query 받기
  const { placeName, address, latitude, longitude } = query;

  // 2. 요청 데이터 정리
  const pageTitle = document.getElementById("pageTitle");
  pageTitle.innerText = placeName;

  const splitedAddress = address.split(" ");
  const city = splitedAddress[0].slice(0, 2);

  const position = convertPos(latitude, longitude);
  const weatherDate = getWeatherDate();

  const startDate = new Date(query.startDate);
  const endDate = new Date(query.endDate);
  const nowDate = new Date(weatherDate.formatted);

  // 중기예보는 3일 이후부터 제공하므로
  // 시작일을 조회 시각으로부터 3일 이후로 자름.
  const startIndex = (startDate - nowDate) / day;
  const endIndex = (endDate - nowDate) / day;

  // 조회 일자 구하기
  const dates = new Array(endIndex - startIndex + 1).fill().map((_, i) => {
    const date = new Date(weatherDate.formatted);
    date.setDate(date.getDate() + startIndex + i);

    return date.toISOString().split("T")[0];
  });

  render.byDateSkeleton(dates);

  // 3. 요약 정보 API 불러오기 및 렌더링
  const { weatherList, rainList, shortTempList } = await get.summary(
    weatherDate,
    startIndex,
    endIndex,
    dates,
    areaCodes[city],
    position
  );

  render.summary(dates, weatherList, rainList);

  const { temperatureList } = await get.temperature(
    weatherDate,
    startIndex,
    endIndex,
    dates,
    areaCodes[city],
    shortTempList
  );

  const min = Math.min(...dates.map((date) => temperatureList[date].min));
  const max = Math.max(...dates.map((date) => temperatureList[date].max));

  render.tempSummary(min, max);

  const { dustList } = await get.dust(startDate, endDate, areaCodes[city]);

  render.byDate(dates, weatherList, temperatureList, { min, max }, dustList);

  // 탭 변경 활성화
  const changeTab = (tab) => {
    const result = document.getElementById("result");

    for (let i = 0; i < 2; i++) tabs.children[i].removeAttribute("data-active");

    if (tab === "byDate") {
      tabs.children[0].setAttribute("data-active", true);

      result.innerHTML = "";
      result.setAttribute("class", "byDate");

      render.byDate(
        dates,
        weatherList,
        temperatureList,
        { min, max },
        dustList
      );
    } else {
      tabs.children[1].setAttribute("data-active", true);

      result.innerHTML = "";
      result.setAttribute("class", "byCategory");

      render.byCategory(dates, temperatureList, dustList);
    }
  };

  tabs.children[0].addEventListener("click", () => changeTab("byDate"));
  tabs.children[1].addEventListener("click", () => changeTab("byCategory"));

  const { warningList } = await get.warn(areaCodes[city]);

  render.warn(city, warningList);
};
