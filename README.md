# 🪐 Solar System 3D

Interaktywna, trójwymiarowa wizualizacja Układu Słonecznego zbudowana w technologii WebGL. Aplikacja pozwala eksplorować planety w czasie rzeczywistym — obracać widok, klikać na planety, czytać ich historię oraz obserwować efekty takie jak cień dnia i nocy na Ziemi, poświata Słońca czy animowane orbity w stylu sci-fi.

## ✨ Co znajdziesz w aplikacji

- **Interaktywna scena 3D** — obracaj i przybliżaj układ za pomocą myszy lub dotyku
- **Planety z teksturami** — Słońce, Merkury, Ziemia (z efektem dnia/nocy), Księżyc, Mars
- **Animowane orbity** — pulsujące linie z podświetleniem w stylu holograficznym
- **Panel informacyjny** — po kliknięciu planety pojawia się opis, statystyki i ciekawostka
- **Storytelling** — rozbudowane karty historyczne z odkryciami, wskaźnikiem zamieszkiwalności i galerią zdjęć
- **Linia odległości** — po wybraniu planety rysuje się linia od Słońca z podaną odległością w km
- **Muzyka ambient** — subtelna muzyka kosmiczna w tle z możliwością wyciszenia
- **Czcionka sci-fi** — interfejs oparty na fontach Orbitron i Exo 2

## 🛠️ Technologie

| Technologia | Opis |
|---|---|
| React 19 + TypeScript | Komponenty UI i logika aplikacji |
| Three.js + React Three Fiber | Renderowanie sceny 3D |
| @react-three/drei | Pomocnicze komponenty 3D (OrbitControls, Html, tekstury) |
| Framer Motion | Animacje przejść UI |
| Tailwind CSS 4 | Stylowanie interfejsu |
| Vite | Szybki bundler i serwer deweloperski |

---

## 🚀 Jak uruchomić aplikację — krok po kroku (dla laika)

### Czego potrzebujesz

Przed startem upewnij się, że masz zainstalowane dwa programy:

1. **Visual Studio Code** — darmowy edytor kodu → [pobierz tutaj](https://code.visualstudio.com/)
2. **Node.js** (wersja 18 lub nowsza) — środowisko uruchomieniowe → [pobierz tutaj](https://nodejs.org/)

> Jak sprawdzić czy Node.js jest zainstalowany? Otwórz terminal i wpisz `node -v`. Jeśli zobaczysz numer wersji (np. `v20.11.0`), wszystko jest w porządku.

---

### Krok 1 — Otwórz folder projektu w VS Code

1. Uruchom **Visual Studio Code**
2. W górnym menu kliknij **File → Open Folder...**
3. Wybierz folder z projektem (np. `solar-system-3d`) i kliknij **Wybierz folder**

---

### Krok 2 — Otwórz terminal w VS Code

1. W górnym menu kliknij **Terminal → New Terminal**
2. Na dole ekranu pojawi się okno terminala — to tutaj będziesz wpisywać polecenia

---

### Krok 3 — Zainstaluj zależności

W terminalu wpisz poniższe polecenie i naciśnij **Enter**:

```bash
npm install
```

> Poczekaj chwilę — Node.js pobierze wszystkie biblioteki potrzebne do działania aplikacji. Może to zająć od kilku sekund do kilku minut.

---

### Krok 4 — Uruchom aplikację

Po zakończeniu instalacji wpisz:

```bash
npm run dev
```

> W terminalu pojawi się adres, np. `http://localhost:5173`

---

### Krok 5 — Otwórz w przeglądarce

1. Przytrzymaj **Ctrl** i kliknij na adres wyświetlony w terminalu (np. `http://localhost:5173`)
2. Aplikacja otworzy się w Twojej domyślnej przeglądarce
3. Gotowe — eksploruj Układ Słoneczny! 🪐

---

### Zatrzymanie aplikacji

Aby wyłączyć serwer, kliknij w okno terminala i naciśnij **Ctrl + C**.

---

## 📁 Struktura projektu

```
solar-system-3d/
├── public/
│   ├── ambient/        # Pliki audio (muzyka tła)
│   └── textures/       # Tekstury planet (PNG)
└── src/
    └── App.tsx         # Cały kod aplikacji
```
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
