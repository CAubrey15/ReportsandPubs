$(document).ready(function () {

  function applyFilters() {
    const typeFilter = $('#filterType').val().toLowerCase();
    const yearFilter = $('#filterYear').val().toLowerCase();
    const searchTerm = $('#searchOperations').val().toLowerCase();

    $('.data-row').each(function () {
      const card = $(this);

      const type = (card.data('type') || '').toLowerCase();
      const year = (card.data('year') || '').toString().toLowerCase();
      const text = card.text().toLowerCase();

      const typeMatch = typeFilter === '' || type === typeFilter;
      const yearMatch = yearFilter === '' || year === yearFilter;
      const searchMatch = searchTerm === '' || text.includes(searchTerm);

      if (typeMatch && yearMatch && searchMatch) {
        card.show();
      } else {
        card.hide();
      }
    });
  }

  // ✅ Dropdown filters (auto apply)
  $('#filterType, #filterYear').on('change', applyFilters);

  // ✅ Live search (instant filtering)
  $('#searchOperations').on('input', applyFilters);

  // ✅ Reset button
  $('#resetFilters').on('click', function () {
    $('#filterType').val('');
    $('#filterYear').val('');
    $('#searchOperations').val('');
    applyFilters();
  });

  // ✅ Initial load
  applyFilters();
});
