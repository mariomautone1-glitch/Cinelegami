# CineLegami

Scegli un film e guarda come è legato ad altri film attraverso registi e attori.
Tocca un nome per vedere altri film di quella persona, tocca un film per aprirlo.

## Come funziona

Pagina statica (un solo file, `index.html`) che interroga il database TMDB direttamente dal browser.
Ogni visitatore inserisce la propria chiave TMDB gratuita, che resta salvata solo nel suo browser.

## Pubblicazione su GitHub Pages

1. Crea un nuovo repository pubblico su GitHub (per esempio `cinelegami`).
2. Carica `index.html` e `README.md` (Add file, Upload files).
3. Vai in Settings, Pages, scegli "Deploy from a branch", branch `main`, cartella `/ (root)`, poi Save.
4. Dopo uno o due minuti il sito è su `https://TUO-UTENTE.github.io/cinelegami/`.

## Dati

Dati e immagini: [TMDB](https://www.themoviedb.org/).
This product uses the TMDB API but is not endorsed or certified by TMDB.

La chiave gratuita di TMDB è per uso non commerciale. Prima di monetizzare l'app serve
una licenza commerciale concordata con TMDB e una chiave tenuta su un piccolo servizio
(backend), non nella pagina.
