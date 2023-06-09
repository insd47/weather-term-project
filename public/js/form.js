class Search {
  constructor() {}

  __startDate = "";
  __endDate = "";
  __address = "";

  setStartDate = (date) => (this.__startDate = date);
  setEndDate = (date) => (this.__endDate = date);
  setArea = (areaName, address, x, y) => {};
}

window.onload = () => {
  const search = new Search();

  // form elements
  const startDate = document.getElementById("startDate");
  const endDate = document.getElementById("endDate");
  const searchBar = document.getElementById("searchBar");
  const searchAjax = document.getElementById("searchAjax");

  // 10일 이내의 날씨 정보만 조회할 수 있으므로, 10일치의 날짜 배열을 생성함.
  const tenDays = new Array(11).fill().map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);

    if (i < 10) {
      const option = document.createElement("option");
      option.value = date.toDateString();
      option.innerText = `${date.getMonth() + 1}월 ${date.getDate()}일`;
      startDate.appendChild(option);
    }

    return date.toDateString();
  });

  // 시작일이 변경되면, 종료일을 시작일 이후의 날짜로 변경한 후 활성화함.
  startDate.addEventListener("change", (e) => {
    if (e.target.value !== "") {
      if (
        new Date(endDate.value) - new Date(e.target.value) <
        1000 * 60 * 60 * 24
      ) {
        endDate.value = "";
      }

      console.log(e.target.value);
      const start = tenDays.indexOf(e.target.value) + 1;
      const end = tenDays.length - 1;

      endDate.innerHTML = '<option value="" selected>선택</option>';
      for (let i = start; i <= end; i++) {
        const date = new Date(tenDays[i]);

        const option = document.createElement("option");
        option.value = tenDays[i];
        option.innerText = `${date.getMonth() + 1}월 ${date.getDate()}일`;
        endDate.appendChild(option);
      }

      endDate.disabled = false;
      endDate.parentElement.parentElement.classList.remove("disabled");
    } else {
      endDate.disabled = true;
      endDate.parentElement.parentElement.classList.add("disabled");
    }
  });

  let searchTimeout = null;

  searchBar.addEventListener("focus", (e) => {
    const searchAjax = document.getElementById("searchAjax");
    searchAjax.classList.remove("noBarFocus");
  });

  // 주소 자동완성
  searchBar.addEventListener("input", (e) => {
    searchAjax.innerHTML = "";
    searchAjax.classList.remove("disabled");

    clearTimeout(searchTimeout);
    if (e.target.value !== "") {
      searchTimeout = setTimeout(async () => {
        const params = {
          query: e.target.value,
          size: 5,
        };

        const url =
          "/api/kakao/address?" + new URLSearchParams(params).toString();
        const res = await fetch(url);
        const data = await res.json();

        if (data.documents.length <= 0) {
          searchAjax.classList.add("disabled");
        } else {
          data.documents.forEach((doc) => {
            const li = document.createElement("li");
            li.innerHTML = `<p class="name">${doc.place_name}</p><p class="address">${doc.road_address_name}</p>`;
            li.onclick = () => {
              console.log(doc.place_name, doc.address_name, doc.x, doc.y);
              search.setArea(doc.place_name, doc.address_name, doc.x, doc.y);
            };

            searchAjax.appendChild(li);
          });
        }
      }, 500);
    } else {
      searchAjax.classList.add("disabled");
    }
  });

  searchBar.addEventListener("focusout", (e) => {
    searchAjax.classList.add("noBarFocus");
  });

  searchAjax.addEventListener("pointerdown", (e) => {
    searchAjax.classList.remove("noListFocus");
  });

  searchAjax.addEventListener("focusout", (e) => {
    searchAjax.classList.add("noListFocus");
  });
};
