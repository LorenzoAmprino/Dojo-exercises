# Passo 1: Creare un Endpoint di Ricerca
L'utente deve poter interrogare l'API di OpenLibrary attraverso il nostro backend.

Creare un RestController (es. LibroSearchController).
Definire un endpoint GET, ad esempio /api/cerca/libri.
L'endpoint deve accettare un parametro di ricerca, es. /api/cerca/libri?titolo=Dune.
All'interno di questo endpoint, si dovrà chiamare l'API di OpenLibrary: https://openlibrary.org/search.json?title=Dune

# Passo 2: Creare un Endpoint per Aggiungere il Libro alla Collezione
Una volta che il frontend mostra i risultati, l'utente sceglierà un libro da "importare".

Definire un RestController per l'Utente (es. UtenteController).
Creare un endpoint POST, ad esempio /api/utenti/{utenteId}/libreria.
Il corpo della richiesta (@RequestBody) conterrà i dati essenziali del libro scelto dall'utente (es. titolo, nome autore, ISBN). Questi dati provengono dal risultato della ricerca precedente.

# Passo 4: Logica di Business nel Service
Questo è il cuore dell'esercizio. Il service (UtenteService) che gestisce la richiesta del Passo 3 dovrà:

Trovare l'utente nel database tramite utenteId.
Verificare se l'autore esiste già nel database locale.
Cerca l'autore per nome nel AutoreRepository.
Se non esiste, crea un nuovo oggetto Autore e salvalo.
Verificare se il libro esiste già nel database locale (usando l'ISBN come chiave è una buona idea).
Cerca il libro per ISBN nel LibroRepository.
Se non esiste, crea un nuovo oggetto Libro, collegalo all'autore (trovato o appena creato) e salvalo.
Associare il libro all'utente.
Aggiungi il Libro (trovato o appena creato) alla collezione di libri dell'Utente.
Salva l'oggetto Utente aggiornato. Questo aggiornerà la tabella di join della relazione @ManyToMany.

# Sfide Bonus per i più Esperti
Gestione Duplicati Avanzata: Migliorare la logica per evitare di creare autori duplicati se i nomi sono scritti in modo leggermente diverso.
Salvataggio Copertina: L'API di OpenLibrary fornisce anche le copertine. Aggiungere un campo coverUrl all'entità Libro e popolarlo. L'URL della copertina si costruisce così: https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg.
Paginazione: L'API di OpenLibrary supporta la paginazione (&page=...). Implementare la paginazione anche nel proprio endpoint di ricerca.
Operazioni Asincrone: Se si usa WebClient, implementare l'intero flusso in modo asincrono usando Mono e Flux di Project Reactor.