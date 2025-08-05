document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('shortenForm');
    const urlTableBody = document.getElementById('urlTableBody');
    
    // Sample data - in a real app, this would come from a database
    let urlData = [
        {
            id: 1,
            originalUrl: 'https://example.com/very/long/url/that/needs/to/be/shortened',
            shortCode: 'abc123',
            date: '2023-05-15',
            clicks: 42
        }
    ];

    // Load URLs from localStorage if available
    function loadUrls() {
        const savedUrls = localStorage.getItem('shortenedUrls');
        if (savedUrls) {
            urlData = JSON.parse(savedUrls);
        }
        renderUrlTable();
    }

    // Save URLs to localStorage
    function saveUrls() {
        localStorage.setItem('shortenedUrls', JSON.stringify(urlData));
    }

    // Generate a random short code
    function generateShortCode(length = 6) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Format date
    function formatDate(date = new Date()) {
        return date.toISOString().split('T')[0];
    }

    // Add a new URL
    function addUrl(originalUrl, customPath = '') {
        const shortCode = customPath || generateShortCode();
        const newUrl = {
            id: Date.now(),
            originalUrl,
            shortCode,
            date: formatDate(),
            clicks: 0
        };
        
        urlData.unshift(newUrl);
        saveUrls();
        renderUrlTable();
        return newUrl;
    }

    // Delete a URL
    function deleteUrl(id) {
        if (confirm('Are you sure you want to delete this URL?')) {
            urlData = urlData.filter(url => url.id !== id);
            saveUrls();
            renderUrlTable();
        }
    }

    // Copy URL to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Show success message (could be enhanced with a toast notification)
            alert('URL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    // Render the URL table
    function renderUrlTable() {
        urlTableBody.innerHTML = '';
        
        if (urlData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="5" class="text-center">
                    No URLs shortened yet. Add one above!
                </td>
            `;
            urlTableBody.appendChild(row);
            return;
        }

        urlData.forEach(url => {
            const row = document.createElement('tr');
            const shortUrl = `short.ly/${url.shortCode}`;
            
            row.innerHTML = `
                <td class="truncate">${url.originalUrl}</td>
                <td><a href="#" class="short-url" data-short="${shortUrl}">${shortUrl}</a></td>
                <td>${url.date}</td>
                <td>${url.clicks}</td>
                <td class="actions">
                    <button class="btn-copy" title="Copy" data-url="${shortUrl}">
                        <i class="far fa-copy"></i>
                    </button>
                    <button class="btn-edit" title="Edit">
                        <i class="far fa-edit"></i>
                    </button>
                    <button class="btn-delete" title="Delete" data-id="${url.id}">
                        <i class="far fa-trash-alt"></i>
                    </button>
                </td>
            `;
            
            urlTableBody.appendChild(row);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const url = btn.getAttribute('data-url');
                copyToClipboard(`https://${url}`);
            });
        });

        document.querySelectorAll('.short-url').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = link.getAttribute('data-short');
                copyToClipboard(`https://${url}`);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(btn.getAttribute('data-id'));
                deleteUrl(id);
            });
        });
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const longUrlInput = document.getElementById('longUrl');
        const customPathInput = document.getElementById('customPath');
        
        const longUrl = longUrlInput.value.trim();
        const customPath = customPathInput.value.trim();
        
        if (!longUrl) {
            alert('Please enter a URL to shorten');
            return;
        }
        
        // Simple URL validation
        try {
            new URL(longUrl.startsWith('http') ? longUrl : `https://${longUrl}`);
        } catch (e) {
            alert('Please enter a valid URL');
            return;
        }
        
        // Add the URL
        addUrl(longUrl, customPath);
        
        // Reset the form
        longUrlInput.value = '';
        customPathInput.value = '';
        longUrlInput.focus();
    });

    // Initialize the app
    loadUrls();
});
