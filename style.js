class Style {
  #attributes;

  constructor() {
    this.#attributes = [];
  }

  addAttribute(attribute, value) {
    this.#attributes.push([attribute, value]);
  }

  toHtml() {
    const styles = this.#attributes.map(([key, val]) => `${key}:${val}`);
    return styles.join(';');
  }
}

module.exports = { Style };
