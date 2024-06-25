document.addEventListener('DOMContentLoaded', () => {
  const dynamicContent = document.getElementById('dynamicContent');
  const filterBar = document.getElementById('filterBar');
  const pagination = document.getElementById('pagination');
  let currentFiles = [];
  let currentPage = 1;
  const itemsPerPage = 6;

  if (!dynamicContent || !filterBar || !pagination) {
    console.error('One or more required elements (dynamicContent, filterBar, pagination) are missing from the DOM.');
    return;
  }

  function loadExternalHTML(url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      });
  }

  function displayContent(files, page = 1) {
    dynamicContent.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const filesToDisplay = files.slice(start, end);

    filesToDisplay.forEach(file => {
      loadExternalHTML(file)
        .then(html => {
          dynamicContent.innerHTML += html;
        })
        .catch(error => {
          console.error('Error loading external HTML:', error);
        });
    });

    generatePagination(files, page);
  }

  function generatePagination(files, page) {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(files.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('a');
      pageLink.textContent = i;
      pageLink.href = '#';
      pageLink.dataset.page = i;
      if (i === page) {
        pageLink.style.fontWeight = 'bold';
      }
      pageLink.addEventListener('click', (event) => {
        event.preventDefault();
        currentPage = parseInt(event.target.dataset.page, 10);
        displayContent(currentFiles, currentPage);
      });
      pagination.appendChild(pageLink);
    }
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
            currentFiles = files.filter(file => file.includes(month));
            currentPage = 1;
            displayContent(currentFiles, currentPage);
          });
        });

        // Display all content by default
        currentFiles = files;
        displayContent(currentFiles, currentPage);
      })
      .catch(error => {
        console.error('Error fetching HTML file list:', error);
      });
  }

  // Fetch and load all HTML files listed in tilesList.json
  fetchHtmlFilesList();
});

