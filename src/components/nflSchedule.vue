<template>
  <div class="max-w[800]">
    <div class="flex items-center">
      <Avatar
        class="bg-transparent h-6 w-6"
        v-if="schedules[selectedTeamId]?.team.logo"
      >
        <AvatarImage
          :src="schedules[selectedTeamId]?.team.logo"
          :alt="schedules[selectedTeamId]?.team.displayName + ' Logo'"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div
        v-else
        class="h-6 w-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"
      ></div>
      <h1 class="font-semibold text-2xl ml-2">
        {{ schedules[selectedTeamId]?.team.displayName }}
      </h1>
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
                <div class="flex items-center">
                  <Avatar class="bg-transparent h-5 w-5">
                    <AvatarImage
                      :src="competitor.team.logos[0]?.href"
                      alt="Team Logo"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
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
import { onMounted, watch, computed, inject } from "vue";
import { useNflStore } from "../stores/nflStore";
import { storeToRefs } from "pinia";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const selectedTeamId = inject("nflSelectedTeamId"); // Initialize with an appropriate default value if necessary
const store = useNflStore();

const sortedTeams = computed(() => {
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
  const scoreDisplay = `${selectedCompetitor.score.displayValue}-${opponentCompetitor.score.displayValue}`;
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
onMounted(() => {
  store.loadTeams(); // This will load your teams
  if (selectedTeamId.value) {
    store.loadSchedule(selectedTeamId.value); // And this will load the schedule for the default or selected team
  }
});

const { schedules, error } = storeToRefs(store);
</script>
