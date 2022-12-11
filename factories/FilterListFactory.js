function filterListFactory(data) {
    function getFilterListDOM() {
        const tag = document.createElement('div')
        tag.innerText = data
        return tag
    }
    return {getFilterListDOM}
}
