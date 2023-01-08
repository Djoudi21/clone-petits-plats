function tagFactory(data) {
    function getTagDOM() {
        const tag = document.createElement('div')
        tag.classList.add('tag', 'flex-center')
        tag.innerText = data
        return tag
    }

    function getFilterDomElement() {
        const tag = document.createElement('div')
        tag.classList.add('tag-container')
        tag.innerText = data
        return tag
    }

    return {getTagDOM, getFilterDomElement}
}
