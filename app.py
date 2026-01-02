import os
import random
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

from models import db, User, Article, Like, Notification

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///marketflow.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'static/uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # Create new user
    user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'Acheteur')  # Default to Acheteur
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Create welcome notification
    notification = Notification(
        user_id=user.id,
        message=f"Bienvenue sur MarketFlow-Pro, {user.username}!",
        type='system'
    )
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict()
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 200


@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current authenticated user"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200


# ============================================================================
# USER PROFILE ROUTES
# ============================================================================

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get user profile"""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200


@app.route('/api/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """Update user profile"""
    current_user_id = get_jwt_identity()
    
    if current_user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    if data.get('email'):
        user.email = data['email']
    if data.get('member_level'):
        user.member_level = data['member_level']
    
    db.session.commit()
    
    return jsonify(user.to_dict()), 200


@app.route('/api/users/<int:user_id>/avatar', methods=['POST'])
@jwt_required()
def upload_avatar(user_id):
    """Upload user avatar"""
    current_user_id = get_jwt_identity()
    
    if current_user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(f"avatar_{user_id}_{datetime.utcnow().timestamp()}.{file.filename.rsplit('.', 1)[1].lower()}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        user.avatar = filename
        db.session.commit()
        
        return jsonify({
            'message': 'Avatar uploaded successfully',
            'avatar': filename
        }), 200
    
    return jsonify({'error': 'Invalid file type'}), 400


# ============================================================================
# ARTICLE/PRODUCT ROUTES
# ============================================================================

@app.route('/api/articles', methods=['GET'])
def get_articles():
    """Get all articles with optional filtering"""
    category = request.args.get('category')
    sort_by = request.args.get('sort_by', 'trending')  # trending, recent, popular
    
    query = Article.query
    
    if category:
        query = query.filter_by(category=category)
    
    if sort_by == 'trending':
        query = query.order_by(Article.trending_score.desc())
    elif sort_by == 'recent':
        query = query.order_by(Article.created_at.desc())
    elif sort_by == 'popular':
        query = query.order_by(Article.view_count.desc())
    
    articles = query.all()
    
    return jsonify([article.to_dict() for article in articles]), 200


@app.route('/api/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    """Get single article and increment view count"""
    article = Article.query.get(article_id)
    
    if not article:
        return jsonify({'error': 'Article not found'}), 404
    
    # Increment view count
    article.view_count += 1
    
    # Update trending score based on views and likes
    article.trending_score = calculate_trending_score(article)
    
    db.session.commit()
    
    return jsonify(article.to_dict()), 200


@app.route('/api/articles', methods=['POST'])
@jwt_required()
def create_article():
    """Create new article"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('description') or not data.get('price'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    article = Article(
        title=data['title'],
        description=data['description'],
        price=float(data['price']),
        category=data.get('category', 'General'),
        image=data.get('image'),
        author_id=current_user_id
    )
    
    db.session.add(article)
    db.session.commit()
    
    # Add XP to user
    user = User.query.get(current_user_id)
    user.experience_points += 10
    check_level_up(user)
    db.session.commit()
    
    return jsonify(article.to_dict()), 201


@app.route('/api/articles/<int:article_id>', methods=['PUT'])
@jwt_required()
def update_article(article_id):
    """Update article"""
    current_user_id = get_jwt_identity()
    article = Article.query.get(article_id)
    
    if not article:
        return jsonify({'error': 'Article not found'}), 404
    
    if article.author_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    if data.get('title'):
        article.title = data['title']
    if data.get('description'):
        article.description = data['description']
    if data.get('price'):
        article.price = float(data['price'])
    if data.get('category'):
        article.category = data['category']
    
    db.session.commit()
    
    return jsonify(article.to_dict()), 200


@app.route('/api/articles/<int:article_id>', methods=['DELETE'])
@jwt_required()
def delete_article(article_id):
    """Delete article"""
    current_user_id = get_jwt_identity()
    article = Article.query.get(article_id)
    
    if not article:
        return jsonify({'error': 'Article not found'}), 404
    
    user = User.query.get(current_user_id)
    if article.author_id != current_user_id and user.role != 'Administrateur':
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(article)
    db.session.commit()
    
    return jsonify({'message': 'Article deleted successfully'}), 200


# ============================================================================
# SOCIAL INTERACTION ROUTES
# ============================================================================

@app.route('/api/articles/<int:article_id>/like', methods=['POST'])
@jwt_required()
def like_article(article_id):
    """Like an article"""
    current_user_id = get_jwt_identity()
    article = Article.query.get(article_id)
    
    if not article:
        return jsonify({'error': 'Article not found'}), 404
    
    # Check if already liked
    existing_like = Like.query.filter_by(user_id=current_user_id, article_id=article_id).first()
    
    if existing_like:
        return jsonify({'error': 'Already liked'}), 400
    
    # Create like
    like = Like(user_id=current_user_id, article_id=article_id)
    db.session.add(like)
    
    # Update trending score
    article.trending_score = calculate_trending_score(article)
    
    # Create notification for article author
    if article.author_id != current_user_id:
        user = User.query.get(current_user_id)
        notification = Notification(
            user_id=article.author_id,
            message=f"{user.username} a aimé votre article '{article.title}'",
            type='like'
        )
        db.session.add(notification)
    
    # Add XP to liker
    user = User.query.get(current_user_id)
    user.experience_points += 1
    check_level_up(user)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Article liked successfully',
        'like_count': len(article.likes)
    }), 201


@app.route('/api/articles/<int:article_id>/unlike', methods=['DELETE'])
@jwt_required()
def unlike_article(article_id):
    """Unlike an article"""
    current_user_id = get_jwt_identity()
    
    like = Like.query.filter_by(user_id=current_user_id, article_id=article_id).first()
    
    if not like:
        return jsonify({'error': 'Like not found'}), 404
    
    db.session.delete(like)
    
    # Update trending score
    article = Article.query.get(article_id)
    article.trending_score = calculate_trending_score(article)
    
    db.session.commit()
    
    return jsonify({'message': 'Article unliked successfully'}), 200


@app.route('/api/articles/<int:article_id>/stats', methods=['GET'])
def get_article_stats(article_id):
    """Get article statistics (views, likes)"""
    article = Article.query.get(article_id)
    
    if not article:
        return jsonify({'error': 'Article not found'}), 404
    
    return jsonify({
        'view_count': article.view_count,
        'like_count': len(article.likes),
        'trending_score': article.trending_score
    }), 200


# ============================================================================
# TRENDING/COMMUNITY ROUTES
# ============================================================================

@app.route('/api/trending', methods=['GET'])
def get_trending():
    """Get trending articles (simulated community data)"""
    # Get top articles by trending score
    articles = Article.query.order_by(Article.trending_score.desc()).limit(10).all()
    
    # If we don't have enough articles, simulate with AI-generated data
    if len(articles) < 10:
        # This simulates "community" data
        articles = simulate_trending_articles()
    
    return jsonify([article.to_dict() for article in articles]), 200


@app.route('/api/trending/simulate', methods=['POST'])
@jwt_required()
def simulate_trending():
    """Simulate trending data for demonstration (AI simulation)"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    # Only admins can simulate data
    if user.role != 'Administrateur':
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Create simulated articles
    categories = ['Électronique', 'Mode', 'Maison', 'Sport', 'Livres']
    simulated_count = 0
    
    for i in range(5):
        article = Article(
            title=f"Article Tendance #{random.randint(1000, 9999)}",
            description=f"Ceci est un article simulé par IA pour démontrer les tendances communautaires.",
            price=round(random.uniform(10, 500), 2),
            category=random.choice(categories),
            author_id=current_user_id,
            view_count=random.randint(50, 500),
            trending_score=random.uniform(10, 100)
        )
        db.session.add(article)
        simulated_count += 1
    
    db.session.commit()
    
    return jsonify({
        'message': f'{simulated_count} articles simulés créés',
        'count': simulated_count
    }), 201


# ============================================================================
# NOTIFICATION ROUTES
# ============================================================================

@app.route('/api/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get user notifications"""
    current_user_id = get_jwt_identity()
    
    notifications = Notification.query.filter_by(user_id=current_user_id)\
        .order_by(Notification.created_at.desc()).all()
    
    return jsonify([notif.to_dict() for notif in notifications]), 200


@app.route('/api/notifications/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notification_id):
    """Mark notification as read"""
    current_user_id = get_jwt_identity()
    notification = Notification.query.get(notification_id)
    
    if not notification:
        return jsonify({'error': 'Notification not found'}), 404
    
    if notification.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    notification.is_read = True
    db.session.commit()
    
    return jsonify(notification.to_dict()), 200


@app.route('/api/notifications/unread-count', methods=['GET'])
@jwt_required()
def get_unread_count():
    """Get count of unread notifications"""
    current_user_id = get_jwt_identity()
    
    count = Notification.query.filter_by(user_id=current_user_id, is_read=False).count()
    
    return jsonify({'unread_count': count}), 200


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def calculate_trending_score(article):
    """Calculate trending score based on views, likes, and recency"""
    # Get time decay factor (newer = higher score)
    age_hours = (datetime.utcnow() - article.created_at).total_seconds() / 3600
    time_decay = 1 / (1 + age_hours / 24)  # Decay over days
    
    # Calculate score
    like_count = len(article.likes)
    score = (article.view_count * 0.3 + like_count * 2) * time_decay * 10
    
    return round(score, 2)


def check_level_up(user):
    """Check if user should level up based on XP"""
    # Simple leveling system: 100 XP per level
    new_level = user.experience_points // 100 + 1
    
    if new_level > user.member_level:
        user.member_level = new_level
        
        # Create level up notification
        notification = Notification(
            user_id=user.id,
            message=f"Félicitations! Vous êtes maintenant niveau {new_level}!",
            type='system'
        )
        db.session.add(notification)


def simulate_trending_articles():
    """Simulate trending articles for demonstration"""
    # Return existing articles or empty list
    return Article.query.order_by(Article.trending_score.desc()).limit(10).all()


# ============================================================================
# STATIC FILES
# ============================================================================

@app.route('/static/uploads/<path:filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/')
def index():
    """Serve the main page"""
    return send_from_directory('static', 'index.html')


# ============================================================================
# DATABASE INITIALIZATION
# ============================================================================

@app.cli.command()
def init_db():
    """Initialize the database"""
    db.create_all()
    print('Database initialized successfully!')


@app.cli.command()
def create_admin():
    """Create an admin user"""
    admin = User(
        username='admin',
        email='admin@marketflow.com',
        role='Administrateur'
    )
    admin.set_password('admin123')
    
    db.session.add(admin)
    db.session.commit()
    
    print('Admin user created successfully!')
    print('Username: admin')
    print('Password: admin123')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
