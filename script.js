$(document).ready(function () {

  function applyFilters() {
    const typeFilter = $('#filterType').val().toLowerCase();
    const yearStart = $('#filterYearStart').val();
    const yearEnd = $('#filterYearEnd').val();
    const searchTerm = $('#searchOperations').val().toLowerCase();

    // Set default values if empty
    const startYear = yearStart ? parseInt(yearStart) : 2002;
    const endYear = yearEnd ? parseInt(yearEnd) : 2026;

    $('.operation-card').each(function () {
      const card = $(this);

      const type = (card.closest('.data-row').data('type') || '').toLowerCase();
      const year = parseInt(card.closest('.data-row').data('year') || 0);
      const text = card.text().toLowerCase();

      const typeMatch = typeFilter === '' || type === typeFilter;
      const yearMatch = year >= startYear && year <= endYear;
      const searchMatch = searchTerm === '' || text.includes(searchTerm);

      if (typeMatch && yearMatch && searchMatch) {
        card.removeClass('hidden');
      } else {
        card.addClass('hidden');
      }
    });
  }

  $('#filterType, #filterYearStart, #filterYearEnd').on('change', applyFilters);
  $('#searchOperations').on('input', applyFilters);

  $('#resetFilters').on('click', function () {
    $('#filterType').val('');
    $('#filterYearStart').val('');
    $('#filterYearEnd').val('');
    $('#searchOperations').val('');
    applyFilters();
  });

  applyFilters();
});
