import { defineStore } from "pinia";

export const useMmaStore = defineStore("mmateam", {
  state: () => ({
    schedules: {},
    error: null,
  }),
  actions: {
    async loadSchedule() {
      try {
        this.error = null;
        const response = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch the schedule");
        }
        const data = await response.json();
        console.log(data);
        this.schedules = data;
      } catch (error) {
        console.error("Failed to load schedule:", error);
        this.error = error;
      }
    },
  },
});
