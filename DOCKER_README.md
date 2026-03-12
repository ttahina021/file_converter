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
