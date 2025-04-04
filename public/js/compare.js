document.addEventListener('DOMContentLoaded', function() {
    const vehicle1Select = document.getElementById('vehicle1');
    const vehicle2Select = document.getElementById('vehicle2');
    const resultsDiv = document.getElementById('comparison-results');

    async function updateComparison() {
        const vehicle1Id = vehicle1Select.value;
        const vehicle2Id = vehicle2Select.value;

        if (vehicle1Id && vehicle2Id) {
            try {
                const response = await fetch(`/inv/compare/${vehicle1Id}/${vehicle2Id}`);
                const data = await response.json();
                
                if (data.error) {
                    resultsDiv.innerHTML = `<p class="error">${data.error}</p>`;
                    return;
                }

                const vehicle1 = data.vehicle1;
                const vehicle2 = data.vehicle2;

                resultsDiv.innerHTML = `
                    <div class="comparison-grid">
                        <div class="vehicle-card">
                            <h3>${vehicle1.inv_make} ${vehicle1.inv_model}</h3>
                            <img src="${vehicle1.inv_image}" alt="${vehicle1.inv_make} ${vehicle1.inv_model}">
                            <div class="specs">
                                <p><strong>Year:</strong> ${vehicle1.inv_year}</p>
                                <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle1.inv_price)}</p>
                                <p><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicle1.inv_miles)}</p>
                                <p><strong>Color:</strong> ${vehicle1.inv_color}</p>
                                <p><strong>Description:</strong> ${vehicle1.inv_description}</p>
                            </div>
                        </div>
                        <div class="vehicle-card">
                            <h3>${vehicle2.inv_make} ${vehicle2.inv_model}</h3>
                            <img src="${vehicle2.inv_image}" alt="${vehicle2.inv_make} ${vehicle2.inv_model}">
                            <div class="specs">
                                <p><strong>Year:</strong> ${vehicle2.inv_year}</p>
                                <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle2.inv_price)}</p>
                                <p><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicle2.inv_miles)}</p>
                                <p><strong>Color:</strong> ${vehicle2.inv_color}</p>
                                <p><strong>Description:</strong> ${vehicle2.inv_description}</p>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                resultsDiv.innerHTML = '<p class="error">Error loading comparison data</p>';
            }
        } else {
            resultsDiv.innerHTML = '<p>Please select two vehicles to compare</p>';
        }
    }

    vehicle1Select.addEventListener('change', updateComparison);
    vehicle2Select.addEventListener('change', updateComparison);
}); 