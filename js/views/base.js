export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchRes: document.querySelector(".results"),
  searchResList: document.querySelector(".results__list"),
  searchResPages: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe"),
  shopping: document.querySelector(".shopping__list"),
  likesMenu: document.querySelector(".likes__field"),
  likesList: document.querySelector(".likes__list")
};

export const elementString = {
  loader: 'loader'
};

// pass in parent
export const renderLoader = parent => {
  // check css to see how the rotation is added to loader
  const loader =
    `<div class="${elementString.loader}">
            <svg>
              <use href="img/icons.svg#icon-cw"></use>
            </svg>
      </div>`;
  // add the loader after begin of the result list
  parent.insertAdjacentHTML('afterbegin', loader);
};

// clear loaders
export const clearLoader = () => {
  console.log("Clear loader...");
  const loader = document.querySelector(`.${elementString.loader}`);
  if(loader)
    loader.parentElement.removeChild(loader);
};
