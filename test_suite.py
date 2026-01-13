"""
Unit tests for MarketFlow-Pro
Tests all major features: profiles, authentication, articles, social interactions, notifications
"""

import unittest
import json
from app import app
from models import db, User, Article, Like, Notification

class MarketFlowTestCase(unittest.TestCase):
    """Test case for MarketFlow-Pro application"""
    
    def setUp(self):
        """Set up test client and database"""
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_marketflow.db'
        self.app = app.test_client()
        
        with app.app_context():
            db.create_all()
    
    def tearDown(self):
        """Clean up after tests"""
        with app.app_context():
            db.session.remove()
            db.drop_all()
    
    def test_01_user_registration(self):
        """Test 1: User registration with different roles"""
        print("\n=== TEST 1: User Registration (Profile System) ===")
        
        # Test Admin registration
        response = self.app.post('/api/auth/register',
            data=json.dumps({
                'username': 'admin_test',
                'email': 'admin@test.com',
                'password': 'admin123',
                'role': 'Administrateur'
            }),
            content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['user']['role'], 'Administrateur')
        print(f"✓ Admin registered: {data['user']['username']}")
        
        # Test Vendeur registration
        response = self.app.post('/api/auth/register',
            data=json.dumps({
                'username': 'vendeur_test',
                'email': 'vendeur@test.com',
                'password': 'vendeur123',
                'role': 'Vendeur'
            }),
            content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['user']['role'], 'Vendeur')
        print(f"✓ Vendeur registered: {data['user']['username']}")
        
        # Test Acheteur registration
        response = self.app.post('/api/auth/register',
            data=json.dumps({
                'username': 'acheteur_test',
                'email': 'acheteur@test.com',
                'password': 'acheteur123',
                'role': 'Acheteur'
            }),
            content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['user']['role'], 'Acheteur')
        print(f"✓ Acheteur registered: {data['user']['username']}")
    
    def test_02_authentication(self):
        """Test 2: User authentication"""
        print("\n=== TEST 2: Authentication ===")
        
        # Register user
        self.app.post('/api/auth/register',
            data=json.dumps({
                'username': 'test_user',
                'email': 'test@test.com',
                'password': 'test123',
                'role': 'Vendeur'
            }),
            content_type='application/json')
        
        # Test login
        response = self.app.post('/api/auth/login',
            data=json.dumps({
                'username': 'test_user',
                'password': 'test123'
            }),
            content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('access_token', data)
        self.assertIn('user', data)
        print(f"✓ Login successful, token received")
        
        return data['access_token']
    
    def test_03_member_level_system(self):
        """Test 3: Member level and XP system"""
        print("\n=== TEST 3: Member Level System ===")
        
        # Register and login
        self.app.post('/api/auth/register',
            data=json.dumps({
                'username': 'level_test',
                'email': 'level@test.com',
                'password': 'test123',
                'role': 'Vendeur'
            }),
            content_type='application/json')
        
        response = self.app.post('/api/auth/login',
            data=json.dumps({
                'username': 'level_test',
                'password': 'test123'
            }),
            content_type='application/json')
        
        token = json.loads(response.data)['access_token']
        
        # Get user info
        response = self.app.get('/api/auth/me',
            headers={'Authorization': f'Bearer {token}'})
        
        data = json.loads(response.data)
        self.assertEqual(data['member_level'], 1)
        self.assertEqual(data['experience_points'], 0)
        print(f"✓ Initial level: {data['member_level']}, XP: {data['experience_points']}")
    
    def test_04_article_creation(self):
        """Test 4: Article creation (Community Database)"""
        print("\n=== TEST 4: Article Creation (Community Database) ===")
        
        token = self.test_02_authentication()
        
        # Create article
        response = self.app.post('/api/articles',
            data=json.dumps({
                'title': 'Test Article',
                'description': 'Test description',
                'price': 99.99,
                'category': 'Électronique'
            }),
            headers={'Authorization': f'Bearer {token}'},
            content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['title'], 'Test Article')
        self.assertEqual(data['price'], 99.99)
        print(f"✓ Article created: {data['title']} - {data['price']}€")
        
        return data['id'], token
    
    def test_05_social_interactions_likes(self):
        """Test 5: Social interactions - Likes"""
        print("\n=== TEST 5: Social Interactions - Likes ===")
        
        article_id, token = self.test_04_article_creation()
        
        # Like article
        response = self.app.post(f'/api/articles/{article_id}/like',
            headers={'Authorization': f'Bearer {token}'})
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['like_count'], 1)
        print(f"✓ Article liked, total likes: {data['like_count']}")
        
        # Try to like again (should fail)
        response = self.app.post(f'/api/articles/{article_id}/like',
            headers={'Authorization': f'Bearer {token}'})
        
        self.assertEqual(response.status_code, 400)
        print(f"✓ Duplicate like prevented")
    
    def test_06_social_interactions_views(self):
        """Test 6: Social interactions - View counter"""
        print("\n=== TEST 6: Social Interactions - View Counter ===")
        
        article_id, token = self.test_04_article_creation()
        
        # Get article (should increment view count)
        initial_response = self.app.get(f'/api/articles/{article_id}')
        initial_data = json.loads(initial_response.data)
        initial_views = initial_data['view_count']
        
        # Get article again
        response = self.app.get(f'/api/articles/{article_id}')
        data = json.loads(response.data)
        
        self.assertEqual(data['view_count'], initial_views + 1)
        print(f"✓ View count incremented: {initial_views} -> {data['view_count']}")
    
    def test_07_article_stats(self):
        """Test 7: Article statistics (Social Proof)"""
        print("\n=== TEST 7: Article Statistics (Social Proof) ===")
        
        article_id, token = self.test_04_article_creation()
        
        # Get stats
        response = self.app.get(f'/api/articles/{article_id}/stats')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('view_count', data)
        self.assertIn('like_count', data)
        self.assertIn('trending_score', data)
        print(f"✓ Stats retrieved: Views={data['view_count']}, Likes={data['like_count']}, Score={data['trending_score']}")
    
    def test_08_notifications(self):
        """Test 8: Notification system"""
        print("\n=== TEST 8: Notification System ===")
        
        token = self.test_02_authentication()
        
        # Get notifications
        response = self.app.get('/api/notifications',
            headers={'Authorization': f'Bearer {token}'})
        
        self.assertEqual(response.status_code, 200)
        notifications = json.loads(response.data)
        self.assertIsInstance(notifications, list)
        print(f"✓ Notifications retrieved: {len(notifications)} notifications")
        
        # Get unread count
        response = self.app.get('/api/notifications/unread-count',
            headers={'Authorization': f'Bearer {token}'})
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('unread_count', data)
        print(f"✓ Unread count: {data['unread_count']}")
    
    def test_09_trending_articles(self):
        """Test 9: Trending articles (Community feature)"""
        print("\n=== TEST 9: Trending Articles (Community) ===")
        
        article_id, token = self.test_04_article_creation()
        
        # Get trending articles
        response = self.app.get('/api/trending')
        
        self.assertEqual(response.status_code, 200)
        articles = json.loads(response.data)
        self.assertIsInstance(articles, list)
        print(f"✓ Trending articles retrieved: {len(articles)} articles")
    
    def test_10_complete_workflow(self):
        """Test 10: Complete user workflow"""
        print("\n=== TEST 10: Complete Workflow ===")
        
        # 1. Register
        response = self.app.post('/api/auth/register',
            data=json.dumps({
                'username': 'workflow_user',
                'email': 'workflow@test.com',
                'password': 'test123',
                'role': 'Vendeur'
            }),
            content_type='application/json')
        self.assertEqual(response.status_code, 201)
        print("✓ 1. User registered")
        
        # 2. Login
        response = self.app.post('/api/auth/login',
            data=json.dumps({
                'username': 'workflow_user',
                'password': 'test123'
            }),
            content_type='application/json')
        token = json.loads(response.data)['access_token']
        print("✓ 2. User logged in")
        
        # 3. Create article
        response = self.app.post('/api/articles',
            data=json.dumps({
                'title': 'Workflow Test Article',
                'description': 'Complete workflow test',
                'price': 199.99,
                'category': 'Test'
            }),
            headers={'Authorization': f'Bearer {token}'},
            content_type='application/json')
        article_id = json.loads(response.data)['id']
        print("✓ 3. Article created")
        
        # 4. Like article
        response = self.app.post(f'/api/articles/{article_id}/like',
            headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 201)
        print("✓ 4. Article liked")
        
        # 5. View article
        response = self.app.get(f'/api/articles/{article_id}')
        self.assertEqual(response.status_code, 200)
        print("✓ 5. Article viewed")
        
        # 6. Check notifications
        response = self.app.get('/api/notifications',
            headers={'Authorization': f'Bearer {token}'})
        notifications = json.loads(response.data)
        self.assertGreater(len(notifications), 0)
        print(f"✓ 6. Notifications received: {len(notifications)}")
        
        # 7. Check trending
        response = self.app.get('/api/trending')
        trending = json.loads(response.data)
        self.assertIsInstance(trending, list)
        print(f"✓ 7. Trending articles: {len(trending)}")
        
        print("\n✅ Complete workflow successful!")


def run_tests():
    """Run all tests"""
    print("\n" + "="*60)
    print("  MARKETFLOW-PRO - SUITE DE TESTS COMPLÈTE")
    print("="*60)
    
    # Create test suite
    suite = unittest.TestLoader().loadTestsFromTestCase(MarketFlowTestCase)
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Summary
    print("\n" + "="*60)
    print("  RÉSUMÉ DES TESTS")
    print("="*60)
    print(f"Tests exécutés: {result.testsRun}")
    print(f"Réussis: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Échecs: {len(result.failures)}")
    print(f"Erreurs: {len(result.errors)}")
    
    if result.wasSuccessful():
        print("\n✅ TOUS LES TESTS SONT RÉUSSIS!")
    else:
        print("\n❌ CERTAINS TESTS ONT ÉCHOUÉ")
    
    return result.wasSuccessful()


if __name__ == '__main__':
    success = run_tests()
    exit(0 if success else 1)
