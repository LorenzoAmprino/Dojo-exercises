// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
const searchResultsSection = document.getElementById('searchResultsSection');
const favoritesList = document.getElementById('favoritesList');
const addToFavoritesBtn = document.getElementById('addToFavoritesBtn');
const bookModal = new bootstrap.Modal(document.getElementById('bookModal'));

// State
let currentBook = null;
let currentUserId = 1; // In a real app, this would come from authentication

// Event Listeners
document.addEventListener('DOMContentLoaded', init);
searchButton.addEventListener('click', searchBooks);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBooks();
});
addToFavoritesBtn.addEventListener('click', addToFavorites);

// Initialize the app
function init() {
    loadFavorites();
}

// Search for books using the OpenLibrary API through our backend
async function searchBooks() {
    const query = searchInput.value.trim();
    if (!query) return;

    try {
        // Show loading state
        searchResults.innerHTML = '<div class="col-12 text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Caricamento...</span></div></div>';
        searchResultsSection.style.display = 'block';

        const response = await fetch(`/api/cerca/libri?titolo=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Errore nella ricerca');

        const data = await response.json();
        displaySearchResults(data.docs || []);
    } catch (error) {
        console.error('Errore durante la ricerca:', error);
        searchResults.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Si è verificato un errore durante la ricerca. Riprova più tardi.
                </div>
            </div>`;
    }
}

// Display search results
function displaySearchResults(books) {
    searchResults.innerHTML = '';

    if (books.length === 0) {
        searchResults.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">Nessun risultato trovato</div>
            </div>`;
        return;
    }

    books.forEach(book => {
        const bookCard = createBookCard(book, false);
        searchResults.appendChild(bookCard);
    });
}

// Create a book card element
function createBookCard(book, isFavorite) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';

    const card = document.createElement('div');
    card.className = 'card h-100 book-card';

    const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : 'https://via.placeholder.com/150x200?text=Copertina+non+disponibile';

    const title = book.title || 'Titolo non disponibile';
    const author = book.author_name ? book.author_name.join(', ') : 'Autore sconosciuto';
    const firstPublishYear = book.first_publish_year || 'N/A';

    card.innerHTML = `
        <div class="position-relative">
            <img src="${coverUrl}" class="card-img-top book-cover" alt="${title}">
            <button class="btn btn-sm btn-${isFavorite ? 'warning' : 'outline-secondary'} favorite-btn"
                    data-book='${JSON.stringify(book).replace(/'/g, '&#39;')}'>
                <i class="bi ${isFavorite ? 'bi-star-fill' : 'bi-star'}"></i>
            </button>
        </div>
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">
                <small class="text-muted">${author}</small><br>
                <small>Anno: ${firstPublishYear}</small>
            </p>
            <button class="btn btn-sm btn-outline-primary view-details"
                    data-book='${JSON.stringify(book).replace(/'/g, '&#39;')}'>
                Dettagli
            </button>
        </div>
    `;

    col.appendChild(card);

    // Add event listeners
    col.querySelector('.view-details').addEventListener('click', () => showBookDetails(book));
    col.querySelector('.favorite-btn').addEventListener('click', (e) => toggleFavorite(e, book));

    return col;
}

// Show book details in modal
function showBookDetails(book) {
    currentBook = book;
    const modalTitle = document.getElementById('bookModalTitle');
    const modalBody = document.getElementById('bookModalBody');

    // Set modal title
    modalTitle.textContent = book.title || 'Titolo non disponibile';

    // Set book details
    document.getElementById('modalBookTitle').textContent = book.title || 'Titolo non disponibile';
    document.getElementById('modalBookAuthor').textContent = book.author_name ? book.author_name.join(', ') : 'Autore sconosciuto';
    document.getElementById('modalBookYear').textContent = book.first_publish_year || 'N/A';
    document.getElementById('modalBookPublisher').textContent = book.publisher ? book.publisher.join(', ') : 'N/A';
    document.getElementById('modalBookIsbn').textContent = book.isbn ? book.isbn[0] : 'N/A';

    // Set cover image
    const coverImg = document.getElementById('modalBookCover');
    if (book.cover_i) {
        coverImg.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
        coverImg.style.display = 'block';
    } else {
        coverImg.style.display = 'none';
    }

    // Show the modal
    bookModal.show();
}

// Add book to favorites
async function addToFavorites() {
    if (!currentBook) return;

    try {
        const response = await fetch(`/api/utenti/${currentUserId}/libreria`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                titolo: currentBook.title,
                autori: currentBook.author_name || [],
                isbn: currentBook.isbn ? currentBook.isbn[0] : '',
                annoPubblicazione: currentBook.first_publish_year || null,
                editore: currentBook.publisher ? currentBook.publisher[0] : '',
                coverId: currentBook.cover_i || null
            })
        });

        if (!response.ok) throw new Error('Errore durante il salvataggio');

        // Update UI
        addToFavoritesBtn.disabled = true;
        addToFavoritesBtn.innerHTML = '<i class="bi bi-check"></i> Aggiunto ai preferiti';

        // Reload favorites list
        loadFavorites();

    } catch (error) {
        console.error('Errore durante il salvataggio:', error);
        alert('Si è verificato un errore durante il salvataggio nei preferiti.');
    }
}

// Toggle favorite status
function toggleFavorite(event, book) {
    event.stopPropagation();

    // Here you would typically call your API to add/remove from favorites
    // For now, just toggle the UI state
    const button = event.currentTarget;
    const isFavorite = button.classList.contains('btn-warning');

    if (isFavorite) {
        // Remove from favorites
        button.classList.remove('btn-warning');
        button.classList.add('btn-outline-secondary');
        button.innerHTML = '<i class="bi bi-star"></i>';
        // Here you would call your API to remove from favorites
    } else {
        // Add to favorites
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-warning');
        button.innerHTML = '<i class="bi bi-star-fill"></i>';
        // Here you would call your API to add to favorites
        addToFavorites(book);
    }
}

// Load user's favorite books
async function loadFavorites() {
    try {
        const response = await fetch(`/api/utenti/${currentUserId}/libreria`);
        if (!response.ok) throw new Error('Errore nel caricamento dei preferiti');

        const favorites = await response.json();
        displayFavorites(favorites);
    } catch (error) {
        console.error('Errore nel caricamento dei preferiti:', error);
        favoritesList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning">
                    Impossibile caricare i preferiti. Riprova più tardi.
                </div>
            </div>`;
    }
}

// Display favorite books
function displayFavorites(favorites) {
    if (!favorites || favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="col-12">
                <p class="text-muted">Nessun libro nei preferiti</p>
            </div>`;
        return;
    }

    favoritesList.innerHTML = '';
    favorites.forEach(book => {
        const favBook = {
            ...book,
            author_name: book.autori,
            first_publish_year: book.annoPubblicazione,
            cover_i: book.coverId,
            isbn: [book.isbn],
            publisher: book.editore ? [book.editore] : []
        };
        const bookCard = createBookCard(favBook, true);
        favoritesList.appendChild(bookCard);
    });
}

// Add Bootstrap Icons
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
document.head.appendChild(link);
