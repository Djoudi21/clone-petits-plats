function tagFactory(data) {
    function getTagDOM() {
        const tag = document.createElement('div')
        const span = document.createElement('span')
        const closeIcon = document.createElement('img')
        closeIcon.src = '../assets/cancel.png'
        closeIcon.classList.add('cancel-icon')
        closeIcon.addEventListener('click', () => {
            tag.classList.add('hide')
        })
        tag.classList.add('tag', 'flex-center')
        span.innerText = data
        tag.append(span)
        tag.append(closeIcon)
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
