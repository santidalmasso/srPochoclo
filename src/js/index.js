const load = async() => {

    const API_YTS_URL = 'https://yts.lt/api/v2/list_movies.json'
    const API_USERS_URL = 'https://randomuser.me/api/?inc=name,picture&results='

    const getData = async (url, string) => {
        const response = await fetch(url + string)
        const data = await response.json()
        return data
    }
    
    function peliculaItemTemplate(movie) {
        return (`<figure class="pelicula">
                <img src="${movie.medium_cover_image}" alt="">
                <figcaption>${movie.title}</figcaption>
                </figure>`)
    }

    function peliculaNuevaTemplate(movie) {
        return(`<li><a href="#">${movie.title_long}</a></li>`)
    }

    function amigoItemTemplate(user){
        return (`<li>
                    <img src="${user.picture.medium}" alt="">
                    <span class="menu-amigos-text">${user.name.first} ${user.name.last}</span>
                </li>`)
    }

    function perfilTemplate(user) {
        return (`<p>
                    <img src="${user.picture.medium}" alt="">
                    ${user.name.first} ${user.name.last}
                </p>`)
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

    function renderNewMovies(list, $container) {
        list.forEach((movie) => {
            const HTMLString = peliculaNuevaTemplate(movie)
            const movieElement = createTemplate(HTMLString)
            $container.append(movieElement)
        })
    }

    function renderPerfilTemplate (list, $container){
        list.forEach((user) => {
            const HTMLString = perfilTemplate(user)
            const perfilElement = createTemplate(HTMLString)
            $container.append(perfilElement)
        })
    }
    
    const getUsers= async (cantidad) => {
        const response = await fetch(API_USERS_URL + cantidad)
        const data = response.json()
        return data
    }

    function renderFriendsList(list, $container) {
        list.forEach((user) => {
            const HTMLString = amigoItemTemplate(user)
            const friendElement = createTemplate(HTMLString)
            $container.append(friendElement)
        })
    }


    const $nuevasPeliculas = document.getElementById('nuevas-peliculas')
    const $actionContainer = document.getElementById('action-container')
    const $comedyContainer = document.getElementById('comedy-container')
    const $terrorContainer = document.getElementById('terror-container')
    const $menuAmigos = document.getElementById('lista-amigos')
    const $header = document.getElementById('header')

    const user = await getUsers(1)
    renderPerfilTemplate(user.results, $header)
    const pelisRecientesList = await getData(API_YTS_URL, '?query_term=2019&limit=10')
    renderNewMovies(pelisRecientesList.data.movies ,$nuevasPeliculas)
    const listUsers = await getUsers(10)
    renderFriendsList(listUsers.results, $menuAmigos)
    
    const actionList = await getData(API_YTS_URL, '?genre=action')
    renderMovieList(actionList.data.movies, $actionContainer)
    const comedyList = await getData(API_YTS_URL, '?genre=comedy')
    renderMovieList(comedyList.data.movies, $comedyContainer)
    const terrorList= await getData(API_YTS_URL, '?genre=thriller')
    renderMovieList(terrorList.data.movies, $terrorContainer)
    
    


    
    
}

load()