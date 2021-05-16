let query = document.getElementById("search")
let bookmarks = document.getElementById("bookmarks")
let result = [];
let ul = document.createElement("ul")
bookmarks.appendChild(ul)

query.addEventListener("input", async () => {
    ul.innerText = ""
    result = []
    if (query.value === "") {
        return
    }
    await chrome.bookmarks.getTree(async (bookmarkTreeNodes) => {
        dumpTreeNodes(bookmarkTreeNodes, query.value).then(()=> {
            showBookmarks()
        })

    })
});

async function dumpTreeNodes(bookmarkNodes, query) {
    if (bookmarkNodes === undefined) {
        return
    }
    for (let i = 0; i < bookmarkNodes.length; i++) {
        let bn = bookmarkNodes[i]
        if (bn.title.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
            result.push(bn)
        }
        await dumpTreeNodes(bn.children, query)
    }
}

function showBookmarks() {
    for (let i = 0; i < result.length; i++) {
        let li = document.createElement('li')
        let a = document.createElement('a')
        a.href = result[i].url
        a.innerText = result[i].title
        a.addEventListener("click", function () {
            chrome.tabs.create({url: result[i].url});
        })
        li.appendChild(a)
        ul.appendChild(li)
    }
}