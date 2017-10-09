# Front-endowe zadanie: "książki o javascript"


## Treść zadania

1.  Zmień strukturę HTML pliku `static/index.html` oraz napisz odpowiednie reguły CSS, tak 
    aby jak najdokładniej odwzorować wygląd przedstawiony na makietach (patrz katalog
    `screenshots/`).
    
2.  Dodaj do strony zachowania:
    
    1.  Kliknięcie na obraz okładki, powinno powodować pokazanie większego obrazka
        okładki. Obraz ten powinien być na pierwszym planie, to co jest pod spodem
        powinno zostać przesłonięte półprzezroczystym wypełnieniem (patrz przykład: 
        `screenshots/popup.png`).
    
    2.  Zaznaczenie opcji sortowania, powinno zmienić kolejność elementów zgodnie z 
        opisem danej opcji. Nie ma znaczenia czy sortowanie będzie w porządku rosnącym
        czy malejącym.
        
    3.  Wpisanie wartości do filtra, powinno pozostawić widoczne jedynie książki
        spełniające warunek.
        
    4.  Sotrowanie i filtry powinny zostać wyczyszczone po naciśnięciu przycisku
        `wyczyść`. Takie samo zachowanie jest spodziewane po naciśnięciu skrótu
        klawiszowego `[alt] + [r]`
        
    4.  Zaznaczone opcje (sortowanie / filtrowanie) powinny być zachowywane pomiędzy
        odświeżeniami strony. Tj. wybranie sortowania, a potem przeładowanie strony
        powinno skutkować pokazaniem elementów z uwzględnieniem wybranego wcześniej 
        sortowania.

3.  Ewentualnie uzupełnij plik `notes.md`, wpisując tam swoje uwagi/komentarze, tak 
    do zadania, jak i do swojego rozwiązania (np. w jakich przeglądarkach na 100%
    działa, jakie założenia / uproszczenia zostały przyjęte itp.)


## Uwagi

*   Jeśli chcesz to możesz całkowicie przebudować zastany kod / strukturę projektu,
    dodać etap budowania, testów itp.

*   W repozytorium znajduje się plik `/books.json` zawierający te same dane, które
    zostały wpisane w HTML. Możesz go wykorzystać.
    
*   Odradzamy korzystanie z frameworków CSS. Zależy nam tym, żeby zobaczyć Twój kod.

*   Odwzorowanie layoutów nie musi być "pixel-perfect".

*   Głównie zależy nam na dwóch rzeczach: jakości kodu (html/css/js) i końcowym 
    _look-and-feel_.

*   Użyty font to `Lato`.


## Uruchamianie

Wymaganiem jest node.js w wersji 8+.


```bash
$ npm install
$ npm start
```

W konsoli pojawi się komunikat wskazujący pod jakim adresem nasłuchuje serwer.


## Wysłanie rozwiązania

*   Stwórz prywatne repozytorium na [bitbucket.org](https://bitbucket.org)
    
*   W branchu _master_ umieść niezmienioną zawartość tego zadania, a swoją pracę
    w dowolnym innym branchu.
    
*   Otwórz pull-request z brancha z rozwiązaniem do brancha master. Będziemy go 
    oglądać i komentować.

*   Dodaj prawo odczytu do swojego repozytorium użytkownikowi `allegrotech` i dodaj
    go jako review'era pull-request'a.
