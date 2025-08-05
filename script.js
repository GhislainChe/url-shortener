document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('shortenForm');
    const urlTableBody = document.getElementById('urlTableBody');
    
    // Sample data - this is just for UI demonstration
    const sampleData = [
        {
            originalUrl: 'https://example.com/very/long/url/that/needs/to/be/shortened',
            shortUrl: 'ghislain-che.netlify.app',
            date: '2025-08-05'
        },
        {
            originalUrl: 'https://another-example.com/another/very/long/url',
            shortUrl: 'ghislain-expense-tracker.netlify.app',
            date: '2025-08-05'
        }
    ];

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Show success message
            alert('URL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    // Function to render the URL table
    function renderUrlTable() {
        urlTableBody.innerHTML = '';
        
        if (sampleData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="3" class="text-center">
                    No URLs to display
                </td>
            `;
            urlTableBody.appendChild(row);
            return;
        }

        sampleData.forEach(item => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td class="truncate">
                    <span class="mobile-label">Original URL:</span>
                    <div class="url-content">${item.originalUrl}</div>
                </td>
                <td class="short-url-cell">
                    <span class="mobile-label">Short URL:</span>
                    <a href="#" class="short-url">${item.shortUrl}</a>
                </td>
                <td class="date-cell">
                    <span class="mobile-label">Date:</span>
                    <span>${item.date}</span>
                </td>
                <td class="actions">
                    <button class="btn-copy" title="Copy">
                        <i class="far fa-copy"></i>
                        <span class="action-label">Copy</span>
                    </button>
                    <button class="btn-edit" title="Edit">
                        <i class="far fa-edit"></i>
                        <span class="action-label">Edit</span>
                    </button>
                    <button class="btn-delete" title="Delete">
                        <i class="far fa-trash-alt"></i>
                        <span class="action-label">Delete</span>
                    </button>
                </td>
            `;
            
            // Add click event for copy button
            const copyBtn = row.querySelector('.btn-copy');
            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                copyToClipboard(item.shortUrl);
            });

            // Add click event for the short URL
            const shortUrl = row.querySelector('.short-url');
            shortUrl.addEventListener('click', (e) => {
                e.preventDefault();
                copyToClipboard(item.shortUrl);
            });
            
            urlTableBody.appendChild(row);
        });
    }

    // Prevent form submission (since we're not implementing backend functionality)
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const longUrlInput = document.getElementById('longUrl');
        longUrlInput.value = ''; // Clear the input
        alert('This is a UI demo. No actual URL shortening will occur.');
    });

    // Initialize the table with sample data
    renderUrlTable();
});
