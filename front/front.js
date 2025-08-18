//test
(async function() {
    // Function to display messages to the user in the UI
    function showMessage(message, type) {
        const statusDiv = document.getElementById('status-message');
        statusDiv.textContent = message;
        statusDiv.className = `mt-4 p-4 rounded-lg text-sm text-center ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
    }

    // Function to randomly select a URL from the manifest
    function getRandomScriptUrl(manifest) {
        if (!manifest || !manifest.scripts || manifest.scripts.length === 0) {
            throw new Error("Manifest is invalid or contains no scripts.");
        }
        const randomIndex = Math.floor(Math.random() * manifest.scripts.length);
        return manifest.scripts[randomIndex].url;
    }

    // Function to load the main script dynamically
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = true; // Use async to prevent blocking the page
            
            script.onload = () => {
                console.log(`Script successfully loaded from: ${url}`);
                resolve(script);
            };

            script.onerror = (error) => {
                console.error(`Failed to load script from: ${url}`);
                reject(new Error(`Failed to load script from: ${url}`));
            };

            document.body.appendChild(script);
        });
    }

    try {
        // The URL for your manifest file hosted on GitHub and served via jsDelivr.
        // You would replace 'username' and 'repo-name' with your own details.
        // The @latest tag automatically points to the most recent commit on your default branch.
        const manifestUrl = 'https://cdn.jsdelivr.net/gh/username/repo-name@latest/manifest.json';
        
        showMessage("Fetching manifest file...", "info");

        // Fetch the manifest file
        const response = await fetch(manifestUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const manifest = await response.json();

        // Get a random script URL from the manifest for load balancing
        const scriptUrl = getRandomScriptUrl(manifest);

        showMessage(`Manifest fetched! Loading script from: ${scriptUrl}`, "info");

        // Load the main script dynamically
        await loadScript(scriptUrl);

        showMessage("Startup script loaded successfully!", "success");

    } catch (error) {
        console.error("Critical error during script loading:", error);
        showMessage(`Error: ${error.message}. The page may not function correctly.`, "error");
    }
})();

    
    
