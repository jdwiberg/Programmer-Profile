// Function to load any Markdown file and display it
function loadMarkdown(fileName, containerId) {
    // Fetch the Markdown file
    fetch(fileName)
        .then(response => {
            if (!response.ok) {
                throw new Error(`File not found: ${fileName}`);
            }
            return response.text();
        })
        .then(markdownContent => {
            // Convert the Markdown to HTML using marked.js
            const htmlContent = marked(markdownContent); // Use .default with newer version
            // Insert the HTML content into the specified container
            document.getElementById(containerId).innerHTML = htmlContent;
        })
        .catch(error => {
            // Handle errors (e.g., file not found)
            document.getElementById(containerId).innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

// Automatically load Markdown files when the page loads
window.onload = function() {
    loadMarkdown('topics/intro.md', 'markdown-container-i');
    loadMarkdown('topics/precedent.md', 'markdown-container-1'); 
    loadMarkdown('topics/cases.md', 'markdown-container-2'); 
    loadMarkdown('topics/ethics.md', 'markdown-container-3');
    loadMarkdown('topics/opinions.md', 'markdown-container-4');
    loadMarkdown('topics/appendix.md', 'markdown-container-a');


};
