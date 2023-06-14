// 해당 페이지로 전환하면
window.onload = async () => {
  // 스크롤 상태에 따라 헤더의 구분선을 보여주는 코드
  const scrollBox = document.getElementById("contents");
  const header = document.getElementsByTagName("header");
  const topTrigger = document.getElementById("topTrigger");

  const topObserver = new IntersectionObserver(
    () => {
      header[0].toggleAttribute("data-scroll", scrollBox.scrollTop > 0);
    },
    { threshold: [1] }
  );

  topObserver.observe(topTrigger);

  // 요청 관련 코드
  const query = Object.fromEntries(
    new URLSearchParams(window.location.search).entries()
  );

  // 1. query 받기
  const { warningList, city } = query;

  const pageTitle = document.getElementById("pageTitle");
  pageTitle.innerText = city + "의 기상 특보";

  const warnList = JSON.parse(warningList);
  console.log(city, warnList);

  const warnVars = {
    1: "강풍",
    2: "호우",
    3: "한파",
    4: "건조",
    5: "폭풍해일",
    6: "풍랑",
    7: "태풍",
    8: "대설",
    9: "황사",
    12: "폭염",
  };

  const warnStresses = {
    0: "주의보",
    1: "경보",
  };

  const container = document.getElementById("warn-container");

  Object.values(warnList).forEach((info) => {
    const li = document.createElement("li");

    const title = document.createElement("div");
    title.classList.add("title");

    const titleIcon = document.createElement("insd-icon");
    titleIcon.setAttribute("type", "warn");

    const titleText = document.createElement("span");
    titleText.innerText =
      warnVars[info.warnVar] + warnStresses[info.warnStress];

    title.append(titleIcon, titleText);

    const area = document.createElement("p");
    area.innerText = "지역: " + info.areaName;

    li.append(title, area);

    container.append(li);
  });
};
