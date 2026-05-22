# Politica di sicurezza

## Versioni supportate

Riceve aggiornamenti di sicurezza solo l'ultima versione minore rilasciata del tema.

| Versione | Supportata |
|---------:|:----------:|
| 1.x      | ✅         |
| < 1.0    | ❌         |

## Segnalare una vulnerabilità

**Non aprire issue pubbliche** su GitHub per vulnerabilità non ancora divulgate: l'issue tracker è indicizzato e potrebbe esporre il problema prima che venga risolto.

Scrivi una mail con i dettagli a **loretta.borrelli@yahoo.it** indicando in oggetto `[LiveMuseum security]`. Includi nel messaggio:

1. Descrizione della vulnerabilità e impatto stimato.
2. Passi minimi per riprodurla (proof-of-concept se possibile).
3. Versione del tema e di WordPress su cui hai riprodotto il problema.
4. Eventuali mitigazioni temporanee che hai trovato.

Risposta entro **5 giorni lavorativi** dalla ricezione. Una volta confermata la vulnerabilità verrà:

- preparata una patch su branch privato,
- rilasciata una versione correttiva,
- pubblicato un advisory pubblico (con credito a chi ha segnalato, salvo richiesta di anonimato).

## Ambito

Sono in ambito:

- Codice PHP del tema (`functions.php`, `render.php` dei blocchi).
- Codice JavaScript dei blocchi sotto `src/` e build risultante in `build/`.
- Configurazione di build (`webpack.config.js`, `package.json`) per quanto riguarda dipendenze note con CVE.

Sono **fuori ambito**:

- Vulnerabilità in WordPress core, nel parent theme Twenty Twenty-Five o in plugin di terze parti — vanno segnalate ai rispettivi maintainer.
- Vulnerabilità che richiedono già privilegi di amministratore del sito (un utente con `manage_options` ha per definizione la capacità di modificare il sito).
- Problemi di configurazione del server / hosting su cui il tema è installato.
