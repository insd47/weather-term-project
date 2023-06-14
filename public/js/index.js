window.onload = () => {
  // form elements
  const startDate = document.querySelector("select[name=startDate]");
  const endDate = document.querySelector("select[name=endDate]");
  const searchBar = document.getElementById("searchBar");
  const searchAjax = document.getElementById("searchAjax");
  const submit = document.getElementById("submit");

  // clear data
  startDate.value = "";
  endDate.value = "";
  searchBar.value = "";

  // validate form
  const validate = () =>
    startDate.value !== "" &&
    endDate.value !== "" &&
    searchBar.getAttribute("data-valid");

  const validateForSubmit = () => {
    if (validate()) {
      submit.removeAttribute("disabled");
    } else {
      submit.setAttribute("disabled", true);
    }
  };

  // 10일 이내의 날씨 정보만 조회할 수 있으므로, 10일치의 날짜 배열을 생성함.
  const tenDays = new Array(10).fill().map((_, i) => {
    const now = new Date();
    if (i === 0 && now.getHours() < 12) return;

    const date = new Date(getWeatherDate().formatted);
    date.setDate(date.getDate() + i);

    const value = date.toISOString().split("T")[0];

    if (i < 9) {
      const option = document.createElement("option");
      option.value = value;
      option.innerText = `${date.getMonth() + 1}월 ${date.getDate()}일`;
      startDate.appendChild(option);
    }

    return value;
  });

  // 시작일이 변경되면, 종료일을 시작일 이후의 날짜로 변경한 후 활성화함.
  startDate.addEventListener("change", (e) => {
    endDate.innerHTML = '<option value="" selected>선택</option>';

    if (e.target.value !== "") {
      const start = tenDays.indexOf(e.target.value) + 1;
      const end = tenDays.length - 1;

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

    validateForSubmit();
  });

  endDate.addEventListener("change", validateForSubmit);

  // 주소 자동완성 타이머
  let searchTimeout = null;

  searchBar.addEventListener("focus", () => {
    searchAjax.classList.remove("noBarFocus");
  });

  searchBar.addEventListener("input", (e) => {
    if (!searchBar.getAttribute("data-typing")) {
      searchAjax.innerHTML = `
        <div class="loadingContainer">
          <insd-loading size="small"></insd-loading>
        </div>`;
      searchAjax.classList.remove("disabled");
      submit.setAttribute("disabled", true);

      searchBar.parentElement.classList.remove("valid");
      searchBar.removeAttribute("data-valid");
      searchBar.setAttribute("data-typing", true);
    }

    clearTimeout(searchTimeout);

    if (e.target.value === "") {
      searchAjax.classList.add("disabled");
      searchBar.removeAttribute("data-typing");
      return;
    }

    searchTimeout = setTimeout(async () => {
      searchBar.removeAttribute("data-typing");

      const params = {
        query: e.target.value,
        size: 5,
      };

      const url =
        "/api/kakao/address?" + new URLSearchParams(params).toString();

      let isError = false;

      const res = await fetch(url).catch((err) => {
        console.error(err);
        searchAjax.classList.add("disabled");
      });

      searchAjax.innerHTML = "";
      if (isError) return;

      const data = await res.json();

      // 데이터가 없는 경우 박스 삭제
      if (data.documents.length <= 0) {
        searchAjax.classList.add("disabled");
      } else {
        data.documents.forEach((doc) => {
          const li = document.createElement("li");

          const compensated = doc.road_address_name
            ? doc.road_address_name
            : doc.address_name;

          li.innerHTML = `<p class="name">${doc.place_name}</p><p class="address">${compensated}</p>`;

          // 리스트 엘리먼트 클릭 시 동작
          li.onclick = () => {
            const address = document.querySelector("input[name=address]");
            const latitude = document.querySelector("input[name=latitude]");
            const longitude = document.querySelector("input[name=longitude]");

            searchBar.parentElement.classList.add("valid");
            searchBar.setAttribute("data-valid", true);
            searchBar.value = doc.place_name;
            address.value = doc.address_name;
            latitude.value = doc.y;
            longitude.value = doc.x;

            searchBar.blur();
            searchAjax.classList.add("noListFocus");
            validateForSubmit();
          };
          searchAjax.appendChild(li);
        });
      }
    }, 500);
  });

  // searchBar와 searchAjax의 포커스가 둘 다 없을 때, searchAjax를 숨김
  searchBar.addEventListener("focusout", () => {
    searchAjax.classList.add("noBarFocus");
  });

  searchAjax.addEventListener("pointerdown", () => {
    searchAjax.classList.remove("noListFocus");
  });

  // searchAjax 포커스 아웃 감지하기
  document.addEventListener("click", (e) => {
    if (!searchAjax.contains(e.target)) searchAjax.classList.add("noListFocus");
  });
};
