# MiniWMS
Internetowy system do zarządzania wyposażeniem i ewidencją sprzętu, zbudowany z wykorzystaniem React, Node.js oraz MySQL.
## Demo
🌐 https://mini-wms.pl

## Dostęp do wersji demonstracyjnej
Dane logowania do konta demonstracyjnego są dostępne w CV lub mogą zostać udostępnione na życzenie.

## Funkcjonalności
* Logowanie użytkowników
* Obsługa sesji przy użyciu ciasteczek HttpOnly
* Zabezpieczenie CSRF
* Dodawanie i edycja przedmiotów
* Przesyłanie zdjęć
* Zarządzanie lokalizacjami i serwisami
* Archiwizacja oraz przywracanie przedmiotów
* Panel statystyk
* Walidacja formularzy
* Responsywny interfejs
* Automatyczny codzienny reset danych demonstracyjnych

## Technologie
### Frontend
* React
* Vite
* TailwindCSS
* React Router
* Recharts
* Framer Motion

### Backend
* Node.js
* Express
* MySQL

### Bezpieczeństwo
* Helmet
* Ochrona CSRF
* Ciasteczka HttpOnly
* Rate limiting

### Wdrożenie
* VPS (Ubuntu)
* Apache Reverse Proxy
* PM2
* HTTPS (Let's Encrypt)

## Struktura projektu
```text
mini-wms
│
├── mini-wms-frontend
└── mini-wms-backend
```

## Instalacja
### Frontend
```bash
cd mini-wms-frontend
npm install
npm run dev
```

### Backend
```bash
cd mini-wms-backend
npm install
node server.js
```

## Zmienne środowiskowe
### Frontend
```env
VITE_API_BASE=
```

### Backend
```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
PORT=
NODE_ENV=
WEB_ORIGIN=
SESSION_COOKIE_NAME=
CSRF_COOKIE_NAME=
```

Dane demonstracyjne są przywracane automatycznie przy użyciu plików JSON oraz zaplanowanego resetu bazy danych.

## Struktura bazy danych
Struktura bazy danych jest dostępna w pliku:
```text
mini-wms-backend/schema.sql
```

## Wdrożenie
Aplikacja została wdrożona na serwerze VPS z systemem Ubuntu.
Wykorzystane usługi:
* Apache
* PM2
* MySQL
* Let's Encrypt
