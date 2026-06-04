$(document).ready(function () {

  function applyFilters() {
    const typeFilter = $('#filterType').val().toLowerCase();
    const yearFilter = $('#filterYear').val().toLowerCase();
    const searchTerm = $('#searchOperations').val().toLowerCase();

    $('.operation-card').each(function () {
      const card = $(this);

      const type = (card.closest('.data-row').data('type') || '').toLowerCase();
      const year = (card.closest('.data-row').data('year') || '').toString().toLowerCase();
      const text = card.text().toLowerCase();

      const typeMatch = typeFilter === '' || type === typeFilter;
      const yearMatch = yearFilter === '' || year === yearFilter;
      const searchMatch = searchTerm === '' || text.includes(searchTerm);

      if (typeMatch && yearMatch && searchMatch) {
        card.removeClass('hidden');
      } else {
        card.addClass('hidden');
      }
    });
  }

  $('#filterType, #filterYear').on('change', applyFilters);
  $('#searchOperations').on('input', applyFilters);

  $('#resetFilters').on('click', function () {
    $('#filterType').val('');
    $('#filterYear').val('');
    $('#searchOperations').val('');
    applyFilters();
  });

  applyFilters();
});
