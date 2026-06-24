$(document).ready(function () {

  let allReports = [];
  let itemsPerPage = 10;
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

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = itemsPerPage === 0 
      ? filteredReports.length 
      : startIndex + itemsPerPage;

    const paginatedReports = itemsPerPage === 0
      ? filteredReports
      : filteredReports.slice(startIndex, endIndex);

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

  // Pagination
  function renderPagination() {
    const container = $('#pagination');
    container.empty();

    const totalPages = itemsPerPage === 0 
      ? 1 
      : Math.ceil(filteredReports.length / itemsPerPage);

    if (totalPages <= 1) return;

    // Previous
    const prevBtn = $(`<button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>`);
    container.append(prevBtn);

    // Current ± 2 pages
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i >= 1 && i <= totalPages) {
        const isActive = i === currentPage;
        const pageBtn = $(`<button class="page-btn ${isActive ? 'active' : ''}" data-page="${i}" ${isActive ? 'disabled' : ''}>${i}</button>`);
        container.append(pageBtn);
      }
    }

    // Next
    const nextBtn = $(`<button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`);
    container.append(nextBtn);
  }

  // Event delegation for pagination buttons
  $(document).on('click', '.page-btn:not(:disabled)', function () {
    const page = parseInt($(this).data('page'));
    if (page >= 1) {
      currentPage = page;
      renderCards(currentPage);
      window.scrollTo(0, 0);
    }
  });

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

  // Event listeners
  $('#filterType, #filterYearStart, #filterYearEnd').on('change', applyFilters);
  $('#searchOperations').on('input', applyFilters);

  $('#pageSize').on('change', function () {
    itemsPerPage = parseInt($(this).val());
    currentPage = 1;
    renderCards(currentPage);
  });

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
