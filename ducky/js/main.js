const navLinksContainer = document.getElementById('navLinks');
CONFIG.navigation.forEach(item => {
    const link = document.createElement('a');
    link.href = item.url;
    link.textContent = item.name;
    navLinksContainer.appendChild(link);
});

const inviteBtn = document.createElement('a');
inviteBtn.href = '/invite';
inviteBtn.className = 'btn btn-primary';
inviteBtn.textContent = 'Add to Discord';
navLinksContainer.appendChild(inviteBtn);

const featuresGrid = document.getElementById('featuresGrid');
CONFIG.features.forEach(feature => {
    featuresGrid.innerHTML += `
        <div class="card">
            <i class="${feature.icon} feature-icon"></i>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        </div>
    `;
});

const footerLinksContainer = document.getElementById('footerLinks');
CONFIG.footerLinks.forEach(link => {
    const a = document.createElement('a');
    a.href = link.url;
    a.textContent = link.name;
    footerLinksContainer.appendChild(a);
});

const socialLinksContainer = document.getElementById('socialLinks');
Object.entries(CONFIG.socials).forEach(([platform, url]) => {
    socialLinksContainer.innerHTML += `
        <a href="${url}"><i class="fab fa-${platform}"></i></a>
    `;
});

const updateStats = async () => {
    try {
        const response = await fetch('https://api.duckybot.xyz/stats');
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        
        document.getElementById('serverCount').textContent = `${data.serverCount}+`;
        document.getElementById('userCount').textContent = `${data.userCount}+`;
        document.getElementById('linkCount').textContent = `${data.linkCount}+`;
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        document.getElementById('serverCount').textContent = CONFIG.defaultStats.serverCount;
        document.getElementById('userCount').textContent = CONFIG.defaultStats.userCount;
        document.getElementById('linkCount').textContent = CONFIG.defaultStats.linkCount;
    }
};

// Initialize Stats
updateStats();
