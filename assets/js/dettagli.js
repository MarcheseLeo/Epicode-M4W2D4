const params = new URLSearchParams(window.location.search)
const asin = params.get('id')
const spinner = document.querySelector('.spinner-border')

const toggleSpinnerVisibility =  (boolean) =>{
    if(boolean){
        spinner.classList.remove('d-none')
        spinner.nextSibling.remove('d-none')
    }
    else{
        spinner.classList.add('d-none')
        spinner.nextSibling.remove('d-none')
    }
}

const getBook = async (asin) => {
    toggleSpinnerVisibility(true)
    try {
        const response = await fetch(`https://striveschool-api.herokuapp.com/books/${asin}`)
        return await response.json()
    } catch (e) {
        console.error(e)
    }finally{
        toggleSpinnerVisibility(false)
    }
}
getBook(asin)
    .then(book => {
        document.querySelector('#detail-container').innerHTML += getBookStr(book)
    })
const getBookStr = (book) => {
    return `
            <div class="details-card p-4 p-md-5">
                <div class="row custom-gap g-5 align-items-center">
                    
                    <div class="col-12 col-md-4 text-center">
                        <img src="${book.img}" alt="Copertina di ${book.title}" class="book-cover-large">
                    </div>

                    <div class="col-12 col-md-8">
                        <span class="book-tag mb-3">${book.category}</span>
                        <h1 class="display-5 mb-2">${book.title}</h1>
                        <p class="fs-5 text-muted mb-4">di <span class="fw-bold text-dark">Autore Sconosciuto</span></p>
                        
                        <div class="price-tag mb-4">€ ${book.price.toFixed(2)}</div>
                        
                        <h4 class="serif-font mb-3">Trama</h4>
                        <p class="mb-4" style="line-height: 1.8;">
                            Un capolavoro avvincente che ti terrà incollato fino all'ultima pagina. 
                            <strong>${book.title}</strong> è una lettura imperdibile per tutti gli amanti del genere ${book.category}. 
                            <em>
                        </p>

                        <div class="row mb-4">
                            <div class="col-12 col-sm-6">
                                <h5 class="serif-font mb-3">Dettagli del Libro</h5>
                                <dl class="row details-list">
                                    <dt class="col-sm-5">ASIN / ISBN</dt>
                                    <dd class="col-sm-7">${book.asin}</dd>

                                </dl>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        `
}
console.log(asin)