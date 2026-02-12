# Convertisseur JSON vers Excel

Application complète pour convertir des fichiers JSON en Excel avec une interface web moderne.

## Architecture

- **Frontend**: Next.js 14 avec TypeScript
- **Backend**: .NET 8.0 Web API

## Démarrage rapide

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible sur [http://localhost:3000](http://localhost:3000)

### Backend

```bash
cd backend
dotnet restore
dotnet run
```

Le backend sera accessible sur [http://localhost:5000](http://localhost:5000)

## Fonctionnalités

- Upload de fichiers JSON
- Conversion automatique en Excel (.xlsx)
- Téléchargement du fichier converti
- Interface utilisateur moderne et intuitive

## Structure du projet

```
file_converter/
├── frontend/          # Application Next.js
│   ├── app/          # Pages et composants
│   └── package.json
└── backend/          # API .NET
    ├── Controllers/  # Contrôleurs API
    └── FileConverter.csproj
```

