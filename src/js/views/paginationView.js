import icons from 'url:../../img/icons.svg'
import { View } from "./View"

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination')

  addHandler(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline')

      if (!btn) return

      const goTo = +btn.dataset.id
      handler(goTo)
    })
  }

  _generateMarkup() {
    const curPage = this._data.page
    const numPages = Math.ceil(this._data.result.length / this._data.resultPerPage)

    // Render btn 2, if page 1
    if (curPage === 1 && numPages > 1) {
      return `
          <button data-id="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        `
    }

    // Render only previous btn, if at last page
    if (curPage === numPages && numPages > 1) {
      return `
          <button data-id="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
        `
    }

    // Render previous and next btn, if not page 1
    if (curPage > 1 && numPages > 1) {
      return `
          <button data-id="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>

          <button data-id="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        `
    }

    // Render no btn, if only one page
    return '';
  }
}

export default new PaginationView()