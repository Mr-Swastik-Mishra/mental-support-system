// resources.js - Resource hub page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Resources page loaded successfully');
    
    let resources = [];
    let currentFilter = 'all';
    let currentSort = 'recent';
    let bookmarkedResources = [];
    
    // Initialize resources page
    initializeResources();
    initializeFilters();
    initializeSearch();
    loadBookmarkedResources();
    
    function initializeResources() {
        loadSampleResources();
        renderResources();
    }
    
    function initializeFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                currentFilter = this.dataset.category;
                renderResources();
            });
        });
        
        // Initialize sort dropdown
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                currentSort = this.value;
                renderResources();
            });
        }
    }
    
    function initializeSearch() {
        const searchInput = document.getElementById('resourceSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                filterResourcesBySearch(searchTerm);
            });
        }
    }
    
    function loadSampleResources() {
        resources = [
            {
                id: 1,
                type: 'article',
                category: 'Anxiety',
                title: 'Understanding and Managing Anxiety',
                description: 'An in-depth guide to anxiety symptoms and coping strategies for college students.',
                duration: '6 min read',
                rating: 4.6,
                views: 2300,
                image: 'https://via.placeholder.com/150x100/4F46E5/FFFFFF?text=Anxiety+Article',
                link: '#',
                featured: true
            },
            {
                id: 2,
                type: 'video',
                category: 'Stress',
                title: '5-Minute Stress Relief Techniques',
                description: 'Quick video exercises to calm your mind during busy study periods.',
                duration: '8 min',
                rating: 4.8,
                views: 1800,
                image: 'https://via.placeholder.com/150x100/4F46E5/FFFFFF?text=Stress+Video',
                link: '#',
                featured: true
            },
            {
                id: 3,
                type: 'audio',
                category: 'Sleep',
                title: 'Guided Sleep Meditation',
                description: 'Relaxing audio to help you fall asleep faster and sleep more deeply.',
                duration: '15 min',
                rating: 4.9,
                views: 2100,
                image: 'https://via.placeholder.com/150x100/4F46E5/FFFFFF?text=Sleep+Audio',
                link: '#',
                featured: true
            },
            {
                id: 4,
                type: 'article',
                category: 'Depression',
                title: 'Coping with Depression: A Student Guide',
                description: 'Practical advice for students dealing with depression and low mood.',
                duration: '8 min read',
                rating: 4.7,
                views: 1900,
                image: 'https://via.placeholder.com/150x100/4F46E5/FFFFFF?text=Depression+Article',
                link: '#',
                featured: false
            },
            {
                id: 5,
                type: 'video',
                category: 'Mindfulness',
                title: 'Introduction to Mindfulness',
                description: 'Learn the basics of mindfulness for daily well-being and stress reduction.',
                duration: '12 min',
                rating: 4.5,
                views: 1600,
                image: 'https://via.placeholder.com/150x100/4F46E5/FFFFFF?text=Mindfulness+Video',
                link: '#',
                featured: false
            },
            {
                id: 6,
                type: 'article',
                category: 'Burnout',
                title: 'Preventing Academic Burnout',
                description: 'Strategies to manage academic pressure and avoid burnout during college.',
                duration: '7 min read',
                rating: 4.8,
                views: 2200,
                image: 'https://via.placeholder.com/150x100/4F46E5/FFFFFF?text=Burnout+Article',
                link: '#',
                featured: false
            },
            {
                id: 7,
                type: 'audio',
                category: 'Meditation',
                title: 'Morning Mindfulness',
                description: 'Start your day with this 10-minute guided mindfulness meditation.',
                duration: '10 min',
                rating: 4.9,
                views: 1400,
                image: 'https://via.placeholder.com/150x100/4F46E5/FFFFFF?text=Meditation+Audio',
                link: '#',
                featured: false
            },
            {
                id: 8,
                type: 'video',
                category: 'Relationships',
                title: 'Building Healthy Relationships',
                description: 'Tips for maintaining friendships and romantic relationships in college.',
                duration: '15 min',
                rating: 4.7,
                views: 1700,
                image: 'https://via.placeholder.com/150x100/4F46E5/FFFFFF?text=Relationships+Video',
                link: '#',
                featured: false
            }
        ];
    }
    
    function renderResources() {
        let filteredResources = filterResources();
        filteredResources = sortResources(filteredResources);
        
        // Render featured resources
        renderFeaturedResources(filteredResources.filter(r => r.featured));
        
        // Render all resources
        renderResourcesGrid(filteredResources);
    }
    
    function filterResources() {
        if (currentFilter === 'all') {
            return resources;
        }
        
        return resources.filter(resource => 
            resource.type === currentFilter || 
            resource.category.toLowerCase() === currentFilter
        );
    }
    
    function sortResources(resources) {
        switch(currentSort) {
            case 'recent':
                return resources.sort((a, b) => b.id - a.id);
            case 'popular':
                return resources.sort((a, b) => b.views - a.views);
            case 'rating':
                return resources.sort((a, b) => b.rating - a.rating);
            case 'duration':
                return resources.sort((a, b) => {
                    const aDuration = parseInt(a.duration);
                    const bDuration = parseInt(b.duration);
                    return aDuration - bDuration;
                });
            default:
                return resources;
        }
    }
    
    function renderFeaturedResources(featuredResources) {
        const featuredGrid = document.querySelector('.featured-grid');
        if (!featuredGrid) return;
        
        featuredGrid.innerHTML = featuredResources.map(resource => `
            <div class="featured-card">
                <div class="featured-image">
                    <img src="${resource.image}" alt="${resource.title}">
                    <div class="play-overlay">
                        <button class="play-btn" onclick="openResource(${resource.id})">▶️</button>
                    </div>
                </div>
                <div class="featured-content">
                    <div class="resource-category">${resource.type}</div>
                    <h3>${resource.title}</h3>
                    <p>${resource.description}</p>
                    <div class="resource-meta">
                        <span class="duration">${resource.duration}</span>
                        <span class="views">${resource.views.toLocaleString()} views</span>
                        <span class="rating">⭐ ${resource.rating}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function renderResourcesGrid(resources) {
        const resourcesGrid = document.querySelector('.resources-grid');
        if (!resourcesGrid) return;
        
        resourcesGrid.innerHTML = resources.map(resource => `
            <div class="resource-card" data-category="${resource.type}">
                <div class="resource-thumbnail">
                    <img src="${resource.image}" alt="${resource.title}">
                    <div class="resource-type">${getResourceIcon(resource.type)}</div>
                </div>
                <div class="resource-info">
                    <div class="resource-category">${resource.category}</div>
                    <h4>${resource.title}</h4>
                    <p>${resource.description}</p>
                    <div class="resource-meta">
                        <span class="duration">${resource.duration}</span>
                        <span class="rating">⭐ ${resource.rating}</span>
                    </div>
                    <div class="resource-actions">
                        <button class="btn btn-outline btn-small" onclick="openResource(${resource.id})">
                            ${getActionText(resource.type)}
                        </button>
                        <button class="btn btn-outline btn-small" onclick="bookmarkResource(${resource.id})">
                            🔖
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function filterResourcesBySearch(searchTerm) {
        const filteredResources = resources.filter(resource =>
            resource.title.toLowerCase().includes(searchTerm) ||
            resource.description.toLowerCase().includes(searchTerm) ||
            resource.category.toLowerCase().includes(searchTerm)
        );
        
        renderResourcesGrid(filteredResources);
    }
    
    function getResourceIcon(type) {
        const icons = {
            'article': '📄',
            'video': '🎥',
            'audio': '🎵',
            'guide': '📋'
        };
        return icons[type] || '📄';
    }
    
    function getActionText(type) {
        const actions = {
            'article': 'Read',
            'video': 'Watch',
            'audio': 'Listen',
            'guide': 'Download'
        };
        return actions[type] || 'View';
    }
    
    function loadBookmarkedResources() {
        bookmarkedResources = JSON.parse(localStorage.getItem('bookmarkedResources') || '[]');
        renderBookmarkedResources();
    }
    
    function renderBookmarkedResources() {
        const bookmarkedGrid = document.querySelector('.bookmarked-grid');
        if (!bookmarkedGrid) return;
        
        if (bookmarkedResources.length === 0) {
            bookmarkedGrid.innerHTML = '<p>No bookmarked resources yet. Start bookmarking your favorite content!</p>';
            return;
        }
        
        bookmarkedGrid.innerHTML = bookmarkedResources.map(resourceId => {
            const resource = resources.find(r => r.id === resourceId);
            if (!resource) return '';
            
            return `
                <div class="bookmarked-item">
                    <div class="bookmark-icon">🔖</div>
                    <div class="bookmark-info">
                        <h4>${resource.title}</h4>
                        <p>${resource.type} • ${resource.duration}</p>
                    </div>
                    <button class="remove-bookmark" onclick="removeBookmark(${resource.id})">×</button>
                </div>
            `;
        }).join('');
    }
    
    // Global functions
    window.openResource = function(resourceId) {
        const resource = resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        // Show resource player modal
        const modal = document.getElementById('resourcePlayerModal');
        if (modal) {
            const playerTitle = document.getElementById('playerTitle');
            const playerCategory = document.getElementById('playerCategory');
            const playerDuration = document.getElementById('playerDuration');
            
            if (playerTitle) playerTitle.textContent = resource.title;
            if (playerCategory) playerCategory.textContent = resource.category;
            if (playerDuration) playerDuration.textContent = resource.duration;
            
            // Show appropriate player based on type
            const videoPlayer = document.getElementById('videoPlayer');
            const audioPlayer = document.getElementById('audioPlayer');
            const articleContent = document.getElementById('articleContent');
            
            // Hide all players
            if (videoPlayer) videoPlayer.style.display = 'none';
            if (audioPlayer) audioPlayer.style.display = 'none';
            if (articleContent) articleContent.style.display = 'none';
            
            // Show appropriate player
            switch(resource.type) {
                case 'video':
                    if (videoPlayer) {
                        videoPlayer.style.display = 'block';
                        const video = videoPlayer.querySelector('video');
                        if (video) {
                            video.src = resource.link;
                        }
                    }
                    break;
                case 'audio':
                    if (audioPlayer) {
                        audioPlayer.style.display = 'block';
                        const audio = audioPlayer.querySelector('audio');
                        if (audio) {
                            audio.src = resource.link;
                        }
                    }
                    break;
                case 'article':
                    if (articleContent) {
                        articleContent.style.display = 'block';
                        const articleText = articleContent.querySelector('.article-text');
                        if (articleText) {
                            articleText.innerHTML = `
                                <h3>${resource.title}</h3>
                                <p>${resource.description}</p>
                                <p>This is a sample article content. In a real application, this would contain the full article text.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            `;
                        }
                    }
                    break;
            }
            
            modal.style.display = 'block';
        }
    };
    
    window.bookmarkResource = function(resourceId) {
        if (bookmarkedResources.includes(resourceId)) {
            showAlert('Resource already bookmarked!', 'info');
            return;
        }
        
        bookmarkedResources.push(resourceId);
        localStorage.setItem('bookmarkedResources', JSON.stringify(bookmarkedResources));
        renderBookmarkedResources();
        showAlert('Resource bookmarked successfully!', 'success');
    };
    
    window.removeBookmark = function(resourceId) {
        bookmarkedResources = bookmarkedResources.filter(id => id !== resourceId);
        localStorage.setItem('bookmarkedResources', JSON.stringify(bookmarkedResources));
        renderBookmarkedResources();
        showAlert('Bookmark removed!', 'info');
    };
    
    window.shareResource = function() {
        showAlert('Share feature coming soon!', 'info');
    };
    
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        if (type === 'success') {
            alert.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            alert.style.backgroundColor = '#ef4444';
        } else if (type === 'info') {
            alert.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .filter-btn.active {
            background-color: #4F46E5;
            color: white;
        }
        .resource-card {
            transition: transform 0.2s ease;
        }
        .resource-card:hover {
            transform: translateY(-2px);
        }
        .featured-card {
            transition: transform 0.2s ease;
        }
        .featured-card:hover {
            transform: translateY(-5px);
        }
        .play-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .featured-image:hover .play-overlay {
            opacity: 1;
        }
        .play-btn {
            background: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        .play-btn:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
});




