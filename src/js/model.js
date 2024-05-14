import 'regenerator-runtime/runtime'
import { AJAX } from './helper.js'
import { API_URL, RES_PER_PAGE, API_KEY } from './config.js'


export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultPerPage: RES_PER_PAGE
  },
  bookmarks: [],
}

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key })
  }
}

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`)

    // 2. Renaming the object container
    state.recipe = createRecipeObject(data)

    if (state.bookmarks.some(bookmark => bookmark.id === id)) state.recipe.bookmarked = true
    else state.recipe.bookmarked = false

  } catch (err) {
    throw err;
  }
}

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`)
    console.log(data);

    state.search.result = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        imageUrl: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key })
      }
    })

  } catch (err) {
    throw err;
  }
}

export const getSearchPageResult = function (page = 1) {
  state.search.page = page

  const start = (page - 1) * state.search.resultPerPage
  const end = page * state.search.resultPerPage

  return state.search.result.slice(start, end);
}

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings
  })

  state.recipe.servings = newServings;
}

const persistStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe)

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true
  persistStorage()
}

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(item => item.id === id)
  state.bookmarks.splice(index, 1)

  if (id === state.recipe.id) state.recipe.bookmarked = false
  persistStorage()
}

const retrieveBookmark = function () {
  const bookmarks = localStorage.getItem('bookmarks')

  if (bookmarks) state.bookmarks = JSON.parse(bookmarks)
}

retrieveBookmark()

export const handleUploadRecipe = async function (newRecipe) {
  try {
    // Creating an Object for the ingredient
    const ingredients = Object.entries(newRecipe)
      .filter(item => item[0].startsWith('ingredient') && item[1] !== '')
      .map(item => {
        const ingArr = item[1].replaceAll(' ', '').split(',')
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format!')

        const [quantity, unit, description] = ingArr
        return { quantity: quantity ? +quantity : null, unit, description }
      })

    const recipeData = {
      title: newRecipe.title,
      ingredients: ingredients,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      publisher: newRecipe.publisher,
    }

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipeData)

    state.recipe = createRecipeObject(data)
    addBookmark(state.recipe)

    console.log(data, state);
  } catch (err) {
    throw err
  }
}
