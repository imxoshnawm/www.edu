// admin.js - وەشانی تەواو و چاککراوە
let currentEditingId = null;
const API_URL = "http://localhost:3000";

// ======== فانکشنە سەرەکییەکان ========
async function loadData(type) {
    try {
        const response = await fetch(`${API_URL}/${type}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        alert('❌ هەڵە لە هێنانی داتا!');
        console.error('Error fetching data:', error);
        return [];
    }
}

async function deleteItem(type, id) {
    if (!confirm('دڵنیای لە سڕینەوەی ئەم ئایتمە؟')) return;
    try {
        const response = await fetch(`${API_URL}/${type}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        alert('✅ سڕینەوە بەسەرکەوتوویی ئەنجامدرا!');
        renderItems(type);
    } catch (error) {
        alert('❌ هەڵە لە سڕینەوەی ئایتمەکە!');
        console.error('Error deleting item:', error);
    }
}

async function editItem(type, id) {
    try {
        const response = await fetch(`${API_URL}/${type}/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const item = await response.json();
        currentEditingId = id;
        showForm(type, item);
    } catch (error) {
        alert('❌ هەڵە لە هێنانی داتا بۆ دەستکاری!');
        console.error('Error fetching item for edit:', error);
    }
}

function renderItems(type) {
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';
    loadData(type).then(items => {
        items.forEach(item => {
            container.innerHTML += `

${item.shortDescription}ID: ${item.id} | زمان: ${item.lang}
`;
        });
    });
}

// ======== بەشی فۆڕمەکان ========
function showForm(type, item = {}) {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = `
        <h2>${currentEditingId ? 'دەستکاری' : 'زیادکردنی'} ${type === 'projects' ? 'پڕۆژە' : 'ڕاپۆرت'}</h2>
        <form id="itemForm">
            <label for="title">ناونیشان:</label>
            <input type="text" id="title" name="title" value="${item.title || ''}" required>

            <label for="shortDescription">کورتە:</label>
            <textarea id="shortDescription" name="shortDescription" required>${item.shortDescription || ''}</textarea>

            <label for="description">تەواو:</label>
            <textarea id="description" name="description" required>${item.description || ''}</textarea>

            <label for="image">وێنە:</label>
            <input type="text" id="image" name="image" value="${item.image || ''}">

            <label for="link">لینک:</label>
            <input type="text" id="link" name="link" value="${item.link || ''}">

            <label for="date">ڕێکەوت:</label>
            <input type="date" id="date" name="date" value="${item.date || ''}">

            <label for="lang">زمان:</label>
            <select id="lang" name="lang" required>
                <option value="ku" ${item.lang === 'ku' ? 'selected' : ''}>کوردی</option>
                <option value="en" ${item.lang === 'en' ? 'selected' : ''}>English</option>
            </select>

            <button type="submit">${currentEditingId ? 'نوێکردنەوە' : 'خەزنکردن'}</button>
        </form>
    `;

    document.getElementById('itemForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveItem(type);
    });
}

async function saveItem(type) {
    const form = document.getElementById('itemForm');
    const formData = new FormData(form);
    const itemData = Object.fromEntries(formData.entries());

    try {
        const method = currentEditingId ? 'PUT' : 'POST';
        const url = currentEditingId ? `${API_URL}/${type}/${currentEditingId}` : `${API_URL}/${type}`;

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert(`✅ ${currentEditingId ? 'دەستکاری' : 'زیادکردن'} بە سەرکەوتوویی ئەنجامدرا!`);
        renderItems(type);
        document.getElementById('formContainer').innerHTML = ''; // پاککردنەوەی فۆڕمەکە
        currentEditingId = null; // ڕێکخستنەوەی ئایدی دەستکاری
    } catch (error) {
        alert(`❌ هەڵە لە ${currentEditingId ? 'دەستکاری' : 'زیادکردن'}!`);
        console.error('Error saving item:', error);
    }
}

// ======== ئامادەکاری ========
document.addEventListener('DOMContentLoaded', () => {
    // دانانی ئۆپشنەکان بۆ زیادکردن
    document.getElementById('addProject').addEventListener('click', () => showForm('projects'));
    document.getElementById('addReport').addEventListener('click', () => showForm('reports'));

    // بارکردنی سەرەتایی ئایتمەکان
    renderItems('projects');
    renderItems('reports');
});
