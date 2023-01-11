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
    resetSearchInputValue(searchInput)
})

searchInput.addEventListener('click', async () => {
    await checkInputValueLength()
})

searchInput.addEventListener('keyup', async () => {
    if (searchInput.value.length > 2) searchInput.classList.remove('warning')
})

filterIngredientInput.addEventListener('focus', async (event) => {
    resetSearchInputValue(filterIngredientInput)
    setFilterSectionClassList(filterIngredientListSection, filterDeviceListSection, filterUtensilListSection, 'display-grid')
})

filterDeviceInput.addEventListener('focus', async (event) => {
    resetSearchInputValue(filterDeviceInput)
    setFilterSectionClassList(filterDeviceListSection, filterIngredientListSection, filterUtensilListSection, 'display-grid')
})

filterUtensilInput.addEventListener('focus', async (event) => {
    resetSearchInputValue(filterUtensilInput)
    setFilterSectionClassList(filterUtensilListSection, filterDeviceListSection, filterIngredientListSection, 'display-grid')
})

filterIngredientInput.addEventListener('keyup', async (event) => {
    setFilterSection(filterIngredientListSection, filteredIngredientsToDisplay, (event.target.value), filteredRecipes)
})

filterDeviceInput.addEventListener('keyup', async (event) => {
    setFilterSection(filterDeviceListSection, filteredDevicesToDisplay, (event.target.value), filteredRecipes)
})

filterUtensilInput.addEventListener('keyup', async (event) => {
    setFilterSection(filterUtensilListSection, filteredUtensilsToDisplay, (event.target.value), filteredRecipes)
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
    for (let i=0; i < recipes.length; i++) {
        const recipeModel = recipeFactory(recipes[i]);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipeSection.appendChild(recipeCardDOM);
    }
}

function getFilteredRecipes(recipes, value) {
    let filteredArray = [];
    for (let i=0; i < recipes.length; i++) {
        const result = isRecipeIncludingInputValueInNameOrDescription(recipes[i], value)
        const result2 = isRecipeIncludingInputValueInUstensils(recipes[i], value)
        const result3 = isRecipeIncludingInputValueInDevices(recipes[i], value)
        if (result || result2 || result3) filteredArray.push(recipes[i])
    }
    return filteredArray
}

// TAGS FUNCTIONS
function setFilterElements(recipes) {
    for (let i=0; i < recipes.length; i++) {
        for (let j=0; j < recipes[i].ingredients.length; j++) {
            const ingredientName = recipes[i].ingredients[j].ingredient
            insertFilterElementBySection(ingredientName, "filterIngredientListSection", recipes)
        }

        insertFilterElementBySection(recipes[i].appliance, "filterDeviceListSection", recipes)

        for (let k=0; k < recipes[i].ustensils.length; k++) {
            insertFilterElementBySection(recipes[i].ustensils[k], "filterUtensilListSection", recipes)
        }
    }
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
        const tagDOM = createTag(filterDomElement.innerText)
        setTagDOMClassList(filterIngredientListSection, filterDeviceListSection, tagDOM, 'display-grid','blue-tag', 'red-tag', 'green-tag')
        tagSection.appendChild(tagDOM);
        tagSection.classList.add('tag-container')
        resetInnerHTML(recipesSection)
        recipeSection.classList.add('recipes')
        filteredRecipes = getFilteredRecipes(recipes,  filterDomElement.innerText)
        await displayRecipesAndSetFilter(filteredRecipes)
    })

    return filterDomElement
}

// UTILS FUNCTIONS
function isRecipeIncludingInputValueInNameOrDescription(recipe, value) {
    const lowerCasedValue = value.toLowerCase()
    let newArr = []
    for (let k=0; k < recipe.ingredients.length; k++) {
        newArr.push(recipe.ingredients[k].ingredient.toLowerCase())
    }
   return recipe.name.toLowerCase().includes(lowerCasedValue) || recipe.description.toLowerCase().includes(lowerCasedValue) || newArr.includes(lowerCasedValue)
}

function isRecipeIncludingInputValueInUstensils(recipe, value) {
    const lowerCasedValue = value.toLowerCase()
    let newArr = []
    for (let k=0; k < recipe.ustensils.length; k++) {
        newArr.push(recipe.ustensils[k].toLowerCase())
    }
    return newArr.includes(lowerCasedValue)
}

function isRecipeIncludingInputValueInDevices(recipe, value) {
    if(recipe.appliance.toLowerCase() === value.toLowerCase()) return true
}

function setFilterSectionClassList(sectionToAdd, section1ToRemove, section2ToRemove, classToSet ) {
    if(sectionToAdd.childNodes.length >= 1 && sectionToAdd.childNodes[0].nodeName !== "#text") {
        sectionToAdd.classList.add(classToSet)
        section1ToRemove.classList.remove(classToSet)
        section2ToRemove.classList.remove(classToSet)
    }
}

function setTagDOMClassList(section1, section2, tagDOM, classToCheck, classToAdd1, classToAdd2, classToAdd3 ) {
    if(section1.classList.contains(classToCheck)) {
        tagDOM.classList.add(classToAdd1)
    } else if(section2.classList.contains(classToCheck)) {
        tagDOM.classList.add(classToAdd2)
    } else {
        tagDOM.classList.add(classToAdd3)
    }
}

function setFilter(recipes) {
    setSectionsAndArrays()
    setFilterElements(recipes)
}

function setSectionsAndArrays(){
    resetInnerHTML(filterIngredientListSection)
    resetInnerHTML(filterDeviceListSection)
    resetInnerHTML(filterUtensilListSection)

    filteredIngredientsToDisplay = []
    filteredDevicesToDisplay = []
    filteredUtensilsToDisplay = []
}

function createTag(value) {
    const tagModel = tagFactory(value);
    return tagModel.getTagDOM();
}

async function displayRecipesAndSetFilter(recipes) {
    //CREATE AND DISPLAY RECIPES CARD
    displayRecipes(recipes)

    //SET FILTERS
    setFilter(recipes)
}

async function checkInputValueLength() {
    if (searchInput.value.length < 2) {
        searchInput.focus()
        searchInput.classList.add('warning')
        searchInput.setAttribute("placeholder", "Vous devez entrer un minimum de 3 lettres")
    } else {
        resetInnerHTML(recipesSection)
        recipeSection.classList.add('recipes')
        searchInput.blur()
        //GET RECIPES
        const recipes = await getRecipes()

        //GET FILTERED RECIPES
        filteredRecipes = getFilteredRecipes(recipes,  searchInput.value.trim())

        await checkFilteredRecipesLength()
        resetSearchInputValue(searchInput)
        searchInput.setAttribute("placeholder", "Recherchez par recette, ingredient ou description")
        searchInput.classList.remove('warning')
        searchInput.classList.add('search-bar-border')
    }
}

function resetSearchInputValue(input) {
    input.value = ""
}

function resetInnerHTML(node) {
   node.innerHTML = ""
}

function setFilterSection(section, array, eventValue, recipes) {
    resetInnerHTML(section)
    let filteredArray = [];
    for (let j = 0; j < array.length; j++) {
        if ( array[j].toLowerCase().includes(eventValue.toLowerCase())) filteredArray.push(array[j]);
    }
    for (let i=0; i < filteredArray.length; i++) {
        const filterListDOM = createFilterDomElement(filteredArray[i], recipes)
        section.appendChild(filterListDOM);
    }
}

async function checkFilteredRecipesLength() {
    if (filteredRecipes.length === 0) {
        setSectionsAndArrays()
        const noRecipes = document.createElement("div")
        noRecipes.innerText = "« Aucune recette ne correspond à votre critère… vous pouvez\n" +
            "chercher « tarte aux pommes », « poisson », etc.   "
        recipesSection.append(noRecipes)
    } else {
        await displayRecipesAndSetFilter(filteredRecipes)
    }
}
