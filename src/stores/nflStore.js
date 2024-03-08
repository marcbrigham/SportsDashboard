import { defineStore } from "pinia";

export const useNflStore = defineStore("nflteam", {
  state: () => ({
    schedules: {}, // Holds multiple team schedules
    teams: [], // To store team details
    error: null,
  }),
  actions: {
    async loadSchedule(teamId) {
      // Your existing schedule loading logic remains unchanged
      if (this.schedules[teamId]) {
        return;
      }
      try {
        this.error = null;
        const response = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}/schedule`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch the schedule");
        }
        const data = await response.json();
        this.schedules[teamId] = data;
      } catch (error) {
        console.error("Failed to load schedule:", error);
        this.error = error;
      }
    },
    async loadTeams() {
      try {
        this.error = null;
        const response = await fetch(
          "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }
        const data = await response.json();

        // Correcting the path to team information based on the JSON structure
        if (data && data.sports && data.sports.length > 0) {
          const nflLeague = data.sports
            .find((sport) => sport.name === "Football")
            .leagues.find(
              (league) => league.name === "National Football League"
            );
          if (nflLeague && nflLeague.teams) {
            this.teams = nflLeague.teams.map((team) => ({
              value: team.team.id.toString(),
              name: team.team.displayName,
            }));
          } else {
            console.error("No NFL teams found in the response");
            this.error = "No NFL teams found";
          }
        } else {
          console.error("Unexpected data structure:", data);
          this.error = "Unexpected data structure";
        }
      } catch (error) {
        console.error("Failed to load teams:", error);
        this.error = error;
      }
    },
  },
});
