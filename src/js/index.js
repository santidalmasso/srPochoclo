const load = async() => {

    const API_YTS_URL = 'https://yts.lt/api/v2/list_movies.json'

    const getData = async (url, genre) => {
        const response = await fetch(`${url}?genre=${genre}`)
        const data = await response.json()
        return data
    }
    
    function peliculaItemTemplate(movie) {
        return (`<figure class="pelicula">
                <img src="${movie.medium_cover_image}" alt="">
                <figcaption>${movie.title}</figcaption>
                </figure>`)
    }
    
    function renderMovieList(list, $container){
        
        $container.children[0].remove();
        list.forEach((movie) => {
            const HTMLString = peliculaItemTemplate(movie)
            const movieElement = createTemplate(HTMLString)
            $container.append(movieElement)
        })
    }

    function createTemplate(HTMLString) {
        const html = document.implementation.createHTMLDocument()
        html.body.innerHTML = HTMLString
        return html.body.children[0]
    }

    
    const actionList = await getData(API_YTS_URL, 'action')
    const comedyList = await getData(API_YTS_URL, 'comedy')
    const terrorList= await getData(API_YTS_URL, 'thriller')

    const $actionContainer = document.getElementById('action-container')
    const $comedyContainer = document.getElementById('comedy-container')
    const $terrorContainer = document.getElementById('terror-container')
    
    renderMovieList(actionList.data.movies, $actionContainer)
    renderMovieList(comedyList.data.movies, $comedyContainer)
    renderMovieList(terrorList.data.movies, $terrorContainer)

    
    
}

load()