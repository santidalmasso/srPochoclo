const load = async() => {

    const API_YTS_URL = 'https://yts.mx/api/v2/list_movies.json'
    const API_USERS_URL = 'https://randomuser.me/api/?inc=name,picture&results='
    
    const getData = async (url, string) => {
        const response = await fetch(url + string)
        const data = await response.json()
        return data
    }
    
    function peliculaItemTemplate(movie, category) {
        return (`<figure class="pelicula" data-id="${movie.id}" data-category="${category}">
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

    function buscadasContainerTemplate() {
        return (`
        <span class="pelicula-subtitulo">Peliculas buscadas</span>
        <h2 class="pelicula-categoria-titulo">Resultados</h2>
        <div class="peliculas-container" id="buscadas-container">
        <img src="src/images/loader.gif" alt="">
        </div>    
        `)
    }

    function renderContainer(list, $container){
        const HTMLString = buscadasContainerTemplate()
        $container.innerHTML = HTMLString
        const $subcontainer = $container.querySelector('#buscadas-container')
        if(list){
            renderMovieList(list, $subcontainer, 'buscadas')
        }else{
            console.log('NO HAY PELICULA');
        }
    }
    
    function renderMovieList(list, $container, category){
        $container.children[0].remove();
        list.forEach((movie) => {
            const HTMLString = peliculaItemTemplate(movie, category)
            const movieElement = createTemplate(HTMLString)
            $container.append(movieElement)
            addEventClick(movieElement)
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
            addEventClick(movieElement)
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

    async function cacheExist(category){
        const listName = `${category}List`
        const cacheList = window.localStorage.getItem(listName)
        if(cacheList){
            return JSON.parse(cacheList)
        }

        const {data: {movies: data}} = await getData(API_YTS_URL, '?genre='+category)
        window.localStorage.setItem(listName,JSON.stringify(data))
        return data
    }

    (()=>{
        setTimeout(window.localStorage.clear,60000)
    })()
    
    const $nuevasPeliculas = document.getElementById('nuevas-peliculas')
    const $actionContainer = document.getElementById('action-container')
    const $comedyContainer = document.getElementById('comedy-container')
    const $terrorContainer = document.getElementById('terror-container')
    const $menuAmigos = document.getElementById('lista-amigos')
    const $header = document.getElementById('header')
    const $form = document.getElementById('form-busqueda')
    const $overlay = document.getElementById('overlay')
    const $modal = document.getElementById('modal')
    const $modalTitle = $modal.querySelector('h1')
    const $modalImage = $modal.querySelector('img')
    const $modalDescription = $modal.querySelector('p')
    const $hideModal = document.getElementById('hide-modal')
    const $containerPeliculas = document.getElementById('section-peliculas')
    const $logoPrincipal = document.getElementById('menu-logo')
    
    var listaBuscadas = {};

    const user = await getUsers(1)
    renderPerfilTemplate(user.results, $header)
    const pelisRecientesList = await getData(API_YTS_URL, `?query_term=${new Date().getFullYear()}&limit=10`)
    renderNewMovies(pelisRecientesList.data.movies ,$nuevasPeliculas)
    const listUsers = await getUsers(10)
    renderFriendsList(listUsers.results, $menuAmigos)
    
    // const {data: {movies: actionList}} = await getData(API_YTS_URL, '?genre=action')
    // window.localStorage.setItem('actionList', JSON.stringify(actionList))
    const actionList = await cacheExist('action')
    renderMovieList(actionList, $actionContainer, 'action')
    // const {data: {movies: comedyList}} = await getData(API_YTS_URL, '?genre=comedy')
    // window.localStorage.setItem('comedyList', JSON.stringify(comedyList))
    const comedyList = await cacheExist('comedy')    
    renderMovieList(comedyList, $comedyContainer, 'comedy')
    // const {data: {movies: terrorList}}= await getData(API_YTS_URL, '?genre=thriller')
    // window.localStorage.setItem('terrorList', JSON.stringify(terrorList))
    const terrorList = await cacheExist('thriller')    
    renderMovieList(terrorList, $terrorContainer, 'terror');
    
    
    $logoPrincipal.addEventListener('click', ()=>{
        deleteChildrens($containerPeliculas)
        window.location.reload();
    })
        
    $form.addEventListener('submit', async (event)=>{
        event.preventDefault()
        
        const data = new FormData($form)
        const movie = data.get('pelicula')
        const {data: {movies: buscadasList }} = await getData(API_YTS_URL,'?query_term='+movie)
        listaBuscadas = buscadasList
        deleteChildrens($containerPeliculas)
        renderContainer(listaBuscadas, $containerPeliculas)
    })
    
    function addEventClick($element) {
        $element.addEventListener('click', () => {
            showModal($element)
        })
    }

    function deleteChildrens($container){
        while ($container.firstChild){
            $container.removeChild($container.firstChild)
        }
    }
    
    function findById(list, id){
        return list.find(movie => movie.id === parseInt(id, 10))
    }
    
    function findMovie(id, category){
        switch(category) {
            case 'action': {return findById(actionList, id)}
            case 'comedy': {return findById(comedyList, id)}
            case 'terror': {return findById(terrorList, id)}
            case 'buscadas': {return findById(listaBuscadas, id)}
            default: return 'No se encontro'
        }
    }
    
    function showModal($element) {
        $overlay.classList.add('active')
        $modal.style.animation = 'modalIn .8s forwards'
        const id = $element.dataset.id
        const category = $element.dataset.category
        const data = findMovie(id, category)
        
        $modalTitle.textContent = data.title
        $modalImage.setAttribute('src', data.medium_cover_image)
        $modalDescription.textContent = data.description_full
    }
    
    function hideModal(){
        $overlay.classList.remove('active')
        $modal.style.animation = 'modalOut .8s forwards'
    }
    
    $hideModal.addEventListener('click', hideModal)
    
}

load()
