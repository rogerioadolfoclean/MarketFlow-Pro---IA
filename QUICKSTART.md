# MarketFlow-Pro - Guide de Démarrage Rapide

## Installation Express

### 1. Cloner le repository
```bash
git clone <repository-url>
cd MarketFlow-Pro---IA
```

### 2. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 3. Configuration (optionnel)
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Modifier .env selon vos besoins (optionnel pour le développement)
```

### 4. Démarrer l'application
```bash
python3 app.py
```

L'application sera disponible sur: **http://localhost:5000**

## Ou utiliser le script de setup automatique

```bash
chmod +x setup.sh
./setup.sh
python3 app.py
```

## Comptes de Test

### Utilisateur Administrateur par défaut
- **Username**: admin
- **Password**: admin123

Vous pouvez créer d'autres comptes via l'interface web.

## Tester les Fonctionnalités

### 1. Via l'Interface Web
Ouvrez http://localhost:5000 dans votre navigateur

### 2. Via les Tests Automatiques
```bash
python3 test_suite.py
```

### 3. Via le Script de Démonstration
```bash
python3 test_demo.py
```

## Fonctionnalités Principales

### ✅ Système de Profils
- Créez des comptes avec 3 rôles: Administrateur, Vendeur, Acheteur
- Avatar personnalisé
- Système de niveaux et XP

### ✅ Base de Données Communauté
- Articles partagés
- Système de trending
- Statistiques en temps réel

### ✅ Interaction Sociale
- Likes sur les articles
- Compteur de vues
- Preuve sociale visible

### ✅ Espace Membre
- En-tête avec avatar
- Niveau de membre
- Notifications en temps réel

## Structure du Projet

```
MarketFlow-Pro---IA/
├── app.py                    # Application Flask principale
├── models.py                 # Modèles de base de données
├── requirements.txt          # Dépendances Python
├── setup.sh                  # Script de setup automatique
├── test_suite.py            # Tests unitaires
├── test_demo.py             # Script de démonstration
├── static/
│   ├── index.html           # Interface web
│   └── uploads/             # Fichiers uploadés
├── .env.example             # Exemple de configuration
└── README.md                # Documentation complète
```

## Développement

### Initialiser la base de données manuellement
```bash
python3 -c "from app import app; from models import db; app.app_context().push(); db.create_all()"
```

### Créer un utilisateur admin
```bash
export FLASK_APP=app.py
flask create-admin
```

## Endpoints API Principaux

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/articles` - Liste des articles
- `POST /api/articles` - Créer un article
- `POST /api/articles/:id/like` - Liker un article
- `GET /api/trending` - Articles tendance
- `GET /api/notifications` - Notifications

## Support

Pour plus d'informations, consultez le README.md complet.
