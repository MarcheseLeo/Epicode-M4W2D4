const urlBaseApi = 'https://striveschool-api.herokuapp.com/books'

const getBooks = async () => {
    try {
        const response = await fetch(urlBaseApi)
        return response.json()
    } catch (e) {
        console.error(e)
    }
}

const generateCard = (book) => {
    return `
        <div class="col book-item" data-book-id="${book.asin}">
            <div class="book-card h-100 p-3 d-flex gap-3">
                <img src="${book.img}" alt="Cover" class="book-cover">
                <div class="d-flex flex-column justify-content-between w-100">
                    <div>
                        <h5 class="serif-font fw-bold mb-1 fs-5">${book.title}</h5>
                        <p class="text-muted small mb-2">Andy Weir</p>
                        <span class="book-tag">${book.category}</span>
                    </div>
                    <div class="mt-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div class="book-price">€ ${book.price}</div>
                            <a href="./dettagli.html?id=${book.asin}" class="text-decoration-none small fw-bold" style="color: var(--accent-color);">Dettagli &rarr;</a>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-add flex-grow-1" onclick="addToCart(this)">Aggiungi</button>
                            <button class="btn btn-hide px-3" onclick="hideBook(this)">Nascondi</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

const renderBooks = (htmlStr) => {
    const container = document.getElementById('bookCardsContainer')
    container.innerHTML = htmlStr
}
// Stato del Carrello
let cart = [];
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalElement = document.getElementById('cart-total');

const renderCart = () => {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-muted text-center pt-5">Il carrello è vuoto.</p>';
        cartTotalElement.innerText = '€ 0.00';
        return;
    }

    cartItemsContainer.innerHTML = cart.reduce((acc, item, index) => {
        total += item.price;
        acc += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h6 class="mb-0 fw-bold fs-6 serif-font">${item.title}</h6>
                        <small class="text-muted">${item.author}</small>
                        <div class="fw-bold fs-6 mt-1 text-accent">€ ${item.price.toFixed(2)}</div>
                    </div>
                    <button class="cart-delete-btn" onclick="removeFromCart(${index}, '${item.asin}')" title="Rimuovi dal carrello">×</button>
                </div>
            `;
        return acc
    }, '');

    cartTotalElement.innerText = `€ ${total.toFixed(2)}`;
}

const addToCart = (button) => {
    const bookCol = button.closest('.book-item');
    const bookCard = button.closest('.book-card');
    const title = bookCol.querySelector('h5').innerText;
    const author = bookCol.querySelector('p.text-muted').innerText;
    const priceText = bookCol.querySelector('.book-price').innerText;
    const price = parseFloat(priceText.replace('€ ', '').replace(',', '.'));
    const asin = bookCol.getAttribute('data-book-id')

    const filter = cart.filter(el => el.asin == asin)
    if (filter.length == 0) {
        const book = { title, author, price, asin };
        cart.push(book);
        bookCard.classList.add('added-to-cart')
        button.classList.add('added')
        button.innerText = 'Aggiunto'
        renderCart();
    }

}

const removeFromCart = (index, asin) => {
    const card = document.querySelector(`#bookCardsContainer .col[data-book-id="${asin}"] .book-card`)
    const button = document.querySelector(`#bookCardsContainer .col[data-book-id="${asin}"] .btn-add`)
    card.classList.remove('added-to-cart')
    button.classList.remove('added')
    button.innerText = 'Aggiungi'
    const cartItemEl = cartItemsContainer.children[index];
    cartItemEl.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    cartItemEl.style.opacity = "0";
    cartItemEl.style.transform = "translateX(20px)";
    setTimeout(() => {
        cart.splice(index, 1);
        renderCart();
    }, 200);
}

const hideBook = (button) => {
    const cardContainer = button.closest('.book-item');
    cardContainer.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    cardContainer.style.opacity = "0";
    cardContainer.style.transform = "scale(0.9)";
    setTimeout(() => {
        cardContainer.style.display = "none";
    }, 300);
}
const callAPi = async () => {
    getBooks()
        .then(books => {
            console.log(books)
            const htmlStr = books.reduce((acc, book) => {
                acc += generateCard(book)
                return acc
            }, '')
            renderBooks(htmlStr)
        })

}

const search = (input) => {
    if (input.value.length >= 3) {
        getBooksFiltered(input.value)
    } else {
        clearScreen()
        callAPi()
    }
}

const clearScreen = () => {
    const container = document.getElementById('bookCardsContainer')
    container.innerHTML = ''
}
const getBooksFiltered = async (input) => {
    getBooks()
        .then(books => {
            const filter = books.filter(book => {
                if (book.title.toLowerCase().startsWith(input.toLowerCase()))
                    return book
            })
            const htmlStr = filter.reduce((acc, book) => {
                acc += generateCard(book)
                return acc
            }, '')
            clearScreen()
            renderBooks(htmlStr)
        })
}

callAPi()

