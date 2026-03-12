# Dockerisation de File Converter

## Instructions de déploiement

### Prérequis
- Docker installé sur votre machine
- Docker Compose installé

### Démarrage des services

1. **Construire et démarrer tous les services :**
   ```bash
   docker-compose up --build
   ```

2. **Démarrage en arrière-plan :**
   ```bash
   docker-compose up -d --build
   ```

3. **Arrêter les services :**
   ```bash
   docker-compose down
   ```

### Accès aux applications

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000
- **Swagger UI** : http://localhost:5000/swagger

### Architecture des conteneurs

- **backend** : Application .NET 8.0 (port 5000)
- **frontend** : Application Next.js 14 (port 3000)
- **Réseau** : Bridge network pour la communication entre conteneurs

### Configuration

- Le CORS est configuré pour autoriser les requêtes depuis `http://localhost:3000` et `http://frontend:3000`
- Les variables d'environnement sont définies dans le docker-compose.yml
- Les builds sont optimisés avec les fichiers .dockerignore
- **URL API configurée par variable d'environnement** : `NEXT_PUBLIC_API_URL` pointe vers `http://backend:80` dans Docker
- **Variable centralisée** : Tous les appels API utilisent `API_BASE_URL` depuis `frontend/lib/api.ts`

### Variables d'environnement

#### Frontend
- `NODE_ENV=production` : Environnement de production
- `NEXT_PUBLIC_API_URL=http://backend:80` : URL de l'API backend dans Docker

#### Backend
- `ASPNETCORE_ENVIRONMENT=Production` : Environnement de production
- `ASPNETCORE_URLS=http://+:80` : URLs d'écoute

### Dépannage

1. **Vérifier les logs :**
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```

2. **Reconstruire une image spécifique :**
   ```bash
   docker-compose build backend
   docker-compose build frontend
   ```

3. **Nettoyer tout :**
   ```bash
   docker-compose down -v --rmi all
   ```

### Notes importantes

- L'URL API est maintenant entièrement configurable via variable d'environnement
- En développement local, utilisez `NEXT_PUBLIC_API_URL=http://localhost:5000`
- En production Docker, utilisez `NEXT_PUBLIC_API_URL=http://backend:80`
