//ensures js code runs after the html doc has been fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = "85b4555b07aa459cbbc8779610f85084";
    const teamInfoUrl = `https://api.sportsdata.io/v3/nfl/scores/json/AllTeams?key=${apiKey}`;
    const teamSelect = document.getElementById("team-select");
    const infoTable = document.getElementById("info-table");

    let teamDataArray = [];

    async function loadTeamInfo() {
        try {
            const response = await fetch(teamInfoUrl);
            teamDataArray = await response.json();
            console.log("Team data array loaded:", teamDataArray);
        } catch (error) {
            console.error('Error loading team data array:', error);
        }
    }

    function displayTeamData(teamID) {
        //find selected team data
        const teamData = teamDataArray.find(team => team.TeamID == teamID);
        if (!teamData) return;

        // Clear the table content
        infoTable.innerHTML = '';

        // Create Conference and Division Info Table
        let conferenceDivisionTable = `
            <tr><th>Conference</th><td>${teamData.Conference}</td></tr>
            <tr><th>Division</th><td>${teamData.Division}</td></tr>
        `;

        // Create Coaches Info Table
        let coachesTable = `
            <tr><th>Head Coach</th><td>${teamData.HeadCoach}</td></tr>
            <tr><th>Offensive Coordinator</th><td>${teamData.OffensiveCoordinator}</td></tr>
            <tr><th>Defensive Coordinator</th><td>${teamData.DefensiveCoordinator}</td></tr>
            <tr><th>Special Teams Coach</th><td>${teamData.SpecialTeamsCoach}</td></tr>
        `;

        // Create Stadium Info Table
        const formattedCapacity = teamData.StadiumDetails.Capacity.toLocaleString();
        let stadiumTable = `
            <tr><th>Stadium Name</th><td>${teamData.StadiumDetails.Name}</td></tr>
            <tr><th>City</th><td>${teamData.StadiumDetails.City},  ${teamData.StadiumDetails.State}</td></tr>
            <tr><th>Capacity</th><td>${formattedCapacity}</td></tr>
            <tr><th>Playing Surface</th><td>${teamData.StadiumDetails.PlayingSurface}</td></tr>
        `;

        // Append tables to infoTable
        infoTable.innerHTML += `
            <h3>Conference and Division Info</h3>
            <table class="info-subtable">${conferenceDivisionTable}</table>
            <h3>Coaches Info</h3>
            <table class="info-subtable">${coachesTable}</table>
            <h3>Stadium Info</h3>
            <table class="info-subtable">${stadiumTable}</table>
        `;
    }


    // Event listener for team selection
    teamSelect.addEventListener("change", () => {
        displayTeamData(teamSelect.value);
    });

    // Initialize the page
    async function initializePage() {
        await loadTeamInfo();
        // Additional initialization logic can go here
    }

    // Call the initializePage function
    initializePage();
});