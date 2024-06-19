document.addEventListener('DOMContentLoaded', () => {
  // Function to load external HTML
  function loadExternalHTML(url, targetElementId) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        document.getElementById(targetElementId).innerHTML = html;
      })
      .catch(error => {
        console.error('Error loading external HTML:', error);
      });
  }

  // Load the content from test.html into the div with id "dynamicContent"
  loadExternalHTML('test.html', 'maincontent');
});
