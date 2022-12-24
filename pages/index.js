const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById('search-input')
const tagSection = document.getElementById('tags')
const filterIngredientInput = document.getElementById('filter-ingredient')
const filterDeviceInput = document.getElementById('filter-device')
const filterUtensilInput = document.getElementById('filter-utensil')
const recipesSection = document.getElementById('recipes')
const filterIngredientListSection = document.getElementById("filter-ingredient-elements");
const filterDeviceListSection = document.getElementById("filter-device-elements");
const filterUtensilListSection = document.getElementById("filter-utensil-elements");
let filteredIngredientsToDisplay = []
let filteredDevicesToDisplay = []
let filteredUtensilsToDisplay = []
let selectedTagsToFilterFrom = []
searchInput.addEventListener('focus', () => {
    searchInput.value = ""
})

searchBtn.addEventListener('click', async () => {
    recipesSection.innerHTML = ""
    const recipes = await getRecipes()
    await displayData(recipes, searchInput.value.trim())
})

filterIngredientInput.addEventListener('focus', async (event) => {
    filterIngredientListSection.classList.add('display-grid')
    filterDeviceListSection.classList.remove('display-grid')
    filterUtensilListSection.classList.remove('display-grid')
})

filterDeviceInput.addEventListener('focus', async (event) => {
    filterDeviceListSection.classList.add('display-grid')
    filterIngredientListSection.classList.remove('display-grid')
    filterUtensilListSection.classList.remove('display-grid')
})

filterUtensilInput.addEventListener('focus', async (event) => {
    filterUtensilListSection.classList.add('display-grid')
    filterDeviceListSection.classList.remove('display-grid')
    filterIngredientListSection.classList.remove('display-grid')
})

filterIngredientInput.addEventListener('keyup', async (event) => {
    filterIngredientListSection.innerHTML = ''
    const newFilteredIngredientsToDisplay = filteredIngredientsToDisplay.filter(el => {
        return  el.toLowerCase().includes(event.target.value)
    })
    newFilteredIngredientsToDisplay.forEach(el => {
        const filterListDOM = createFilterDomElement(el)
        filterIngredientListSection.appendChild(filterListDOM);
    })
})

filterDeviceInput.addEventListener('keyup', async (event) => {
    filterDeviceListSection.innerHTML = ''
    const newFilteredDevicesToDisplay = filteredDevicesToDisplay.filter(el => {
        return  el.toLowerCase().includes(event.target.value)
    })
    newFilteredDevicesToDisplay.forEach(el => {
        const filterListDOM = createFilterDomElement(el)
        filterDeviceListSection.appendChild(filterListDOM);
    })
})

filterUtensilInput.addEventListener('keyup', async (event) => {
    filterUtensilListSection.innerHTML = ''
    const newFilteredUtensilsToDisplay = filteredUtensilsToDisplay.filter(el => {
        return  el.toLowerCase().includes(event.target.value)
    })
    newFilteredUtensilsToDisplay.forEach(el => {
        const filterListDOM = createFilterDomElement(el)
        filterUtensilListSection.appendChild(filterListDOM);
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

    // Set filtered elements
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
            displayFilterListElement(ingredientName, "filterIngredientListSection")
        })

        displayFilterListElement(recipe.appliance, "filterDeviceListSection")

        recipe.ustensils.forEach(utensil => {
            displayFilterListElement(utensil, "filterUtensilListSection")
        })

    })
}

function displayFilterListElement(data, section) {
    const filterListDOM = createFilterDomElement(data)
    switch (section) {
        case "filterIngredientListSection":
            filterIngredientListSection.appendChild(filterListDOM);
            filteredIngredientsToDisplay.push(filterListDOM.innerText);
            break;
        case "filterDeviceListSection":
            filterDeviceListSection.appendChild(filterListDOM);
            filteredDevicesToDisplay.push(filterListDOM.innerText);
            break;
        default:
            filterUtensilListSection.appendChild(filterListDOM);
            filteredUtensilsToDisplay.push(filterListDOM.innerText);
            break;
    }
}

function createFilterDomElement(data) {
    const filterListModel = recipeFactory(data)
    const filterListDOM = filterListModel.getFilterListDOM();
    filterListDOM.addEventListener('click', () => {
        displayTag(filterListDOM.innerText)
    })
    return filterListDOM
}

function displayTag(data) {
    tagSection.classList.add('tag-container')
    const tagModel = recipeFactory(data)
    const tagDOM = tagModel.getTagDOM();
    if (filterIngredientListSection.classList.contains("display-grid")) {
        tagDOM.classList.add("blue-tag")
    } else if (filterDeviceListSection.classList.contains("display-grid")) {
        tagDOM.classList.add("red-tag")
    } else {
        tagDOM.classList.add("green-tag")
    }

    tagSection.append(tagDOM)
}

function isRecipeIncludingInputValueInNameOrDescription(recipe, inputValue) {
   return recipe.name.toLowerCase().includes(inputValue) || recipe.description.toLowerCase().includes(inputValue)
}
