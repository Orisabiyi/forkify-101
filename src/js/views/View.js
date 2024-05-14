import icons from 'url:../../img/icons.svg'

export class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()
    this._data = data

    // Generate HTMLs
    const markup = this._generateMarkup()
    if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()
    this._data = data

    // Generate HTMLs
    const newMarkup = this._generateMarkup()
    const newDOM = document.createRange().createContextualFragment(newMarkup)

    const newElements = Array.from(newDOM.querySelectorAll('*')) // it will return a array of node elements
    const curElements = Array.from(this._parentEl.querySelectorAll('*'))

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i]

      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(item => {
          curEl.setAttribute(item.name, item.value)
        })
      }


    })
  }

  _clear() {
    this._parentEl.innerHTML = ''
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;

    this._clear()
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div> 
    `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div> 
    `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }
}