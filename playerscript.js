//ensures js code runs after the html doc has been fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = "85b4555b07aa459cbbc8779610f85084";
    const depthChartsUrl = `https://api.sportsdata.io/v3/nfl/scores/json/DepthCharts?key=${apiKey}`;
    const offenseTable = document.getElementById("offense-table");
    const defenseTable = document.getElementById("defense-table");
    const specialTeamsTable = document.getElementById("special-teams-table");
    const teamSelect = document.getElementById("team-select");

    let depthChartsData = [];

    // load depth charts data once when the page loads
    async function loadDepthCharts() {
        try {
            const response = await fetch(depthChartsUrl);
            depthChartsData = await response.json();
            console.log("Depth charts data loaded:", depthChartsData);
        } catch (error) {
            console.error('Error loading depth charts data:', error);
        }
    }

    // function to filter and display data for the selected team in respective tables
    function displayTeamData(teamIndex) {
        displayPositionData(teamIndex, "Offense", offenseTable);
        displayPositionData(teamIndex, "Defense", defenseTable);
        displayPositionData(teamIndex, "SpecialTeams", specialTeamsTable);
    }

    // function to format positions with commas
    function formatPositions(positions) {
        return positions.join(', ');
    }

    function displayPositionData(teamIndex, positionType, table) {
        table.innerHTML = `
            <tr>
                <th>Player</th>
                <th>Position</th>
            </tr>
        `;

        const teamData = depthChartsData[teamIndex];
        if (!teamData) return;

        const players = teamData[positionType];
        const playersMap = new Map(); // Use a map to store combined positions for each player

        players.forEach(player => {
            const playerName = player.Name;
            const playerPosition = player.Position;

            if (playersMap.has(playerName)) {
                // Player already exists in map, append position
                playersMap.get(playerName).push(playerPosition);
            } else {
                // Player not yet in map, initialize with position array
                playersMap.set(playerName, [playerPosition]);
            }
        });

        // Iterate over playersMap to create table rows with combined positions
        playersMap.forEach((positions, playerName) => {
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${playerName}</td>
                <td>${formatPositions(positions)}</td>
            `;
            table.appendChild(tr);
        });
    }

    // Event listener for team selection
    teamSelect.addEventListener("change", () => {
        displayTeamData(teamSelect.value);
    });

    // Initialize the page
    async function initializePage() {
        await loadDepthCharts();
        // Additional initialization logic can go here
    }

    // Call the initializePage function
    initializePage();
});