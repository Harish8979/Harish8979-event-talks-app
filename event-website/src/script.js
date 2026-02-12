document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('categorySearch');
    const talkList = document.getElementById('talkList');

    if (searchInput && talkList) {
        searchInput.addEventListener('keyup', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            const talkItems = talkList.querySelectorAll('.talk-item:not(.lunch-break)'); // Exclude lunch break

            talkItems.forEach(item => {
                const categoryElement = item.querySelector('.category');
                if (categoryElement) {
                    const categories = categoryElement.textContent.toLowerCase();
                    if (categories.includes(searchTerm)) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
        });
    }
});
