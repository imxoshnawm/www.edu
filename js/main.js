// main.js - وەشانی تەواو
(function() {
    // ڕێکخستنی EmailJS
    emailjs.init("V0Z01_dOUi-AFz4FI"); // 🔑 User ID خۆت لێرە بنووسە
})();

// ======== ڕێکخستنەکان ======== //
const API_URL = "http://localhost:3000";

// ======== فانکشنەکان ======== //
async function loadData(type) {
    try {
        const response = await fetch(`${API_URL}/${type}`);
        return await response.json();
    } catch (error) {
        console.error(`❌ هەڵە لە هێنانی ${type}:`, error);
        alert(document.documentElement.lang === 'ku' ? 
            'هەڵە لە هێنانی داتا!' : 
            'Error loading data!');
        return [];
    }
}

async function displayItems(type, containerId) {
    const container = document.getElementById(containerId);
    const lang = document.documentElement.lang || 'ku';
    
    try {
        const items = await loadData(type);
        container.innerHTML = items
            .filter(item => item.lang === lang)
            .map(item => `
                <article class="item-card">
                    <img src="${item.image}" alt="${item.title}" class="item-image">
                    <div class="item-content">
                        <h3>${item.title}</h3>
                        <p>${item.shortDescription}</p>
                        <a href="detail.html?type=${type}&id=${item.id}" class="read-more">
                            ${lang === 'ku' ? 'وردەکاری' : 'Details'}
                        </a>
                    </div>
                </article>
            `).join('');
    } catch (error) {
        container.innerHTML = `<p class="error">${lang === 'ku' ? '😥 هەڵەیەک ڕوویدا!' : '😥 An error occurred!'}</p>`;
    }
}

// Mobile Menu Toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', () => {
    document.querySelector('.mobile-nav-links').classList.toggle('active');
  });
  
// ======== فۆڕمی پەیوەندی ======== //
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = document.documentElement.lang || 'ku';
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        await emailjs.send(
            "service_aj20lhm", // 🔑 Service ID خۆت
            "template_f9m2b9n", // 🔑 Template ID خۆت
            {
                from_name: formData.name,
                reply_to: formData.email,
                message: formData.message,
                to_email: "hamesuan@gmail.com" // 🔑 ئیمەیڵی وەرگرت
            }
        );

        alert(lang === 'ku' ? 
            '✅ نامەکەت بەسەرکەوتوویی نێردرا!\nئیمەیڵەکەت پشکنین بکە!' : 
            '✅ Message sent!\nCheck your email!');
        
        e.target.reset(); // پاککردنەوەی فۆڕم
    } catch (error) {
        alert(lang === 'ku' ? 
            '❌ هەڵە لە ناردنی نامە!\nتکایە دووبارە هەوڵبدەرەوە' : 
            '❌ Failed to send!\nPlease try again');
    }
});

// ======== دەستپێکردنی خۆکار ======== //
document.addEventListener('DOMContentLoaded', () => {
    // بارکردنی پڕۆژەکان و ڕاپۆرتەکان
    displayItems('projects', 'projectsContainer');
    displayItems('reports', 'reportsContainer');

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // بارکردنی دەربارە
    (async () => {
        try {
            const aboutData = await loadData('about');
            const lang = document.documentElement.lang || 'ku';
            const aboutSection = document.querySelector('.about-content');
            
            aboutSection.innerHTML = `
                <h2>${aboutData[lang]?.title || ''}</h2>
                <p>${aboutData[lang]?.bio || ''}</p>
                <div class="skills">
                    ${aboutData[lang]?.skills?.map(skill => `
                        <span class="skill-tag">${skill}</span>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('هەڵە لە بارکردنی دەربارە:', error);
        }
    })();
});