const requestErrorTypes = {
  400: {
    message: "잘못된 요청",
    description:
      "사이트 주소를 제대로 입력하지 않았거나,\n삭제된 페이지일 수 있습니다.",
  },
  401: {
    message: "로그인이 필요합니다",
    description: "로그인을 하셔야 이용할 수 있는 서비스입니다.",
  },
  403: {
    message: "접근 권한이 없습니다",
    description: "해당 페이지에 접근할 권한이 없습니다.",
  },
  404: {
    message: "페이지를 찾을 수 없습니다",
    description:
      "사이트 주소를 제대로 입력하지 않았거나,\n삭제된 페이지일 수 있습니다.",
  },
  500: {
    message: "서버 오류",
    description: "서버에 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.",
  },
  503: {
    message: "서버 오류",
    description: "서버에 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.",
  },
};

window.onload = async () => {
  const query = Object.fromEntries(
    new URLSearchParams(window.location.search).entries()
  );

  const { type, details } = query;
  const { code, message } = JSON.parse(details);

  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorDescription = document.getElementById("error-description");

  switch (type) {
    case "RequestError":
      errorTitle.innerText = code;
      errorMessage.innerText = requestErrorTypes[code].message;
      errorDescription.innerText = requestErrorTypes[code].description;
      break;
    case "APIError":
      errorTitle.innerText = "오류";
      errorMessage.innerText = message;
      errorDescription.innerText = "API 서버에 오류가 발생했습니다.";
      break;
    default:
      errorTitle.innerText = "오류";
      errorMessage.innerText = "알 수 없는 오류";
      errorDescription.innerText = "알 수 없는 오류가 발생했습니다.";
  }
};
