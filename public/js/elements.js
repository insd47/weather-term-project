// custom elements
class Icon extends HTMLElement {
  connectedCallback() {
    const span = document.createElement("span");
    span.innerText = "icon-" + this.getAttribute("type");

    const style = this.getAttribute("style");
    const classList = this.getAttribute("class");

    if (style) span.setAttribute("style", style);
    if (classList) span.setAttribute("class", classList);

    span.classList.add("icon");
    this.append(span);
  }
}

class WeatherIcon extends HTMLElement {
  connectedCallback() {
    const picture = document.createElement("picture");
    const source = document.createElement("source");
    const img = document.createElement("img");

    const type = this.getAttribute("type");
    const style = this.getAttribute("style");
    const classList = this.getAttribute("class");

    let width = this.getAttribute("width");
    if (!width) width = "24px";

    let height = this.getAttribute("height");
    if (!height) height = "24px";

    source.setAttribute("srcset", `/assets/weather/light/${type}.svg`);
    source.setAttribute("media", "(prefers-color-scheme: light)");

    img.setAttribute("width", "24");
    img.setAttribute("height", "24");
    img.setAttribute("alt", "Weather Icon of " + type);
    img.setAttribute("src", `/assets/weather/dark/${type}.svg`);

    picture.style.display = "block";

    this.style.width = width;
    this.style.height = height;
    img.style.width = width;
    img.style.height = height;

    if (style) picture.setAttribute("style", style);
    if (classList) picture.setAttribute("class", classList);

    picture.append(source);
    picture.append(img);

    this.append(picture);
  }
}

class LoadingIndicator extends HTMLElement {
  connectedCallback() {
    const size = this.getAttribute("size");

    const content = `
      <div class="loading" data-size="${size}">
        <span></span>
        <span></span>
        <span></span>
        <span>Loading...</span>
      </div>`;

    this.innerHTML = content;
  }
}

customElements.define("insd-icon", Icon);
customElements.define("insd-weather-icon", WeatherIcon);
customElements.define("insd-loading", LoadingIndicator);
