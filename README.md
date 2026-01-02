# MarketFlow-Pro - IA

Système intelligent de marketplace avec gestion multi-utilisateurs, preuve sociale et recommandations communautaires.

## Fonctionnalités

### 1. Header de Session
Chaque utilisateur a maintenant son espace personnel avec :
- Nom complet
- Email
- Niveau de membre (Administrateur, Vendeur Premium, Acheteur)
- L'application s'adapte à l'utilisateur connecté

### 2. Social Proof (Preuve Sociale)
- **Compteurs de vues** : Nombre de fois qu'un produit a été consulté
- **Compteurs de likes** : Nombre d'utilisateurs qui ont aimé le produit
- Affichage en temps réel dans l'interface
- Crée une confiance d'achat en montrant l'activité des autres membres

### 3. Community Picks (Choix de la Communauté)
- Section dédiée aux produits "Populaires dans la communauté"
- Affichage du top 3 des produits les plus votés
- L'IA simule un réseau d'utilisateurs qui votent pour les meilleurs produits
- Badge doré pour les produits populaires

## Profils Disponibles

### Administrateur
- **Nom** : Marie Dupont
- **Email** : admin@marketflow.com
- **Niveau** : Administrateur

### Vendeur
- **Nom** : Jean Martin
- **Email** : vendor@marketflow.com
- **Niveau** : Vendeur Premium

### Acheteur
- **Nom** : Sophie Laurent
- **Email** : buyer@marketflow.com
- **Niveau** : Acheteur

## Installation

1. Installer les dépendances :
```bash
pip install -r requirements.txt
```

2. Lancer l'application :
```bash
python app.py
```

3. Ouvrir le navigateur à l'adresse :
```
http://localhost:5000
```

## Utilisation

1. Sur la page d'accueil, sélectionnez un profil utilisateur
2. Vous serez redirigé vers le tableau de bord personnalisé
3. Consultez les "Choix de la Communauté" en haut de page
4. Parcourez tous les produits avec leurs statistiques sociales
5. Cliquez sur ❤️ pour liker un produit
6. Cliquez sur "Voir les détails" pour consulter un produit (incrémente les vues)

## Simulation IA

L'application simule l'activité d'une communauté d'utilisateurs :
- Nouvelles vues sur les produits (0-5 par refresh)
- Nouveaux likes (probabilité de 30% par refresh)
- Nouveaux votes communautaires (probabilité de 20% par refresh)

Cette simulation crée un environnement dynamique et engageant pour démontrer les fonctionnalités sociales.

## Technologies

- **Backend** : Python Flask
- **Frontend** : HTML5, CSS3, JavaScript
- **Session** : Flask-Session
- **Design** : CSS moderne avec gradients et animations

## Structure du Projet

```
MarketFlow-Pro---IA/
├── app.py                 # Application Flask principale
├── requirements.txt       # Dépendances Python
├── templates/
│   ├── index.html        # Page de connexion
│   └── dashboard.html    # Tableau de bord
├── static/
│   ├── css/
│   │   └── style.css     # Styles CSS
│   └── js/
│       └── app.js        # JavaScript client
└── README.md             # Documentation
```
