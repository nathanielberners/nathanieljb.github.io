document.addEventListener('DOMContentLoaded', () => {
  function loadExternalHTML(url, targetElementId) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        document.getElementById(targetElementId).innerHTML += html;
      })
      .catch(error => {
        console.error('Error loading external HTML:', error);
      });
  }

  function fetchHtmlFilesList() {
    fetch('tilesList.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const files = data.files;
        files.forEach(file => {
          loadExternalHTML(file, 'maincontent');
        });
      })
      .catch(error => {
        console.error('Error fetching HTML file list:', error);
      });
  }

  // Fetch and load all HTML files listed in tilesList.json
  fetchHtmlFilesList();
});:
