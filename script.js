$(document).ready(function () {

  let allReports = [];
  const ITEMS_PER_PAGE = 10;
  let currentPage = 1;
  let filteredReports = [];


  // Load JSON data
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

  // Populate filters
  function populateFilters() {
    const types = [...new Set(allReports.map(report => report.type))].sort();
    types.forEach(type => {
      $('#filterType').append(`<option value="${type}">${type}</option>`);
    });

    const years = [...new Set(allReports.map(report => report.year))].sort((a, b) => a - b);

    years.forEach(year => {
      $('#filterYearStart').append(`<option value="${year}">${year}</option>`);
      $('#filterYearEnd').append(`<option value="${year}">${year}</option>`);
    });

    if (years.length > 0) {
      $('#filterYearStart').val(years[0]);
      $('#filterYearEnd').val(years[years.length - 1]);
    }
  }

  // Render cards
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

function renderPagination() {
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const container = $('#pagination');
  container.empty();

  if (totalPages <= 1) return;

  function pageBtn(label, page, disabled = false, active = false) {
    const btn = $(`
      <button class="page-btn ${active ? 'active' : ''}" ${disabled ? 'disabled' : ''}>
        ${label}
      </button>
    `);

    if (!disabled && !active) {
      btn.on('click', function () {
        currentPage = page;
        renderCards(currentPage);
        window.scrollTo(0, 0);
      });
    }

    container.append(btn);
  }

  // Previous
  pageBtn('Previous', currentPage - 1, currentPage === 1);

  // Current ± 2 pages
  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i >= 1 && i <= totalPages) {
      pageBtn(i, i, false, i === currentPage);
    }
  }

  // Next
  pageBtn('Next', currentPage + 1, currentPage === totalPages);
}


  // Apply filters
  function applyFilters() {
    const typeFilter = $('#filterType').val();
    const yearStart = $('#filterYearStart').val();
    const yearEnd = $('#filterYearEnd').val();
    const searchTerm = $('#searchOperations').val().toLowerCase();

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
    const firstOption = $('#filterYearStart option:first').val();
    const lastOption = $('#filterYearEnd option:last').val();
    $('#filterYearStart').val(firstOption);
    $('#filterYearEnd').val(lastOption);
    $('#searchOperations').val('');
    applyFilters();
  });

});
