$(document).ready(function () {
  let allReports = [];
  const ITEMS_PER_PAGE = 25;
  let currentPage = 1;
  let filteredReports = [];

  // Load JSON data and populate the page
  $.ajax({
    url: 'clean_reports.json',
    dataType: 'json',
    success: function(data) {
      allReports = data;
      populateFilters();
      applyFilters();
    },
    error: function() {
      console.error('Failed to load reports data');
    }
  });

  // Populate filter dropdowns with unique types and years
  function populateFilters() {
    // Get unique types
    const types = [...new Set(allReports.map(report => report.type))].sort();
    types.forEach(type => {
      $('#filterType').append(`<option value="${type}">${type}</option>`);
    });

    // Get unique years and sort
    const years = [...new Set(allReports.map(report => report.year))].sort((a, b) => a - b);
    
    // Populate year dropdowns
    years.forEach(year => {
      $('#filterYearStart').append(`<option value="${year}">${year}</option>`);
      $('#filterYearEnd').append(`<option value="${year}">${year}</option>`);
    });

    // Set default values
    if (years.length > 0) {
      $('#filterYearStart').val(years[0]);
      $('#filterYearEnd').val(years[years.length - 1]);
    }
  }

  // Render paginated cards
  function renderCards(page = 1) {
    const container = $('.cards-container');
    container.empty();

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    if (paginatedReports.length === 0) {
      container.append('<p>No reports found.</p>');
      renderPagination();
      return;
    }

    paginatedReports.forEach(report => {
      const card = `
        <div class="operation-card">
          <div class="card-header">
            <h3 class="card-title">
              <a href="${report.link}">
                ${report.title}
              </a>
            </h3>
          </div>
          <div class="card-content">
            <div class="card-field">
              <strong>Type:</strong>
              <p>${report.type}</p>
              <strong>Date of publication:</strong>
              <p>${report.year}</p>
            </div>
          </div>
        </div>
      `;
      container.append(card);
    });

    renderPagination();
  }

  // Render pagination controls
  function renderPagination() {
    const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
    const paginationContainer = $('#pagination-controls');
    
    if (!paginationContainer.length) {
      $('.cards-container').after('<div id="pagination-controls" class="pagination-controls"></div>');
    }
    
    const pagination = $('#pagination-controls');
    pagination.empty();

    if (totalPages <= 1) {
      return;
    }

    let paginationHTML = '<nav aria-label="Pagination"><ul class="pagination">';

    // Previous button
    if (currentPage > 1) {
      paginationHTML += `<li><button class="page-link" data-page="${currentPage - 1}">Previous</button></li>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        paginationHTML += `<li><button class="page-link active" data-page="${i}">${i}</button></li>`;
      } else {
        paginationHTML += `<li><button class="page-link" data-page="${i}">${i}</button></li>`;
      }
    }

    // Next button
    if (currentPage < totalPages) {
      paginationHTML += `<li><button class="page-link" data-page="${currentPage + 1}">Next</button></li>`;
    }

    paginationHTML += '</ul></nav>';
    pagination.html(paginationHTML);

    // Attach click handlers
    $('.page-link').on('click', function() {
      currentPage = $(this).data('page');
      renderCards(currentPage);
      window.scrollTo(0, 0);
    });
  }

  function applyFilters() {
    const typeFilter = $('#filterType').val();
    const yearStart = $('#filterYearStart').val();
    const yearEnd = $('#filterYearEnd').val();
    const searchTerm = $('#searchOperations').val().toLowerCase();

    // Set default values if empty
    const startYear = yearStart ? parseInt(yearStart) : 2002;
    const endYear = yearEnd ? parseInt(yearEnd) : 2026;

    filteredReports = allReports.filter(report => {
      const typeMatch = typeFilter === '' || report.type === typeFilter;
      const yearMatch = report.year >= startYear && report.year <= endYear;
      const searchMatch = searchTerm === '' || report.title.toLowerCase().includes(searchTerm);

      return typeMatch && yearMatch && searchMatch;
    });

    currentPage = 1;
    renderCards(currentPage);
  }

  $('#filterType, #filterYearStart, #filterYearEnd').on('change', applyFilters);
  $('#searchOperations').on('input', applyFilters);

  $('#resetFilters').on('click', function () {
    $('#filterType').val('');
    // Reset to first and last year
    const firstOption = $('#filterYearStart option:first').val();
    const lastOption = $('#filterYearEnd option:last').val();
    $('#filterYearStart').val(firstOption);
    $('#filterYearEnd').val(lastOption);
    $('#searchOperations').val('');
    applyFilters();
  });
});
