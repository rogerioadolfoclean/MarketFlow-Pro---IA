#!/usr/bin/env python3
"""
Test script to demonstrate MarketFlow-Pro features
"""

import requests
import json
import time

API_URL = 'http://localhost:5000/api'

def print_section(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_registration_and_profiles():
    """Test 1: Système de Profils - Multiple user accounts"""
    print_section("TEST 1: Système de Profils")
    
    users = [
        {"username": "admin1", "email": "admin@test.com", "password": "admin123", "role": "Administrateur"},
        {"username": "vendeur1", "email": "vendeur@test.com", "password": "vendeur123", "role": "Vendeur"},
        {"username": "acheteur1", "email": "acheteur@test.com", "password": "acheteur123", "role": "Acheteur"},
    ]
    
    created_users = []
    
    for user_data in users:
        print(f"\n📝 Création utilisateur: {user_data['username']} ({user_data['role']})")
        response = requests.post(f"{API_URL}/auth/register", json=user_data)
        
        if response.status_code == 201:
            data = response.json()
            print(f"   ✅ Utilisateur créé: ID={data['user']['id']}, Niveau={data['user']['member_level']}")
            created_users.append(user_data)
        else:
            print(f"   ⚠️  {response.json().get('error', 'Utilisateur existe déjà')}")
    
    return created_users

def test_authentication():
    """Test authentication and get tokens"""
    print_section("TEST 2: Authentification")
    
    credentials = {"username": "vendeur1", "password": "vendeur123"}
    print(f"\n🔐 Connexion: {credentials['username']}")
    
    response = requests.post(f"{API_URL}/auth/login", json=credentials)
    
    if response.status_code == 200:
        data = response.json()
        token = data['access_token']
        user = data['user']
        print(f"   ✅ Connexion réussie!")
        print(f"   👤 Utilisateur: {user['username']}")
        print(f"   🏆 Niveau: {user['member_level']}")
        print(f"   ⭐ XP: {user['experience_points']}")
        return token, user
    else:
        print(f"   ❌ Échec: {response.json()}")
        return None, None

def test_article_creation(token):
    """Test 3: Creation of articles (Community Database)"""
    print_section("TEST 3: Base de Données Communauté - Création Articles")
    
    articles = [
        {
            "title": "iPhone 13 Pro Max",
            "description": "Smartphone Apple en excellent état",
            "price": 899.99,
            "category": "Électronique"
        },
        {
            "title": "Nike Air Max 2023",
            "description": "Chaussures de sport neuves, taille 42",
            "price": 149.99,
            "category": "Sport"
        },
        {
            "title": "Canapé 3 places",
            "description": "Canapé en cuir noir, comme neuf",
            "price": 450.00,
            "category": "Maison"
        },
        {
            "title": "Livre Python Programming",
            "description": "Guide complet pour apprendre Python",
            "price": 29.99,
            "category": "Livres"
        },
    ]
    
    headers = {"Authorization": f"Bearer {token}"}
    created_articles = []
    
    for article_data in articles:
        print(f"\n📦 Création article: {article_data['title']}")
        response = requests.post(f"{API_URL}/articles", json=article_data, headers=headers)
        
        if response.status_code == 201:
            article = response.json()
            print(f"   ✅ Article créé: ID={article['id']}, Prix={article['price']}€")
            created_articles.append(article)
        else:
            print(f"   ❌ Erreur: {response.json()}")
    
    return created_articles

def test_social_interactions(token, articles):
    """Test 4: Social interactions - likes and views"""
    print_section("TEST 4: Interaction Sociale - Likes et Vues")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    for article in articles[:2]:  # Like first 2 articles
        article_id = article['id']
        
        # View article (increments view count)
        print(f"\n👁️  Consultation article: {article['title']}")
        view_response = requests.get(f"{API_URL}/articles/{article_id}")
        if view_response.status_code == 200:
            print(f"   ✅ Vue enregistrée")
        
        # Like article
        print(f"❤️  Like article: {article['title']}")
        like_response = requests.post(f"{API_URL}/articles/{article_id}/like", headers=headers)
        if like_response.status_code == 201:
            data = like_response.json()
            print(f"   ✅ Article aimé! Total likes: {data['like_count']}")
        else:
            print(f"   ⚠️  {like_response.json().get('error', 'Erreur')}")
        
        # Get stats
        stats_response = requests.get(f"{API_URL}/articles/{article_id}/stats")
        if stats_response.status_code == 200:
            stats = stats_response.json()
            print(f"   📊 Statistiques:")
            print(f"      - Vues: {stats['view_count']}")
            print(f"      - Likes: {stats['like_count']}")
            print(f"      - Score tendance: {stats['trending_score']}")

def test_member_space(token):
    """Test 5: Member space with notifications and level"""
    print_section("TEST 5: Espace Membre - Avatar, Niveau, Notifications")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get current user info
    print("\n👤 Profil utilisateur:")
    response = requests.get(f"{API_URL}/auth/me", headers=headers)
    if response.status_code == 200:
        user = response.json()
        print(f"   🎯 Username: {user['username']}")
        print(f"   📧 Email: {user['email']}")
        print(f"   🏆 Niveau membre: {user['member_level']}")
        print(f"   ⭐ Points d'expérience: {user['experience_points']} XP")
        print(f"   👤 Avatar: {user['avatar']}")
        print(f"   🔖 Rôle: {user['role']}")
    
    # Get notifications
    print("\n🔔 Notifications:")
    notif_response = requests.get(f"{API_URL}/notifications", headers=headers)
    if notif_response.status_code == 200:
        notifications = notif_response.json()
        print(f"   Total: {len(notifications)} notifications")
        for notif in notifications[:3]:  # Show first 3
            status = "✓" if notif['is_read'] else "✉"
            print(f"   {status} [{notif['type']}] {notif['message']}")
    
    # Get unread count
    unread_response = requests.get(f"{API_URL}/notifications/unread-count", headers=headers)
    if unread_response.status_code == 200:
        count = unread_response.json()
        print(f"   📬 Non lues: {count['unread_count']}")

def test_trending():
    """Test 6: Trending/Community features"""
    print_section("TEST 6: Tendances Communautaires")
    
    print("\n🔥 Articles tendance:")
    response = requests.get(f"{API_URL}/trending")
    if response.status_code == 200:
        articles = response.json()
        print(f"   Total: {len(articles)} articles en tendance")
        for i, article in enumerate(articles[:5], 1):
            print(f"   {i}. {article['title']} - Score: {article['trending_score']}")
            print(f"      👁️ {article['view_count']} vues | ❤️ {article['like_count']} likes")

def test_all_articles():
    """Display all articles"""
    print_section("TEST 7: Liste Complète des Articles")
    
    response = requests.get(f"{API_URL}/articles")
    if response.status_code == 200:
        articles = response.json()
        print(f"\n📦 Total: {len(articles)} articles")
        for article in articles:
            print(f"\n   📌 {article['title']}")
            print(f"      💰 Prix: {article['price']}€")
            print(f"      📁 Catégorie: {article['category']}")
            print(f"      👁️ Vues: {article['view_count']} | ❤️ Likes: {article['like_count']}")

def main():
    print("\n")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║     MARKETFLOW-PRO - TEST DE DÉMONSTRATION COMPLET        ║")
    print("╚════════════════════════════════════════════════════════════╝")
    
    try:
        # Test 1: Create user accounts with different roles
        test_registration_and_profiles()
        
        # Test 2: Authenticate
        token, user = test_authentication()
        if not token:
            print("\n❌ Impossible de continuer sans authentification")
            return
        
        # Test 3: Create articles (populate community database)
        articles = test_article_creation(token)
        
        # Give database a moment to update
        time.sleep(1)
        
        # Test 4: Social interactions (likes and views)
        if articles:
            test_social_interactions(token, articles)
        
        # Give database a moment to update
        time.sleep(1)
        
        # Test 5: Member space features
        test_member_space(token)
        
        # Test 6: Community trending
        test_trending()
        
        # Test 7: All articles
        test_all_articles()
        
        print("\n")
        print("╔════════════════════════════════════════════════════════════╗")
        print("║                    TESTS TERMINÉS ✅                       ║")
        print("╚════════════════════════════════════════════════════════════╝")
        print("\n🌐 Interface web disponible: http://localhost:5000")
        print("📚 Documentation API: README.md")
        
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
