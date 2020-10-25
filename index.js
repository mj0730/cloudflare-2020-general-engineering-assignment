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
    r.get('/.*', () =>
        fetch('https://static-links-page.signalnerve.workers.dev')
    )

    const resp = await r.route(request)
    return resp
}
