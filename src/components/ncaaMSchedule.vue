<template>
  <div class="max-w[800]">
    <div class="flex items-center">
      <img
        v-if="currentTeamLogo"
        :src="currentTeamLogo"
        :alt="currentTeamName + ' Logo'"
        class="h-6 w-6"
      />
      <div
        v-else
        class="h-6 w-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"
      ></div>
      <h1 class="font-semibold text-2xl ml-2">{{ currentTeamName }}</h1>
    </div>
    <h3 class="text-gray-700 dark:text-gray-300 mb-2">
      {{ schedules[selectedTeamId]?.team.recordSummary }} •
      {{ schedules[selectedTeamId]?.team.standingSummary }}
    </h3>
    <div
      class="mb-6 border border-gray-300 dark:border-gray-700 rounded-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    >
      <Select v-model="selectedTeamId">
        <SelectTrigger>
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-for="team in sortedTeams"
              :key="team.value"
              :value="team.value"
              class="text-gray-800"
            >
              {{ team.name }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <h2 class="font-semibold text-xl">Schedule</h2>
    <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Full</h3>
    <div v-if="error">Error: {{ error.message }}</div>
    <ul v-else>
      <li v-for="game in schedules[selectedTeamId]?.events" :key="game.id">
        <div v-for="competition in game.competitions" :key="competition">
          <template
            v-for="competitor in competition.competitors"
            :key="competitor"
          >
            <template v-if="competitor.team.id !== selectedTeamId">
              <div
                class="flex justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800"
              >
                <div class="flex">
                  <img
                    :src="competitor.team.logos[0]?.href"
                    alt="Team Logo"
                    class="h-5 w-5"
                    width="20"
                    height="20"
                  />
                  <router-link
                    :to="`/nfl/${competitor.team.id}`"
                    class="font-semibold ml-4"
                    >{{ competitor.team.displayName }}
                  </router-link>
                </div>
                <div
                  class="flex flex-row-reverse justify-end min-[450px]:flex-row"
                >
                  <p class="text-gray-700 dark:text-gray-300">
                    {{ getScoreAndResult(competition).scoreDisplay }}
                  </p>
                  <p
                    :class="[
                      'font-semibold',
                      'text-green-700',
                      'dark:text-green-500',
                      'ml-0',
                      'min-[450px]:ml-2',
                      'w-5',
                      'mr-4',
                      'min-[450px]:mr-0',
                      'text-center',
                      getScoreAndResult(competition).resultClass,
                    ]"
                  >
                    {{ getScoreAndResult(competition).resultDisplay }}
                  </p>
                </div>
              </div>
            </template>
          </template>
        </div>
      </li>
    </ul>
  </div>
  <router-view></router-view>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useNcaaMStore } from "../stores/ncaaMStore";
import { storeToRefs } from "pinia";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const selectedTeamId = ref("1"); // Initialize with an appropriate default value if necessary
const store = useNcaaMStore();

const currentTeam = computed(() => store.schedules[selectedTeamId.value]?.team);

const currentTeamLogo = computed(() => currentTeam.value?.logo);
const currentTeamName = computed(() => currentTeam.value?.displayName);

const sortedTeams = computed(() => {
  console.log(store.teams);
  return store.teams.slice().sort((a, b) => a.name.localeCompare(b.name));
});

const getScoreAndResult = (competition) => {
  let selectedCompetitor = null;
  let opponentCompetitor = null;

  for (const competitor of competition.competitors) {
    if (competitor.team.id === selectedTeamId.value) {
      selectedCompetitor = competitor;
    } else {
      opponentCompetitor = competitor;
    }
  }

  if (!selectedCompetitor || !opponentCompetitor) {
    return { scoreDisplay: "Data missing", resultDisplay: "", resultClass: "" };
  }
  console.log(selectedCompetitor.score);
  const scoreDisplay = `${selectedCompetitor.score?.displayValue}-${opponentCompetitor.score?.displayValue}`;
  const resultDisplay = selectedCompetitor.winner ? "W" : "L";
  const resultClass = selectedCompetitor.winner
    ? "text-green-700 dark:text-green-500"
    : "text-red-700 dark:text-red-500";

  return { scoreDisplay, resultDisplay, resultClass };
};

watch(selectedTeamId, async (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {
    await store.loadSchedule(newValue);
  }
});

// If you want to load a default team's schedule on mounted
onMounted(async () => {
  await store.loadTeams();
  if (store.teams.length > 0 && !selectedTeamId.value) {
    // Set default selected team ID only if it hasn't been set already
    selectedTeamId.value = store.teams[0].value; // Assuming the first team is a sensible default
    await store.loadSchedule(selectedTeamId.value);
  }
});

const { schedules, error } = storeToRefs(store);
</script>
