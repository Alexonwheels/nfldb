document.addEventListener('DOMContentLoaded', () => {
    const apiKey = "85b4555b07aa459cbbc8779610f85084";
    const standingsUrl = "https://api.sportsdata.io/v3/nfl/scores/json/Standings/";

    const searchBox = document.querySelector(".search input");
    const searchBtn = document.querySelector(".search button");
    const teamsTable = document.getElementById("teams-table");
    const clearBtn = document.querySelector(".clear-button");

    let sortDirection = {}; // Store sort direction for each column

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
                <th data-key="Name">Team</th>
                <th data-key="Wins">Wins</th>
                <th data-key="Losses">Losses</th>
                <th data-key="Ties">Ties</th>
                <th data-key="Percentage">Pct</th>
                <th data-key="HomeWins">Home</th>
                <th data-key="AwayWins">Away</th>
                <th data-key="DivisionWins">Div</th>
                <th data-key="ConferenceWins">Conf</th>
                <th data-key="PointsFor">PF</th>
                <th data-key="PointsAgainst">PA</th>
                <th data-key="NetPoints">DIFF</th>
                <th data-key="Streak">Streak</th>
            </tr>
        `;
        data.forEach(team => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${team.Name}</td>
                <td>${team.Wins}</td>
                <td>${team.Losses}</td>
                <td>${team.Ties}</td>
                <td>${team.Percentage}</td>
                <td>${team.HomeWins}-${team.HomeLosses}</td>
                <td>${team.AwayWins}-${team.AwayLosses}</td>
                <td>${team.DivisionWins}-${team.DivisionLosses}</td>
                <td>${team.ConferenceWins}-${team.ConferenceLosses}</td>
                <td>${team.PointsFor}</td>
                <td>${team.PointsAgainst}</td>
                <td>${team.NetPoints}</td>
                <td>${team.Streak}</td>
            `;
            teamsTable.appendChild(row);
        });
        setupHeaderSorting(data);
    }

    // Function to sort standings by a specific key and direction
    function sortStandings(data, key, direction) {
        data.sort((a, b) => {
            const valueA = typeof a[key] === 'string' ? a[key].toLowerCase() : a[key];
            const valueB = typeof b[key] === 'string' ? b[key].toLowerCase() : b[key];
            let comparison = 0;
            if (valueA > valueB) {
                comparison = 1;
            } else if (valueA < valueB) {
                comparison = -1;
            }
            return direction === 'desc' ? comparison * -1 : comparison;
        });
        return data;
    }

    // Function to set up table header sorting
    function setupHeaderSorting(data) {
        const headers = teamsTable.querySelectorAll('th');
        headers.forEach(header => {
            const key = header.getAttribute('data-key');
            header.style.cursor = 'pointer';

            header.addEventListener('click', () => {
                const currentDirection = sortDirection[key] || 'asc'; // Default is ascending
                const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
                sortDirection[key] = newDirection;

                // Special case for "Team" (Name), default to ascending
                if (key === 'Name') {
                    sortDirection[key] = newDirection === 'desc' ? 'asc' : 'desc';
                }

                const sortedData = sortStandings(data, key, sortDirection[key]);
                displayStandings(sortedData);
            });
        });
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

    // Initialize page
    initializePage();
});
