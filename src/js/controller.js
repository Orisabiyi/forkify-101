// Import for Polyfiling
import 'core-js/stable'
import 'regenerator-runtime/runtime'


// General Imports
import * as model from "./model.js"
import recipeView from "./views/recipeView.js"
import searchView from './views/searchView.js'
import resultView from './views/resultView.js'
import paginationView from './views/paginationView.js'
import bookmarkView from './views/bookmarkView.js'
import addRecipeView from './views/addRecipeView.js'
import { MESSAGE_TIMEOUT_SEC } from './config.js'


const controlRecipes = async function () {
  try {
    const uniqueFoodId = window.location.hash.slice(1)
    if (!uniqueFoodId) return;

    // Load Spinner
    recipeView.renderSpinner()

    // 1. Loading from model
    await model.loadRecipe(uniqueFoodId)

    // rendering from view
    recipeView.render(model.state.recipe)

  } catch (err) {
    recipeView.renderError();
  }
}

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery()
    if (!query) return;

    resultView.renderSpinner()
    await model.loadSearchResults(query)

    // Render result
    resultView.render(model.getSearchPageResult())

    // render pagination
    paginationView.render(model.state.search)

  } catch (err) {
    console.log(err);
    resultView.renderError(err.message)
  }
}

const controlPagination = function (page) {
  resultView.render(model.getSearchPageResult(page))
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  // Update the servings form the state
  model.updateServings(newServings)

  // Updating the recipe instead of re-rendering everything in the DOM
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  recipeView.update(model.state.recipe)

  bookmarkView.render(model.state.bookmarks)
}

const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (data) {
  try {
    // Uploading recipe to server
    await model.handleUploadRecipe(data)

    recipeView.render(model.state.recipe)

    // display sucess message
    addRecipeView.renderMessage()

    bookmarkView.render(model.state.bookmarks)

    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // hide window after some seconds
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MESSAGE_TIMEOUT_SEC * 100)

  } catch (err) {
    addRecipeView.renderError(err.message)
  }
}

const init = function () {
  bookmarkView.addHandlerRender(controlBookmark)
  addRecipeView.addHandlerUpload(controlAddRecipe)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandler(controlPagination)
}

init()
