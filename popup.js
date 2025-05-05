// Select elements from the DOM
const quoteIdInput = document.getElementById('quoteId');
const generateButton = document.getElementById('generate');
const generateFullButton = document.getElementById('generate-full');
const resultElement = document.getElementById('result');
const copyButton = document.getElementById('copy');


/// HELPER FUNCTIONS
function extractQuoteId(url) {
    const match = url.match(/https:\/\/elephantsfootconsulting\.scoro\.com\/quotes\/view\/(\d+)/);
    return match ? match[1] : '';
}

function showError(message) {
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorContainer.style.display = 'block';
}

function hideError() {
    const errorContainer = document.getElementById('error-container');
    errorContainer.style.display = 'none';
}



// Get the current tab's URL and set the default value of the input
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab && currentTab.url) {
        const quoteId = extractQuoteId(currentTab.url);
        if (quoteId) {
            quoteIdInput.value = quoteId; // Set the default value of the input
        }
    }
});


// Add an event listener to the "Generate Token" button
generateButton.addEventListener('click', async () => {
    const quoteId = quoteIdInput.value.trim();
    if (!quoteId) {
        showError('Please enter a Quote ID')
        return;
    }
    else{
        hideError()
    }
    // Save original button content
    const originalContent = generateButton.innerHTML;
    // Set loading state with spinning icon
    generateButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            class="spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
    `;
    generateButton.disabled = true;


    try {
        // Send PUT request to your API endpoint with the scoro_quote_id
        const response = await fetch('https://efconsulting.com.au/api/create-url', {
            method: 'PUT',
            mode: 'cors',  // Add this line
            credentials: 'omit',  // Add this line
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'  // Add this line
            },
            body: JSON.stringify({
                scoro_quote_id: quoteId,
            }),
        });

        // Check if the request was successful
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error);
        }

        // Parse the response
        const data = await response.json();
        const tokenUrl = data.url ? data.url : ''; // Assuming the response contains the token's ID

        // Display the result (token URL or token ID)
        resultElement.value = tokenUrl;

        generateButton.innerHTML = originalContent;
        generateButton.disabled = false;
        hideError()

    } catch (error) {
        showError(error)
        generateButton.innerHTML = originalContent;
        generateButton.disabled = false;
    }
});



generateFullButton.addEventListener('click', async () => {
    const quoteId = quoteIdInput.value.trim();
    if (!quoteId) {
        showError('Please enter a Quote ID')
        return;
    }
    else{
        hideError()
    }
    // Save original button content
    const originalContent = generateFullButton.innerHTML;
    // Set loading state with spinning icon
    generateFullButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            class="spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
    `;
    generateFullButton.disabled = true;


    try {
        // Send PUT request to your API endpoint with the scoro_quote_id
        const response = await fetch('https://efconsulting.com.au/api/create-full-form', {
            method: 'PUT',
            mode: 'cors',  // Add this line
            credentials: 'omit',  // Add this line
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'  // Add this line
            },
            body: JSON.stringify({
                scoro_quote_id: quoteId,
            }),
        });

        // Check if the request was successful
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error);
        }

        // Parse the response
        const data = await response.json();
        const tokenUrl = data.url ? data.url : ''; // Assuming the response contains the token's ID

        // Display the result (token URL or token ID)
        resultElement.value = tokenUrl;

        generateFullButton.innerHTML = originalContent;
        generateFullButton.disabled = false;
        hideError()

    } catch (error) {
        showError(error)
        generateFullButton.innerHTML = originalContent;
        generateFullButton.disabled = false;
    }
});


// Add an event listener to the "Copy URL" button
copyButton.addEventListener('click', () => {
    // Copy the token URL to the clipboard
    const url = resultElement.value;
    navigator.clipboard.writeText(url)
        .then(() => {
            copyButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                `;
        })
        .catch((err) => {
            console.error('Failed to copy: ', err);
        });
});

