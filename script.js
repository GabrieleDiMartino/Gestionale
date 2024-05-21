document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('productModal'); // Seleziona il modal
    const addProductBtn = document.getElementById('addProductBtn'); // Seleziona il pulsante "Aggiungi Prodotto"
    const closeBtn = document.getElementsByClassName('close')[0]; // Seleziona l'elemento di chiusura del modal

    // Mostra il modal al click del pulsante "Aggiungi Prodotto"
    addProductBtn.addEventListener('click', function() {
        modal.style.display = 'block'; // Mostra il modal
    });

    // Chiude il modal al click del pulsante "x"
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none'; // Nasconde il modal
    });

    // Chiude il modal al click esterno sulla finestra
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none'; // Nasconde il modal se si clicca fuori dal modal
        }
    });

    // Carica i prodotti dal database
    loadProducts();

    // Gestisce l'invio del modulo
    document.getElementById('productForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Impedisce l'invio del modulo di default

        const formData = new FormData(this); // Crea un oggetto FormData dal modulo

        fetch('server.php', {
            method: 'POST', // Metodo della richiesta
            body: formData // Dati inviati al server
        })
        .then(response => response.text()) // Legge la risposta come testo
        .then(response => {
            alert(response); // Mostra un messaggio di alert con la risposta del server
            loadProducts(); // Ricarica la lista dei prodotti
            modal.style.display = 'none'; // Nasconde il modal
        })
        .catch(error => console.error('Error:', error)); // Mostra un errore in caso di fallimento
    });

    // Funzione per caricare i prodotti dal database
    function loadProducts() {
        fetch('server.php')
            .then(response => response.json()) 
            .then(products => {
                const tbody = document.getElementById('productTable').getElementsByTagName('tbody')[0]; // Seleziona il corpo della tabella
                tbody.innerHTML = ''; // Svuota il corpo della tabella

                // Itera attraverso i prodotti e aggiunge una riga per ciascuno
                products.forEach(product => {
                    const row = tbody.insertRow(); // Inserisce una nuova riga
                    row.innerHTML = `
                        <td>${product.title}</td>
                        <td>${product.price}</td>
                        <td>${product.category}</td>
                        <td><button class="deleteBtn" data-id="${product.id}">Cancella</button></td>
                    `;
                });

                // Attacca l'evento di click per i pulsanti di cancellazione
                document.querySelectorAll('.deleteBtn').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id'); // Ottiene l'ID del prodotto da cancellare
                        fetch('server.php', {
                            method: 'DELETE', // Metodo della richiesta
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded' // Tipo di contenuto
                            },
                            body: `id=${id}` // Dati inviati al server (ID del prodotto)
                        })
                        .then(response => response.text()) // Legge la risposta come testo
                        .then(response => {
                            alert(response); // Mostra un messaggio di alert con la risposta del server
                            loadProducts(); // Ricarica la lista dei prodotti
                        })
                        .catch(error => console.error('Error:', error)); // Mostra un errore in caso di fallimento
                    });
                });
            })
            .catch(error => console.error('Error:', error)); // Mostra un errore in caso di fallimento
    }
});
