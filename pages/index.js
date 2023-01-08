// DOM ELEMENT QUERIES
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

searchBtn.addEventListener('click', async () => {
    if (searchInput.value.length < 3) {
        searchInput.focus()
        searchInput.classList.add('warning')
        searchInput.setAttribute("placeholder", "Vous devez entrer un minimum de 3 lettres")
    } else {
        recipesSection.innerHTML = ""
        recipeSection.classList.add('recipes')

        //GET RECIPES
        const recipes = await getRecipes()

        //GET FILTERED RECIPES
        filteredRecipes = getFilteredRecipes(recipes,  searchInput.value.trim())

        if (filteredRecipes.length === 0) {
            const toto = document.createElement("div")
            toto.innerText = "« Aucune recette ne correspond à votre critère… vous pouvez\n" +
                "chercher « tarte aux pommes », « poisson », etc."
            recipesSection.append(toto)
        } else {
            //CREATE AND DISPLAY RECIPES CARD
            await displayRecipes(filteredRecipes)

            //SET FILTERS
            setFilterElements(filteredRecipes)
        }

        searchInput.value = ""
        searchInput.setAttribute("placeholder", "Recherchez par recette, ingredient ou description")
        searchInput.classList.remove('warning')
        searchInput.classList.add('search-bar-border')
    }
})

filterIngredientInput.addEventListener('focus', async (event) => {
    filterIngredientInput.value = ""
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
        const filterListDOM = createFilterDomElement(el, filteredRecipes)
        filterIngredientListSection.appendChild(filterListDOM);
    })
})

filterDeviceInput.addEventListener('keyup', async (event) => {
    filterDeviceListSection.innerHTML = ''
    filteredDevicesToDisplay = filteredDevicesToDisplay.filter(el => {
        return el.toLowerCase().includes(event.target.value)
    });
    filteredDevicesToDisplay.forEach(el => {
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

function getFilteredRecipes(recipes, inputValue) {
    return recipes.filter(recipe => {
        const result = isRecipeIncludingInputValueInNameOrDescription(recipe, inputValue)
        if (result) return recipe
    })
}


// TAGS FUNCTIONS
function setFilterElements(recipes) {
    console.log('RECUPES',recipes)

    recipes.forEach(recipe => {
       // console.log('RECUPE',recipe)

        recipe.ingredients.forEach(ingredient => {
            const ingredientName = ingredient.ingredient
            //console.log('ING', ingredient)
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
            //console.log(filterDomElement)
            //console.log('TOTO', filteredIngredientsToDisplay)

            if(!filteredIngredientsToDisplay.includes(filterDomElement.innerText.toLowerCase())) {
                filterIngredientListSection.appendChild(filterDomElement);
                filteredIngredientsToDisplay.push(filterDomElement.innerText.toLowerCase());
            }
            break;
        case "filterDeviceListSection":
            //console.log('TUTU', filteredDevicesToDisplay)

            if(!filteredDevicesToDisplay.includes(filterDomElement.innerText.toLowerCase() || filterDomElement.innerText)) {
                filterDeviceListSection.appendChild(filterDomElement);
                filteredDevicesToDisplay.push(filterDomElement.innerText.toLowerCase());
            }
            break;
        default:
            //console.log('TATA', filteredUtensilsToDisplay)

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
        // tagSection.classList.add('tag-container')
        // const tag = createTag(filterDomElement.innerText)

        //TODO: refactor
        recipesSection.innerHTML = ""
        recipeSection.classList.add('recipes')

        //GET FILTERED RECIPES
        //console.log('BEFORE', recipes)

        const filteredRecipes = getFilteredRecipes(recipes,  filterDomElement.innerText)
//console.log('AFTER', filteredRecipes)
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

// function createTag(data) {
//     const tagModel = tagFactory(data)
//     return tagModel.getTagDOM()
// }
/*
function toto(tags, tagDOM, data) {
    const array = []
    if (tags.length > 0) {
        tags.forEach( tag => {
            array.push(tag.innerHTML)
        })
        if (!array.includes(data)) {
            tagSection.appendChild(tagDOM)
            filteredRecipes = getFilteredRecipes(filteredRecipes, data.toLowerCase())
            displayRecipes(filteredRecipes,  data.toLowerCase())
            setFilterElements(filteredRecipes)
        }
    } else {
        if (!array.includes(data)) {
            tagSection.appendChild(tagDOM)
            array.push(data)

            filteredRecipes = getFilteredRecipes(filteredRecipes, data.toLowerCase())
            displayRecipes(filteredRecipes,  data.toLowerCase())
            setFilterElements(filteredRecipes)

        }
    }

    if (filterIngredientListSection.classList.contains("display-grid")) {
        tagDOM.classList.add("blue-tag")
    } else if (filterDeviceListSection.classList.contains("display-grid")) {
        tagDOM.classList.add("red-tag")
    } else {
        tagDOM.classList.add("green-tag")
    }
}
*/

// UTILS FUNCTIONS
function isRecipeIncludingInputValueInNameOrDescription(recipe, inputValue) {
   return recipe.name.toLowerCase().includes(inputValue) || recipe.description.toLowerCase().includes(inputValue)
}
