import { defineStore } from "pinia";

export const useNcaaMStore = defineStore("ncaamteam", {
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
          `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/${teamId}/schedule`
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
        let fetchPromises = [];

        // Prepare fetch promises for all pages
        for (let page = 1; page <= 8; page++) {
          fetchPromises.push(
            fetch(
              `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams?page=${page}`
            )
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch teams on page ${page}`);
                }
                return response.json();
              })
              .then((data) => {
                if (data && data.teams) {
                  return data.teams.map((team) => ({
                    value: team.id.toString(),
                    name: team.displayName,
                  }));
                }
                return [];
              })
          );
        }

        // Wait for all fetch promises to resolve
        const pagesTeams = await Promise.all(fetchPromises);
        // Flatten the array of arrays and update the state
        this.teams = pagesTeams.flat();
      } catch (error) {
        console.error("Failed to load teams:", error);
        this.error = error;
      }
    },
  },
});
