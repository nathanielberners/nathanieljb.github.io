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
        // Sort the files by date in descending order
          // // Manual date parsing and sorting
        files.sort((a, b) => {
          const [yearA, monthA, dayA] = a.match(/(\d{4})-(\d{2})-(\d{2})/).slice(1, 4).map(Number);
          const [yearB, monthB, dayB] = b.match(/(\d{4})-(\d{2})-(\d{2})/).slice(1, 4).map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          console.log('Comparing dates:', dateA, dateB); // Log the dates being compared
          return dateB - dateA; // Descending order
        });
        files.forEach(file => {
          loadExternalHTML(file, 'tiledwall');
        });
      })
      .catch(error => {
        console.error('Error fetching HTML file list:', error);
      });
  }

  // Fetch and load all HTML files listed in tilesList.json
  fetchHtmlFilesList();
});
