// Resource Library page-specific JavaScript
// Separated from resource-library.html.
// Handles category filtering, search, and empty-state display.

let activeFilter = 'all';

        function setFilter(btn) {
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            filterCards();
        }

        function filterCards() {
            const query = document.getElementById('searchInput').value.toLowerCase().trim();
            const cards = document.querySelectorAll('.resource-card');
            let visible = 0;

            cards.forEach(card => {
                const matchFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
                const matchSearch = !query || card.dataset.title.includes(query);
                const show = matchFilter && matchSearch;
                card.classList.toggle('hidden', !show);
                if (show) visible++;
            });

            document.getElementById('emptyState').style.display = visible === 0 ? 'block' : 'none';
        }