const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById('search-input')
const filterIngredient = document.getElementById('filter-ingredient')

searchBtn.addEventListener('click', async () => {
    const recipes = await getRecipes()
    await displayData(recipes)
})

filterIngredient.addEventListener('keydown', async (event) => {
    if (event.code === "Enter") {
        await displayFilterList(event.target.value)
        event.target.value = ""
    }
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

function displayData(recipes) {
    const recipeSection = document.getElementById("recipes");
    recipeSection.classList.add('recipes')
    recipes.forEach((recipe) => {
        const recipeModel = recipeFactory(recipe);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipeSection.appendChild(recipeCardDOM);
    });
}

function displayTag(data) {
    const tagSection = document.getElementById("tags");
    tagSection.classList.add('tag-container')
    const tagModel = recipeFactory(data)
    const tagDOM = tagModel.getTagDOM();
    tagSection.appendChild(tagDOM);
}

function displayFilterList(data) {
    const filterListSection = document.getElementById("filter-elements");
    filterListSection.classList.add('display-grid')
    // const filterListModel = filterListFactory(data)
    const filterListModel = recipeFactory(data)
    const filterListDOM = filterListModel.getFilterListDOM();
    filterListDOM.addEventListener('click', () => {
        displayTag(filterListDOM.innerText)
    })
    filterListSection.appendChild(filterListDOM);
}

