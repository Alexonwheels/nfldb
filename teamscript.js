document.addEventListener('DOMContentLoaded', () => {
    const apiKey = "85b4555b07aa459cbbc8779610f85084";
    const standingsUrl = "https://api.sportsdata.io/v3/nfl/scores/json/Standings/";

    const searchBox = document.querySelector(".search input");
    const searchBtn = document.querySelector(".search button");
    const teamsTable = document.getElementById("teams-table");
    const sortBtn = document.querySelector(".sort-button");
    const sortWinsLossesBtn = document.querySelector(".sort-wins-button");
    const clearBtn = document.querySelector(".clear-button");

    let nameSortDirection = 'desc'; // Initial sort direction for Name
    let currentSortKey = 'Wins'; // Initial sort key for Wins or Losses

    // Function to fetch standings data for a given year
    async function fetchStandings(year) {
        try {
            const response = await fetch(`${standingsUrl}${year}?key=${apiKey}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching standings:', error);
            return [];
        }
    }

    // Function to display standings in the table
    function displayStandings(data) {
        teamsTable.innerHTML = `
            <tr>
                <th>Team</th>
                <th>Wins</th>
                <th>Losses</th>
            </tr>
        `;
        data.forEach(team => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${team.Name}</td>
                <td>${team.Wins}</td>
                <td>${team.Losses}</td>
            `;
            teamsTable.appendChild(row);
        });
    }

    // Function to sort standings by a specific key and direction
    function sortStandings(data, key, direction) {
        data.sort((a, b) => {
            const valueA = (key === 'Name') ? a[key].toLowerCase() : a[key];
            const valueB = (key === 'Name') ? b[key].toLowerCase() : b[key];
            let comparison = 0;
            if (valueA > valueB) {
                comparison = 1;
            } else if (valueA < valueB) {
                comparison = -1;
            }
            return (direction === 'desc') ? (comparison * -1) : comparison;
        });
        return data;
    }

    // Event listener for search button
    searchBtn.addEventListener("click", async () => {
        const year = searchBox.value.trim();
        if (year) {
            const data = await fetchStandings(year);
            displayStandings(data);
        }
    });

    // Initial load of standings
    async function initializePage() {
        const defaultYear = new Date().getFullYear();
        const data = await fetchStandings(defaultYear);
        displayStandings(data);
    }

    // Event listener for clear button
    clearBtn.addEventListener("click", () => {
        teamsTable.innerHTML = `
            <tr>
                <th>Team</th>
                <th>Wins</th>
                <th>Losses</th>
            </tr>
        `;
        searchBox.value = "";
    });

    // Event listener for sort buttons
    function setupSortButtons() {
        sortBtn.addEventListener("click", () => {
            const rows = Array.from(teamsTable.querySelectorAll("tr:not(:first-child)"));
            const currentData = rows.map(row => ({
                Name: row.cells[0].textContent,
                Wins: parseInt(row.cells[1].textContent),
                Losses: parseInt(row.cells[2].textContent)
            }));

            // Toggle nameSortDirection between 'desc' and 'asc'
            nameSortDirection = nameSortDirection === 'desc' ? 'asc' : 'desc';

            const sortedData = sortStandings(currentData, 'Name', nameSortDirection);
            displayStandings(sortedData);
        });

        sortWinsLossesBtn.addEventListener("click", () => {
            const rows = Array.from(teamsTable.querySelectorAll("tr:not(:first-child)"));
            const currentData = rows.map(row => ({
                Name: row.cells[0].textContent,
                Wins: parseInt(row.cells[1].textContent),
                Losses: parseInt(row.cells[2].textContent)
            }));

            // Toggle currentSortKey between 'Wins' and 'Losses'
            currentSortKey = currentSortKey === 'Wins' ? 'Losses' : 'Wins';

            const sortedData = sortStandings(currentData, currentSortKey, 'desc');
            displayStandings(sortedData);
        });
    }

    // Initialize page and setup listeners
    initializePage().then(() => {
        setupSortButtons();
    });
});
