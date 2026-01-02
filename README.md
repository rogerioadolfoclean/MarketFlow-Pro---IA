# MarketFlow-Pro - IA

Une plateforme de marketplace intelligente avec système de profils utilisateurs, interaction sociale et base de données communautaire.

## 🌟 Fonctionnalités

### 1. Système de Profils
- **Gestion de plusieurs comptes utilisateurs** avec trois rôles :
  - 🔑 **Administrateur** : Gestion complète de la plateforme
  - 🏪 **Vendeur** : Création et gestion d'articles
  - 🛒 **Acheteur** : Navigation et interaction avec les articles

### 2. Base de Données "Communauté"
- Visualisation des tendances communautaires
- Articles triés par popularité et score de tendance
- Simulation IA pour démontrer les interactions communautaires
- Algorithme de trending basé sur les vues, likes et récence

### 3. Interaction Sociale (Preuve Sociale)
- ❤️ Système de "likes" sur les articles
- 👁️ Compteur de vues pour chaque article
- Statistiques sociales visibles sur chaque article
- Notifications en temps réel pour les interactions

### 4. Espace Membre
- 👤 **Avatar personnalisé** pour chaque utilisateur
- 🏆 **Système de niveaux** basé sur l'expérience (XP)
- 🔔 **Notifications** avec badge de compteur
- En-tête avec informations complètes du profil

## 🚀 Installation

### Prérequis
- Python 3.8+
- pip

### Installation des dépendances

```bash
pip install -r requirements.txt
```

### Configuration

1. Créer un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

2. Modifier les variables dans `.env` selon vos besoins.

### Initialisation de la base de données

```bash
# Initialiser la base de données
python app.py

# Ou utiliser Flask CLI
export FLASK_APP=app.py
flask init-db

# Créer un utilisateur administrateur (optionnel)
flask create-admin
```

## 📖 Utilisation

### Démarrer le serveur

```bash
python app.py
```

Le serveur sera accessible sur `http://localhost:5000`

### Accéder à l'interface web

Ouvrez votre navigateur et allez sur `http://localhost:5000`

### Utilisation de l'API

L'API REST est disponible sur `http://localhost:5000/api`

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Créer un nouveau compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Obtenir l'utilisateur actuel

### Utilisateurs
- `GET /api/users/<id>` - Obtenir un profil utilisateur
- `PUT /api/users/<id>` - Mettre à jour un profil
- `POST /api/users/<id>/avatar` - Uploader un avatar

### Articles
- `GET /api/articles` - Liste tous les articles
- `GET /api/articles/<id>` - Obtenir un article (incrémente les vues)
- `POST /api/articles` - Créer un article
- `PUT /api/articles/<id>` - Mettre à jour un article
- `DELETE /api/articles/<id>` - Supprimer un article

### Interactions Sociales
- `POST /api/articles/<id>/like` - Aimer un article
- `DELETE /api/articles/<id>/unlike` - Retirer le like
- `GET /api/articles/<id>/stats` - Statistiques d'un article

### Tendances & Communauté
- `GET /api/trending` - Obtenir les articles tendance
- `POST /api/trending/simulate` - Simuler des données communautaires (Admin uniquement)

### Notifications
- `GET /api/notifications` - Liste des notifications
- `PUT /api/notifications/<id>/read` - Marquer comme lu
- `GET /api/notifications/unread-count` - Nombre de notifications non lues

## 💡 Fonctionnement du Système

### Système de Niveaux
- Les utilisateurs gagnent de l'XP pour leurs actions :
  - Créer un article : +10 XP
  - Liker un article : +1 XP
- Niveau = (XP / 100) + 1
- Les utilisateurs reçoivent une notification lors d'un changement de niveau

### Score de Tendance
Le score de tendance est calculé selon la formule :
```
score = (vues × 0.3 + likes × 2) × facteur_temps × 10
```
où le facteur_temps diminue avec l'âge de l'article.

### Système de Notifications
Les utilisateurs reçoivent des notifications pour :
- Nouveaux likes sur leurs articles
- Changements de niveau
- Messages système

## 🔒 Sécurité

- Authentification JWT
- Hash des mots de passe avec Werkzeug
- Validation des rôles et permissions
- Protection CORS configurée

## 📁 Structure du Projet

```
MarketFlow-Pro---IA/
├── app.py                  # Application Flask principale
├── models.py              # Modèles de base de données
├── requirements.txt       # Dépendances Python
├── .env.example          # Exemple de configuration
├── .gitignore            # Fichiers ignorés par Git
├── static/
│   ├── index.html        # Interface web
│   └── uploads/          # Fichiers uploadés
└── README.md             # Ce fichier
```

## 🎨 Interface Utilisateur

L'interface web inclut :
- **En-tête membre** : Avatar, niveau, XP, notifications
- **Section création** : Formulaire pour créer des articles
- **Section tendances** : Articles les plus populaires
- **Section articles** : Tous les articles avec statistiques sociales
- **Modals** : Connexion et inscription

## 🔄 Workflow Typique

1. **Inscription** : L'utilisateur crée un compte avec un rôle
2. **Connexion** : Authentification et réception du token JWT
3. **Création d'article** : Le vendeur publie un article (+10 XP)
4. **Interaction** : Les acheteurs voient et likent les articles (+1 XP)
5. **Notifications** : Les vendeurs sont notifiés des likes
6. **Niveau** : Les utilisateurs progressent et montent de niveau
7. **Tendances** : Les articles populaires apparaissent dans les tendances

## 🛠️ Technologies Utilisées

- **Backend** : Flask, SQLAlchemy, Flask-JWT-Extended
- **Base de données** : SQLite (peut être changé pour PostgreSQL/MySQL)
- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **Sécurité** : Werkzeug, JWT

## 📝 License

MIT License
