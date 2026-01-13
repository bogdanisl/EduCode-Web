# Frontend aplikacji edukacyjnej Educode

Frontend aplikacji internetowej wspierającej naukę programowania. Projekt został zrealizowany z wykorzystaniem biblioteki **React** oraz narzędzia **Vite**, które zapewnia szybkie uruchamianie środowiska deweloperskiego i efektywny proces budowania aplikacji.

Frontend komunikuje się z backendem poprzez REST API i odpowiada za warstwę prezentacji oraz interakcję z użytkownikiem.

---

## 🛠️ Wykorzystane technologie

- React
- Vite
- TypeScript
- HTML5
- CSS
- Tailwind
---

## 📦 Wymagania

Przed uruchomieniem projektu wymagane są:

- **Node.js** (wersja 18 lub nowsza)
- **npm** lub **yarn**

Sprawdzenie wersji:
```bash
node -v
npm -v
```

---

## 🚀 Instalacja i uruchomienie

### 1️⃣ Klonowanie repozytorium

```bash
git clone https://github.com/bogdanisl/EduCode-Web
cd EduCode-Web
```

### 2️⃣ Instalacja zależności
```bash
npm install
```
lub
```bash
yarn install
```

### ⚙️ Konfiguracja API

Adres backendu jest konfigurowany w pliku środowiskowym .env:
```env
VITE_API_URL=http://localhost:3333
```

⚠️ **Backend musi być uruchomiony, aby aplikacja działała poprawnie.**

Repozytorium backendu:

👉 https://github.com/bogdanisl/EduCode-Server

### 3️⃣ Uruchomienie aplikacji

Uruchom aplikację w trybie deweloperskim:
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem:

http://localhost:5173

---

## 🔐 Role użytkowników

Po pierwszym uruchomieniu aplikacji **pierwsze utworzone konto użytkownika automatycznie otrzymuje rolę administratora**.

Każde kolejne konto rejestrowane w systemie otrzymuje domyślnie rolę **zwykłego użytkownika (`user`)**.

Mechanizm ten umożliwia szybkie zainicjalizowanie systemu bez konieczności ręcznego przypisywania roli administratora w bazie danych.


---



## 📄 Informacje dodatkowe

Projekt został zrealizowany jako część pracy dyplomowej i stanowi warstwę frontendową aplikacji internetowej do wspomagania nauki programowania