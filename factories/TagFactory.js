function tagFactory(data) {
    function getTagDOM() {
        const tag = document.createElement('div')
        tag.innerText = data
        return tag
    }
    return {getTagDOM}
}
