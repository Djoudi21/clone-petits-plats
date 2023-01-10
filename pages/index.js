// DOM ELEMENT QUERIES
const searchInput = document.getElementById('search-input')
const tagSection = document.getElementById('tags')
const filterIngredientInput = document.getElementById('filter-ingredient')
const filterDeviceInput = document.getElementById('filter-device')
const filterUtensilInput = document.getElementById('filter-utensil')
const recipesSection = document.getElementById('recipes')
const filterIngredientListSection = document.getElementById("filter-ingredient-elements");
const filterDeviceListSection = document.getElementById("filter-device-elements");
const filterUtensilListSection = document.getElementById("filter-utensil-elements");
const recipeSection = document.getElementById("recipes");


// ARRAY INIT
let filteredIngredientsToDisplay = []
let filteredDevicesToDisplay = []
let filteredUtensilsToDisplay = []
let filteredRecipes = []

// EVENT LISTENERS
searchInput.addEventListener('focus', () => {
    searchInput.value = ""
})

searchInput.addEventListener('click', async () => {
    if (searchInput.value.length < 2) {
        searchInput.focus()
        searchInput.classList.add('warning')
        searchInput.setAttribute("placeholder", "Vous devez entrer un minimum de 3 lettres")
    } else {
        recipesSection.innerHTML = ""
        recipeSection.classList.add('recipes')
        searchInput.blur()
        //GET RECIPES
        const recipes = await getRecipes()

        //GET FILTERED RECIPES
        filteredRecipes = getFilteredRecipes(recipes,  searchInput.value.trim())

        if (filteredRecipes.length === 0) {
            filterIngredientListSection.innerHTML = ""
            filterDeviceListSection.innerHTML = ""
            filterUtensilListSection.innerHTML = ""
            filteredIngredientsToDisplay = []
            filteredDevicesToDisplay = []
            filteredUtensilsToDisplay = []
            const noRecipes = document.createElement("div")
            noRecipes.innerText = "« Aucune recette ne correspond à votre critère… vous pouvez\n" +
                "chercher « tarte aux pommes », « poisson », etc.   "
            recipesSection.append(noRecipes)
        } else {
            //CREATE AND DISPLAY RECIPES CARD
            await displayRecipes(filteredRecipes)

            //SET FILTERS
            filterIngredientListSection.innerHTML = ""
            filterDeviceListSection.innerHTML = ""
            filterUtensilListSection.innerHTML = ""
            filteredIngredientsToDisplay = []
            filteredDevicesToDisplay = []
            filteredUtensilsToDisplay = []
            setFilterElements(filteredRecipes)
        }

        searchInput.value = ""
        searchInput.setAttribute("placeholder", "Recherchez par recette, ingredient ou description")
        searchInput.classList.remove('warning')
        searchInput.classList.add('search-bar-border')
    }
})

searchInput.addEventListener('keyup', async () => {
    if (searchInput.value.length > 2) searchInput.classList.remove('warning')
})

filterIngredientInput.addEventListener('focus', async (event) => {
    filterIngredientInput.value = ""
    filterIngredientListSection.classList.add('display-grid')
    filterDeviceListSection.classList.remove('display-grid')
    filterUtensilListSection.classList.remove('display-grid')
})

filterDeviceInput.addEventListener('focus', async (event) => {
    filterDeviceInput.value = ""
    filterDeviceListSection.classList.add('display-grid')
    filterIngredientListSection.classList.remove('display-grid')
    filterUtensilListSection.classList.remove('display-grid')
})

filterUtensilInput.addEventListener('focus', async (event) => {
    filterUtensilInput.value = ""
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
        const filterListDOM = createFilterDomElement(el, filteredRecipes)
        filterIngredientListSection.appendChild(filterListDOM);
    })
})

filterDeviceInput.addEventListener('keyup', async (event) => {
    filterDeviceListSection.innerHTML = ''
    const newFilteredDevicesToDisplay = filteredDevicesToDisplay.filter(el => {
        return el.toLowerCase().includes(event.target.value)
    });
    newFilteredDevicesToDisplay.forEach(el => {
        const filterListDOM = createFilterDomElement(el, filteredRecipes)
        filterDeviceListSection.appendChild(filterListDOM);
    })
})

filterUtensilInput.addEventListener('keyup', async (event) => {
    filterUtensilListSection.innerHTML = ''
    const newFilteredUtensilsToDisplay = filteredUtensilsToDisplay.filter(el => {
        return  el.toLowerCase().includes(event.target.value)
    })
    newFilteredUtensilsToDisplay.forEach(el => {
        const filterListDOM = createFilterDomElement(el, filteredRecipes)
        filterUtensilListSection.appendChild(filterListDOM);
    })
})

// RECIPES FUNCTIONS
async function getRecipes() {
    return await fetch('../recipes.json').then(response => {
        return response.json()
    }).then( data => {
        return data
    }).catch(error => {
        console.log('error', error)
    })
}

function displayRecipes(recipes) {
    // Create Recipe cards
    recipes.forEach((recipe) => {
        const recipeModel = recipeFactory(recipe);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipeSection.appendChild(recipeCardDOM);
    });
}

function getFilteredRecipes(recipes, value) {
    return recipes.filter(recipe => {
        const result = isRecipeIncludingInputValueInNameOrDescription(recipe, value)
        const result2 = isRecipeIncludingInputValueInUstensils(recipe, value)
        const result3 = isRecipeIncludingInputValueInDevices(recipe, value)
        if (result || result2 || result3) {
            return recipe
        }
    })
}


// TAGS FUNCTIONS
function setFilterElements(recipes) {
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            const ingredientName = ingredient.ingredient
            insertFilterElementBySection(ingredientName, "filterIngredientListSection", recipes)
        })
        insertFilterElementBySection(recipe.appliance, "filterDeviceListSection", recipes)
        recipe.ustensils.forEach(utensil => {
            insertFilterElementBySection(utensil, "filterUtensilListSection", recipes)
        })

    })
}

function insertFilterElementBySection(data, section, recipes) {

    const filterDomElement = createFilterDomElement(data, recipes)
    switch (section) {
        case "filterIngredientListSection":
            if(!filteredIngredientsToDisplay.includes(filterDomElement.innerText.toLowerCase())) {
                filterIngredientListSection.appendChild(filterDomElement);
                filteredIngredientsToDisplay.push(filterDomElement.innerText.toLowerCase());
            }
            break;
        case "filterDeviceListSection":
            if(!filteredDevicesToDisplay.includes(filterDomElement.innerText.toLowerCase() || filterDomElement.innerText)) {
                filterDeviceListSection.appendChild(filterDomElement);
                filteredDevicesToDisplay.push(filterDomElement.innerText.toLowerCase());
            }
            break;
        default:
            if(!filteredUtensilsToDisplay.includes(filterDomElement.innerText.toLowerCase())) {
                filterUtensilListSection.appendChild(filterDomElement);
                filteredUtensilsToDisplay.push(filterDomElement.innerText.toLowerCase());
            }
            break;
    }
}

function createFilterDomElement(data, recipes) {
    const filterListModel = tagFactory(data)
    const filterDomElement = filterListModel.getFilterDomElement();
    filterDomElement.addEventListener('click', async () => {
        const tagModel = tagFactory(filterDomElement.innerText);
        const tagDOM = tagModel.getTagDOM();
        if(filterIngredientListSection.classList.contains('display-grid')) {
            tagDOM.classList.add('blue-tag')
        } else if(filterDeviceListSection.classList.contains('display-grid')) {
            tagDOM.classList.add('red-tag')
        } else {
            tagDOM.classList.add('green-tag')
        }
        tagSection.appendChild(tagDOM);
        tagSection.classList.add('tag-container')


        recipesSection.innerHTML = ""
        recipeSection.classList.add('recipes')
        filteredRecipes = getFilteredRecipes(recipes,  filterDomElement.innerText)

        //CREATE AND DISPLAY RECIPES CARD
        await displayRecipes(filteredRecipes)

        //SET FILTERS
        filterIngredientListSection.innerHTML = ""
        filterDeviceListSection.innerHTML = ""
        filterUtensilListSection.innerHTML = ""
        filteredIngredientsToDisplay = []
        filteredDevicesToDisplay = []
        filteredUtensilsToDisplay = []
        setFilterElements(filteredRecipes)
    })

    return filterDomElement
}

// UTILS FUNCTIONS
function isRecipeIncludingInputValueInNameOrDescription(recipe, value) {
   return recipe.name.toLowerCase().includes(value) || recipe.description.toLowerCase().includes(value) || recipe.ingredients.includes(value)
}

function isRecipeIncludingInputValueInUstensils(recipe, value) {
    if(recipe.ustensils.includes(value)) return true
}

function isRecipeIncludingInputValueInDevices(recipe, value) {
    if(recipe.appliance === value) return true
}
