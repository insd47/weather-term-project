const fetchWithParams = (url, params, options) => {
  return new Promise((resolve, reject) => {
    fetch(url + "?" + new URLSearchParams(params).toString(), options)
      .then(async (res) => {
        const data = await res.json();
        resolve(data);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

const getDate = () => {
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
    weatherDate: `${year}${month}${date}`,
    weatherTime: `${hour}00`,
    dustDate: `${year}-${month}-${date}`,
    original: { year, month, date, hour },
  };
};
