// Download counter functionality
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('download-btn');
    const downloadCountElement = document.getElementById('download-count');

    // Initial download count
    const INITIAL_COUNT = 812;
    const COUNTER_VERSION = 'v2'; // Change this to reset counter

    // Check if we need to reset the counter
    const storedVersion = localStorage.getItem('downloadCountVersion');
    if (storedVersion !== COUNTER_VERSION) {
        localStorage.setItem('downloadCount', INITIAL_COUNT);
        localStorage.setItem('downloadCountVersion', COUNTER_VERSION);
    }

    // Get the current count from localStorage or use initial count
    let currentCount = parseInt(localStorage.getItem('downloadCount')) || INITIAL_COUNT;

    // Format number with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Update the display
    function updateDisplay() {
        downloadCountElement.textContent = formatNumber(currentCount);
    }

    // Initialize display
    updateDisplay();

    // Handle download button click
    downloadBtn.addEventListener('click', function(e) {
        // Increment the counter
        currentCount++;

        // Save to localStorage
        localStorage.setItem('downloadCount', currentCount);

        // Update the display with animation
        downloadCountElement.style.transform = 'scale(1.2)';
        downloadCountElement.style.color = '#22c55e';

        setTimeout(() => {
            updateDisplay();
            downloadCountElement.style.transform = 'scale(1)';
            downloadCountElement.style.color = '';
        }, 300);
    });
});
