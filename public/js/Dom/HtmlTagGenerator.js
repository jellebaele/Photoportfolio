export default class HtmlTagGenerator {
  createTag(tagType, attributes, innerHtml) {
    let tag = document.createElement(tagType);

    for (let key in attributes) {
      tag.setAttribute(key, attributes[key]);
    }

    tag.innerHTML = innerHtml;
    return tag;
  }
}
