import { defineStore } from "pinia";

export const useNhlStore = defineStore("nhlteam", {
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
          `https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams/${teamId}/schedule`
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
          "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }
        const data = await response.json();

        // Correcting the path to team information based on the JSON structure
        if (data && data.sports && data.sports.length > 0) {
          const nhlLeague = data.sports
            .find((sport) => sport.name === "Ice Hockey")
            .leagues.find((league) => league.name === "National Hockey League");
          if (nhlLeague && nhlLeague.teams) {
            this.teams = nhlLeague.teams.map((team) => ({
              value: team.team.id.toString(),
              name: team.team.displayName,
            }));
          } else {
            console.error("No NHL teams found in the response");
            this.error = "No NHL teams found";
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
