window.onload = () => {
  const query = Object.fromEntries(
    new URLSearchParams(window.location.search).entries()
  );

  console.log(query);

  if (
    !query.startDate ||
    !query.endDate ||
    !query.placeName ||
    !query.address ||
    !query.latitude ||
    !query.longitude
  )
    document.location.href = "/error";

  const pageTitle = document.getElementById("pageTitle");
  console.log(pageTitle);
  pageTitle.innerText = query.placeName;
};
