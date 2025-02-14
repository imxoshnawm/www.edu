// admin.js - وەشانی تەواو و چاککراوە
let currentEditingId = null;
const API_URL = "http://localhost:3000"; // 🔄 پێویستە JSON Server ئیشبکات

// ======== فانکشنە سەرەکییەکان ======== //
async function loadData(type) {
    try {
        const response = await fetch(`${API_URL}/${type}`);
        return await response.json();
    } catch (error) {
        alert('❌ هەڵە لە هێنانی داتا!');
        return [];
    }
}

async function deleteItem(type, id) {
    if (!confirm('دڵنیای لە سڕینەوەی ئەم ئایتمە؟')) return;
    try {
        await fetch(`${API_URL}/${type}/${id}`, { method: 'DELETE' });
        alert('✅ سڕینەوە بەسەرکەوتوویی ئەنجامدرا!');
        renderItems(type);
    } catch (error) {
        alert('❌ هەڵە لە سڕینەوەی ئایتمەکە!');
    }
}

async function editItem(type, id) {
    try {
        const response = await fetch(`${API_URL}/${type}/${id}`);
        const item = await response.json();
        currentEditingId = id;
        showForm(type, item);
    } catch (error) {
        alert('❌ هەڵە لە هێنانی داتا بۆ دەستکاری!');
    }
}

function renderItems(type) {
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';
    
    loadData(type).then(items => {
        items.forEach(item => {
            container.innerHTML += `
                <div class="admin-item-card">
                    <div class="admin-item-info">
                        <h3>${item.title}</h3>
                        <p>${item.shortDescription}</p>
                        <small>ID: ${item.id} | زمان: ${item.lang}</small>
                    </div>
                    <div class="admin-item-actions">
                        <button onclick="editItem('${type}', ${item.id})">✏️ دەستکاری</button>
                        <button onclick="deleteItem('${type}', ${item.id})">🗑️ سڕینەوە</button>
                    </div>
                </div>
            `;
        });
    });
}

// ======== فانکشنەکانی فۆڕم ======== //
function showForm(type, item = null) {
    const formContainer = document.getElementById('formContainer');
    const isEditMode = item !== null;

    formContainer.innerHTML = `
        <form onsubmit="handleFormSubmit(event, '${type}')">
            <input type="text" id="title" placeholder="ناونیشان" value="${isEditMode ? item.title : ''}" required>
            <textarea id="shortDescription" placeholder="کورتە بەربژێرە">${isEditMode ? item.shortDescription : ''}</textarea>
            <textarea id="description" placeholder="وردەکاری">${isEditMode ? item.description : ''}</textarea>
            <select id="lang" required>
                <option value="ku" ${isEditMode && item.lang === 'ku' ? 'selected' : ''}>کوردی</option>
                <option value="en" ${isEditMode && item.lang === 'en' ? 'selected' : ''}>ئینگلیزی</option>
            </select>
            <button type="submit">${isEditMode ? '💾 پاشەکەوتکردن' : '➕ زیادکردن'}</button>
        </form>
    `;
}

async function handleFormSubmit(event, type) {
    event.preventDefault();
    const formData = {
        title: document.getElementById('title').value,
        shortDescription: document.getElementById('shortDescription').value,
        description: document.getElementById('description').value,
        lang: document.getElementById('lang').value,
        date: new Date().toISOString().split('T')[0],
        image: "images/placeholder.jpg"
    };

    try {
        if (currentEditingId) {
            await fetch(`${API_URL}/${type}/${currentEditingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            alert('✅ دەستکارییەکە بەسەرکەوتوویی پاشەکەوتکرا!');
        } else {
            await fetch(`${API_URL}/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            alert('✅ ئایتمی نوێ بەسەرکەوتوویی زیادکرا!');
        }
        currentEditingId = null;
        document.getElementById('formContainer').innerHTML = '';
        renderItems(type);
    } catch (error) {
        alert('❌ هەڵە لە پاشەکەوتکردن!');
    }
}

// ======== دەستپێکردنی خۆکار ======== //
document.addEventListener('DOMContentLoaded', () => {
    renderItems('projects');
    renderItems('reports');
});