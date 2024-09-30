document.addEventListener('DOMContentLoaded', () => {
    const apiKey = "85b4555b07aa459cbbc8779610f85084";
    const statsUrl = "https://api.sportsdata.io/v3/nfl/stats/json/BoxScoreByTeamFinal/";

    async function fetchStats(season, week, homeTeam) {
        try {
            const response = await fetch(`${statsUrl}${season}/${week}/${homeTeam}?key=${apiKey}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            return [];
        }
    }

    console.log(data);
});