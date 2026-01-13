#!/bin/bash
# Startup script for MarketFlow-Pro

echo "🚀 Starting MarketFlow-Pro..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate 2>/dev/null || . venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
fi

# Initialize database
echo "🗄️  Initializing database..."
python3 << EOF
from app import app
from models import db, User

with app.app_context():
    db.create_all()
    
    # Create default admin if doesn't exist
    if User.query.filter_by(username='admin').first() is None:
        admin = User(username='admin', email='admin@marketflow.com', role='Administrateur')
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("✅ Default admin created (username: admin, password: admin123)")
    else:
        print("ℹ️  Admin user already exists")
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server, run:"
echo "  python3 app.py"
echo ""
echo "Or run in background:"
echo "  python3 app.py &"
echo ""
echo "Then open: http://localhost:5000"
echo ""
