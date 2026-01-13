// MarketFlow-Pro - Client-side JavaScript

/**
 * Like a product
 */
function likeProduct(productId) {
    fetch(`/api/like/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.likes) {
            // Update the likes count in the UI
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (productCard) {
                const likesCount = productCard.querySelector('.likes-stat .count');
                if (likesCount) {
                    likesCount.textContent = data.likes;
                    
                    // Add animation
                    likesCount.parentElement.classList.add('animate-like');
                    setTimeout(() => {
                        likesCount.parentElement.classList.remove('animate-like');
                    }, 500);
                }
            }
            
            console.log(`Product ${productId} liked! Total likes: ${data.likes}`);
        }
    })
    .catch(error => {
        console.error('Error liking product:', error);
    });
}

/**
 * View product details (increments view counter)
 */
function viewProduct(productId) {
    fetch(`/api/view/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.views) {
            // Update the views count in the UI
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (productCard) {
                const viewsCount = productCard.querySelector('.views-stat .count');
                if (viewsCount) {
                    viewsCount.textContent = data.views;
                }
            }
            
            console.log(`Product ${productId} viewed! Total views: ${data.views}`);
            
            // Show an alert for demonstration
            alert(`Détails du produit\n\nCette fonctionnalité afficherait les détails complets du produit.\nVues totales: ${data.views}`);
        }
    })
    .catch(error => {
        console.error('Error viewing product:', error);
    });
}

// Auto-refresh community activity simulation (every 10 seconds)
let autoRefreshEnabled = false;

function toggleAutoRefresh() {
    autoRefreshEnabled = !autoRefreshEnabled;
    if (autoRefreshEnabled) {
        console.log('Auto-refresh enabled');
        setTimeout(refreshCommunityData, 10000);
    } else {
        console.log('Auto-refresh disabled');
    }
}

function refreshCommunityData() {
    if (!autoRefreshEnabled) return;
    
    console.log('Simulating community activity...');
    // In a real application, this would fetch updated data from the server
    setTimeout(refreshCommunityData, 10000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('MarketFlow-Pro initialized');
    console.log('Social proof and community features active');
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .animate-like {
            animation: pulse 0.5s ease;
        }
    `;
    document.head.appendChild(style);
});
