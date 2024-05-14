import icons from '../../img/icons.svg'
import { View } from "./View"
import previewView from "./previewView.js"


class ResultView extends View {
  _parentEl = document.querySelector('.results')
  _errorMessage = 'Recipe is not found, Please enter another keyword of recipe'

  _generateMarkup() {
    return this._data.map(item => previewView.render(item, false)).join('')
  }
}

export default new ResultView()