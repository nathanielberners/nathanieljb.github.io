document.addEventListener('DOMContentLoaded', () => {
  const dynamicContent = document.getElementById('dynamicContent');
  const filterBar = document.getElementById('filterBar');
  
  function loadExternalHTML(url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      });
  }

  function displayContent(files) {
    dynamicContent.innerHTML = '';
    files.forEach(file => {
      loadExternalHTML(file)
        .then(html => {
          dynamicContent.innerHTML += html;
        })
        .catch(error => {
          console.error('Error loading external HTML:', error);
        });
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

        // Ensure proper date parsing and sorting
        files.sort((a, b) => {
          const [yearA, monthA, dayA] = a.match(/(\d{4})-(\d{2})-(\d{2})/).slice(1, 4).map(Number);
          const [yearB, monthB, dayB] = b.match(/(\d{4})-(\d{2})-(\d{2})/).slice(1, 4).map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return dateB - dateA; // Descending order
        });

        // Create filter links
        const months = [...new Set(files.map(file => file.match(/(\d{4}-\d{2})/)[0]))];
        filterBar.innerHTML = months.map(month => `<a href="#" data-month="${month}">${month}</a>`).join(' | ');

        // Add event listeners to filter links
        filterBar.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', (event) => {
            event.preventDefault();
            const month = event.target.getAttribute('data-month');
            const filteredFiles = files.filter(file => file.includes(month));
            displayContent(filteredFiles);
          });
        });

        // Display all content by default
        displayContent(files);
      })
      .catch(error => {
        console.error('Error fetching HTML file list:', error);
      });
  }

  // Fetch and load all HTML files listed in tilesList.json
  fetchHtmlFilesList();
});
