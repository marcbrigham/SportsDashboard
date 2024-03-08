import { defineStore } from "pinia";

export const useNcaaMStore = defineStore("ncaamteam", {
  state: () => ({
    schedules: {},
    teams: [],
    error: null,
  }),
  actions: {
    async loadSchedule(teamId) {
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
        let allTeams = [];

        for (let page = 1; page <= 8; page++) {
          const response = await fetch(
            `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams?page=${page}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch teams on page ${page}`);
          }
          const data = await response.json();
          const pageTeams = data.sports[0].leagues[0].teams.map((item) => ({
            value: item.team.id.toString(),
            name: item.team.displayName,
            logo: item.team.logos[0]?.href ?? null,
          }));

          allTeams = [...allTeams, ...pageTeams];
        }

        this.teams = allTeams;
      } catch (error) {
        console.error("Failed to load teams:", error);
        this.error = error;
      }
    },
  },
});
