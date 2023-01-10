function recipeFactory(data) {
    const {name, time, ingredients, unit, description} = data
    function getRecipeCardDOM() {
        const article = document.createElement('div')
        article.classList.add('card-container')
        const img = document.createElement('img')
        img.setAttribute('src', '../img.jpg')
        img.classList.add('img-card')
        article.append(img)

        // HEADER
        const infosContainer = document.createElement('div')
        const infosHeader = document.createElement('div')
        infosHeader.classList.add('flex-between', 'py-10', 'mb-10')
        const title = document.createElement('h4')
        title.classList.add('ingredient-title')
        title.innerText = `${name}`
        const timeContainer = document.createElement('div')
        const clockLogo = document.createElement('img')
        clockLogo.src = '../assets/clock.png'
        clockLogo.classList.add('clock-icon')
        const timeValue = document.createElement('span')
        timeValue.innerText = `${time}mn`

        // CONTENT
        const infosContent = document.createElement('div')
        infosContent.classList.add('flex-start', 'gap-10', 'py-10')
        const ingredientsList = document.createElement('ul')
        ingredients.map(ingredient => {
            const element = document.createElement('li')
            element.classList.add('ingredient-list-element')
            const spanIngredient = document.createElement('span')
            spanIngredient.classList.add('bold')
            spanIngredient.innerText = `${ingredient.ingredient}`
            const spanQuantity = document.createElement('span')
            if(ingredient.unit === undefined && ingredient.quantity === undefined) {
                spanQuantity.innerText = ``
            } else if (ingredient.unit === undefined && ingredient.quantity !== undefined) {
                spanQuantity.innerText = `: ${ingredient.quantity}`
            } else {
                spanQuantity.innerText = `: ${ingredient.quantity} ${ingredient.unit}`
            }
            element.append(spanIngredient)
            element.append(spanQuantity)
            ingredientsList.append(element)
        })

        const ingredientDescription = document.createElement('p')
        ingredientDescription.classList.add('ingredient-description')
        ingredientDescription.innerText = `${description}`


        infosHeader.append(title)
        timeContainer.append(clockLogo)
        timeContainer.append(timeValue)
        infosHeader.append(timeContainer)
        infosContainer.append(infosHeader)
        infosContainer.append(infosContent)
        infosContent.append(ingredientsList)
        infosContent.append(ingredientDescription)
        article.append(img)
        article.append(infosContainer)
        return article
    }

    return {getRecipeCardDOM}
}
