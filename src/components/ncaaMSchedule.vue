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
      {{ currentTeamRecord.recordSummary }} •
      {{ currentTeamRecord.standingSummary }}
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
                    :src="getTeamLogoHref(competitor)"
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

const selectedTeamId = ref("1");
const store = useNcaaMStore();

// Convert the store's state properties to reactive refs
const { schedules, error } = storeToRefs(store);

const currentTeam = computed(() => {
  return store.teams.find((team) => team.value === selectedTeamId.value);
});

const currentTeamLogo = computed(() => currentTeam.value?.logo);
const currentTeamName = computed(() => currentTeam.value?.name);

const sortedTeams = computed(() => {
  return store.teams.slice().sort((a, b) => a.name.localeCompare(b.name));
});

const currentTeamRecord = computed(() => {
  const schedule = schedules.value[selectedTeamId.value];
  return {
    recordSummary: schedule?.team?.recordSummary || "No record available",
    standingSummary: schedule?.team?.standingSummary || "No standing available",
  };
});

const currentSchedule = computed(
  () => schedules[selectedTeamId.value]?.value || {}
);

const getScoreAndResult = (competition) => {
  const defaultResult = {
    scoreDisplay: "No data",
    resultDisplay: "",
    resultClass: "",
  };

  if (
    !competition ||
    !Array.isArray(competition.competitors) ||
    competition.competitors.length === 0
  ) {
    return defaultResult;
  }

  let selectedCompetitor = competition.competitors.find(
    (c) => c.team.id === selectedTeamId.value
  );
  let opponentCompetitor = competition.competitors.find(
    (c) => c.team.id !== selectedTeamId.value
  );

  if (!selectedCompetitor || !opponentCompetitor) {
    return defaultResult;
  }

  const scoreDisplay = `${selectedCompetitor.score?.displayValue || "N/A"} - ${
    opponentCompetitor.score?.displayValue || "N/A"
  }`;
  const resultDisplay = selectedCompetitor.winner ? "W" : "L";
  const resultClass = selectedCompetitor.winner
    ? "text-green-700 dark:text-green-500"
    : "text-red-700 dark:text-red-500";

  return { scoreDisplay, resultDisplay, resultClass };
};

const getTeamLogoHref = (competitor) => {
  return competitor?.team?.logos?.[0]?.href ?? "default_logo_url_here";
};

watch(selectedTeamId, async (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {
    await store.loadSchedule(newValue);
  }
});

onMounted(async () => {
  await store.loadTeams();
  if (store.teams.length > 0 && selectedTeamId.value === "1") {
    selectedTeamId.value = store.teams[0].value;
    await store.loadSchedule(selectedTeamId.value);
  }
});
</script>
