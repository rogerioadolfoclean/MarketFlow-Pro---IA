"""
MarketFlow-Pro - IA
Système de gestion de marketplace avec profils utilisateurs,
preuve sociale et recommandations communautaires.
"""

from flask import Flask, render_template, session, redirect, url_for, request, jsonify
from datetime import datetime
import random
import json

app = Flask(__name__)
app.secret_key = 'marketflow-secret-key-2026'  # NOTE: Change this in production!

# AI Simulation Constants
SIMULATION_NEW_VIEWS_MAX = 5  # Maximum new views per page load
SIMULATION_LIKE_PROBABILITY = 0.3  # 30% chance of new likes
SIMULATION_LIKE_INCREMENT_MAX = 3  # Maximum likes to add
SIMULATION_VOTE_PROBABILITY = 0.2  # 20% chance of new community votes
SIMULATION_VOTE_INCREMENT_MAX = 2  # Maximum votes to add

# Simulated database
users_db = {
    'admin@marketflow.com': {
        'name': 'Marie Dupont',
        'email': 'admin@marketflow.com',
        'membership_level': 'Administrateur',
        'member_since': '2024-01-15'
    },
    'vendor@marketflow.com': {
        'name': 'Jean Martin',
        'email': 'vendor@marketflow.com',
        'membership_level': 'Vendeur Premium',
        'member_since': '2024-06-20'
    },
    'buyer@marketflow.com': {
        'name': 'Sophie Laurent',
        'email': 'buyer@marketflow.com',
        'membership_level': 'Acheteur',
        'member_since': '2025-03-10'
    }
}

# Products with social proof data
products_db = [
    {
        'id': 1,
        'name': 'Ordinateur Portable Pro 15"',
        'description': 'Laptop professionnel haute performance',
        'price': 1299.99,
        'category': 'Électronique',
        'image': 'laptop.jpg',
        'views': 1247,
        'likes': 342,
        'community_votes': 89
    },
    {
        'id': 2,
        'name': 'Smartphone Ultra 5G',
        'description': 'Dernier modèle avec caméra 108MP',
        'price': 899.99,
        'category': 'Électronique',
        'image': 'smartphone.jpg',
        'views': 2156,
        'likes': 521,
        'community_votes': 156
    },
    {
        'id': 3,
        'name': 'Casque Audio Sans Fil',
        'description': 'Réduction de bruit active',
        'price': 249.99,
        'category': 'Audio',
        'image': 'headphones.jpg',
        'views': 876,
        'likes': 234,
        'community_votes': 67
    },
    {
        'id': 4,
        'name': 'Montre Connectée Sport',
        'description': 'Suivi d\'activité et santé',
        'price': 349.99,
        'category': 'Wearables',
        'image': 'smartwatch.jpg',
        'views': 1534,
        'likes': 412,
        'community_votes': 123
    },
    {
        'id': 5,
        'name': 'Tablette Graphique Pro',
        'description': 'Pour artistes et designers',
        'price': 599.99,
        'category': 'Créatif',
        'image': 'tablet.jpg',
        'views': 654,
        'likes': 187,
        'community_votes': 45
    },
    {
        'id': 6,
        'name': 'Caméra 4K Professionnelle',
        'description': 'Vidéo 4K 60fps',
        'price': 1899.99,
        'category': 'Photo/Vidéo',
        'image': 'camera.jpg',
        'views': 432,
        'likes': 98,
        'community_votes': 34
    }
]

# AI-simulated community activity
def simulate_community_activity():
    """Simule l'activité de la communauté sur les produits"""
    for product in products_db:
        # Simulation de nouvelles vues
        product['views'] += random.randint(0, SIMULATION_NEW_VIEWS_MAX)
        
        # Simulation de nouveaux likes
        if random.random() < SIMULATION_LIKE_PROBABILITY:
            product['likes'] += random.randint(1, SIMULATION_LIKE_INCREMENT_MAX)
        
        # Simulation de votes communautaires
        if random.random() < SIMULATION_VOTE_PROBABILITY:
            product['community_votes'] += random.randint(1, SIMULATION_VOTE_INCREMENT_MAX)


@app.route('/')
def index():
    """Page d'accueil avec sélection de profil"""
    return render_template('index.html')


@app.route('/login/<email>')
def login(email):
    """Connexion avec un profil utilisateur"""
    if email in users_db:
        session['user'] = users_db[email]
        return redirect(url_for('dashboard'))
    return redirect(url_for('index'))


@app.route('/logout')
def logout():
    """Déconnexion"""
    session.pop('user', None)
    return redirect(url_for('index'))


@app.route('/dashboard')
def dashboard():
    """Tableau de bord principal avec tous les produits"""
    if 'user' not in session:
        return redirect(url_for('index'))
    
    # Simulate community activity
    simulate_community_activity()
    
    # Trier les produits pour Community Picks (par votes communautaires)
    community_picks = sorted(products_db, key=lambda x: x['community_votes'], reverse=True)[:3]
    
    return render_template('dashboard.html', 
                         user=session['user'],
                         products=products_db,
                         community_picks=community_picks)


@app.route('/api/like/<int:product_id>', methods=['POST'])
def like_product(product_id):
    """API pour liker un produit"""
    if 'user' not in session:
        return jsonify({'error': 'Non autorisé'}), 401
    
    if product_id <= 0:
        return jsonify({'error': 'ID de produit invalide'}), 400
    
    product = next((p for p in products_db if p['id'] == product_id), None)
    if product:
        product['likes'] += 1
        return jsonify({'likes': product['likes']})
    return jsonify({'error': 'Produit non trouvé'}), 404


@app.route('/api/view/<int:product_id>', methods=['POST'])
def view_product(product_id):
    """API pour enregistrer une vue de produit"""
    if product_id <= 0:
        return jsonify({'error': 'ID de produit invalide'}), 400
    
    product = next((p for p in products_db if p['id'] == product_id), None)
    if product:
        product['views'] += 1
        return jsonify({'views': product['views']})
    return jsonify({'error': 'Produit non trouvé'}), 404


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
