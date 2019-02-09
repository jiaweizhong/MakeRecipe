// API key: f1e14a0541598bddbe208aeaedd46512
// https://www.food2fork.com/api/search
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

// global state of the app
// - search object
// - current recipe
// - shopping list object
// - liked recipes
const state = {};
window.state = state;

// search controller
const controlSearch = async () => {
  // get the query from the view
  const query = searchView.getInput();

  if (query) {
    // new search object & add to state
    state.search = new Search(query);
    // prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      // search for recipe
      await state.search.getResults();
      // render results on UI
      clearLoader();
      searchView.renderResults(state.search.results);
    } catch (err) {
      alert("Error processing in control search");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
  // click closest element
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.results, goToPage);
  }
});

// recipe controller
const controlRecipe = async () => {
  // get ID from the page URL hash
  const id = window.location.hash.replace("#", "");
  if (id) {
    // prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    // highlight selected search item
    if (state.search) searchView.highlightSelected(id);
    // create new recipe object
    state.recipe = new Recipe(id);

    try {
      // get recipe data & parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      // render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
      log(state.recipe);
    } catch (err) {
      log(err);
      alert("Error processing recipe");
    }
  }
};
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

// list controller
const controlList = () => {
  if(!state.list) state.list = new List();
  // add each ingredient
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

// handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  // click on a widget to capture the closest id
  const id = e.target.closest('.shopping__item').dataset.itemid;
  // handle the delete event
  if(e.target.matches('.shopping__delete, .shopping__delete *')){
    // delete from state
    state.list.deleteItem(id);
    // delete from UI
    listView.deleteItem(id);
    // handle the count update
  }else if(e.target.matches('.shopping__count-value')){
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

// like controller
const controlLike = () => {
  if(!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // user has not yet liked current recipe
  if(!state.likes.isLiked(currentID)){
    // add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    log(state.recipe.img);
    // toggle the like button
    likesView.toggleLikeBtn(true);
    // add like to the UI list
    likesView.renderLike(newLike);
  // user has liked current recipe
  }else{
    // remove like to the state
    state.likes.deleteLike(currentID);
    // toggle the like button
    likesView.toggleLikeBtn(false);
    // remove like to the UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// restore liked recipes on page load
window.addEventListener('load', () => {

    state.likes = new Likes();
    // restore likes
    state.likes.readStorage();
    // toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    // render the existing likes
    state.likes.likes.forEach( like => likesView.renderLike(like));
});

// handling recipe button clicks
elements.recipe.addEventListener("click", e => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // decrease btn is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // increase btn is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn, .recipe_btn--add *')){
    // add ingredient to the shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')){
    // like controller
    controlLike();
  }
  log(state.recipe);
});

window.l = new List();
