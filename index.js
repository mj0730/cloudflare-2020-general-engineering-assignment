const Router = require('./router')

const DOMAIN = 'https://example.com'

const links = [
    { name: 'React', url: 'https://reactjs.org' },
    { name: 'Angular', url: 'https://angularjs.org' },
    { name: 'Vue', url: 'https://vuejs.org' },
]

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handler(request) {
    const init = {
        headers: { 'content-type': 'application/json' },
    }
    const body = JSON.stringify(links)
    return new Response(body, init)
}

async function handleRequest(request) {
    const r = new Router()
    r.get('/links', request => handler(request))
    r.get('/.*', () => addLinks())

    const resp = await r.route(request)
    return resp
}

async function addLinks() {
    const html = await fetch(
        'https://static-links-page.signalnerve.workers.dev'
    )

    return new HTMLRewriter()
        .on('#links', new LinksTransformer(links))
        .transform(html)
}

class LinksTransformer {
    constructor(links) {
        this.links = links
    }

    element(element) {
        this.links.forEach(link =>
            element.append(`<a href=${link.url}>${link.name}</a>`, {
                html: true,
            })
        )
    }
}
