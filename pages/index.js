const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById('search-input')
const filterIngredientInput = document.getElementById('filter-ingredient')
const recipesSection = document.getElementById('recipes')
const filterListSection = document.getElementById("filter-elements");
let filteredIngredientsToDisplay = []
searchInput.addEventListener('focus', () => {
    searchInput.value = ""
})

searchBtn.addEventListener('click', async () => {
    recipesSection.innerHTML = ""
    const recipes = await getRecipes()
    await displayData(recipes, searchInput.value.trim())
})

filterIngredientInput.addEventListener('focus', async (event) => {
    filterListSection.classList.add('display-grid')
})

filterIngredientInput.addEventListener('keyup', async (event) => {
    filterListSection.innerHTML = ''
    console.log(filterListSection)

    const newFilteredIngredientsToDisplay = filteredIngredientsToDisplay.filter(el => {
        return  el.toLowerCase().includes(event.target.value)
    })
    newFilteredIngredientsToDisplay.forEach(el => {
        const filterListDOM = createFilterDomElement(el)
        filterListSection.appendChild(filterListDOM);
    })
})

async function getRecipes() {
    return await fetch('../recipes.json').then(response => {
        return response.json()
    }).then( data => {
        return data
    }).catch(error => {
        console.log('error', error)
    })
}

function displayData(recipes, inputValue) {
    // Get recipe section and add class
    const recipeSection = document.getElementById("recipes");
    recipeSection.classList.add('recipes')

    // Get filtered Recipes
    const filteredRecipes = getFilteredRecipes(recipes, inputValue)

    // Create Recipe card
    filteredRecipes.forEach((recipe) => {
        const recipeModel = recipeFactory(recipe);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipeSection.appendChild(recipeCardDOM);
    });

    // Set tags of filtered recipes
    setFilteredListElements(filteredRecipes)
}

function getFilteredRecipes(recipes, inputValue) {
    return recipes.filter(recipe => {
        const result = isRecipeIncludingInputValueInNameOrDescription(recipe, inputValue)
        if (result) return recipe
    })
}

function setFilteredListElements(recipes) {
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            const ingredientName = ingredient.ingredient
            displayFilterListElement(ingredientName)
        })
    })
}

function displayFilterListElement(data) {
    const filterListDOM = createFilterDomElement(data)
    filterListSection.appendChild(filterListDOM);
    filteredIngredientsToDisplay.push(filterListDOM.innerText)
}

function displayTag(data) {
    const tagSection = document.getElementById("tags");
    tagSection.classList.add('tag-container')
    const tagModel = recipeFactory(data)
    const tagDOM = tagModel.getTagDOM();
    tagSection.appendChild(tagDOM);
}

function createFilterDomElement(data) {
    const filterListModel = recipeFactory(data)
    const filterListDOM = filterListModel.getFilterListDOM();
    filterListDOM.addEventListener('click', () => {
        displayTag(filterListDOM.innerText)
    })
    return filterListDOM
}

function isRecipeIncludingInputValueInNameOrDescription(recipe, inputValue) {
   return recipe.name.toLowerCase().includes(inputValue) || recipe.description.toLowerCase().includes(inputValue + '')
}
