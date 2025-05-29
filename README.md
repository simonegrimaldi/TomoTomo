![immagine](images/image_1748502976561.png)
**TomoTomo** è un'app mobile multipiattaforma per gestire la propria libreria personale, pensata per chi ama catalogare, consultare e organizzare i propri libri in modo semplice e intuitivo.
L'app è sviluppata con React Native ed Expo, con persistenza dati locale tramite file.
***
## 🚀 Funzionalità principali

* 📖 Aggiunta e modifica di libri o serie con dettagli come titolo, autore, stato, immagine e descrizione

* 📂 Categorie personalizzabili per organizzare i contenuti

* 🔍 Ricerca dinamica per titolo

* 🗂️ Visualizzazione elenco con copertine

* 📝 Modalità di modifica diretta da una schermata di dettaglio

* 🗑️ Eliminazione immediata di un contenuto
***
## 🛠️ Tecnologie utilizzate

* React Native

* Expo

* AsyncStorage (per gestione dati temporanei)

* Componenti custom React
***
## 📦 Installazione
Assicurati di avere installato Node.js, Git e Expo CLI.

1. Clona il repository
```
git clone https://github.com/simonegrimaldi/TomoTomo.git
cd TomoTomo
```
2. Installa le dipendenze
```
npm install
```
3. Avvia l'app con Expo
```
npx expo start
```
Verrà aperta la dashboard di Expo nel browser. Da lì puoi:

* Avviare l'app su un emulatore Android/iOS

* Usare l'app sul tuo dispositivo reale scansionando il QR code con l'app Expo Go
***
## 📁 Struttura del progetto
```
TomoTomo/
├── assets/                # Immagini e risorse statiche
├── components/            # Componenti riutilizzabili (SearchBar, BookComponent, etc.)
├── navigation/            # Gestione delle schermate e tab
├── screens/               # Singole schermate dell’app
├── seriedb.js             # Gestione SQLite e operazioni DB
├── App.js                 # Entry point dell'app
└── package.json
```
***
## 📄 Licenza
Questo progetto è distribuito sotto licenza MIT.

