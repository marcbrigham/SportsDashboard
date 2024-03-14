<template>
  <div class="max-w[800]">
    <h3 class="text-gray-700 dark:text-gray-300 mb-2"></h3>
    <h2 class="font-semibold text-xl">Schedule</h2>
    <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Full</h3>
    <div v-if="error">Error: {{ error.message }}</div>
    <ul v-else>
      <li v-for="game in schedules?.events" :key="game.id">
        <div v-for="competition in game.competitions" :key="competition">
          <template
            v-for="competitor in competition.competitors"
            :key="competitor"
          >
            <template v-if="competitor.athlete.id">
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
                    :to="`/mma/${competitor.athlete.id}`"
                    class="font-semibold ml-4"
                    >{{ competitor.team.displayName }}
                  </router-link>
                </div>
                <div
                  class="flex flex-row-reverse justify-end min-[450px]:flex-row"
                >
                  <p class="text-gray-700 dark:text-gray-300"></p>
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
                    ]"
                  ></p>
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
import { onMounted } from "vue";
import { useMmaStore } from "../stores/mmaStore";
import { storeToRefs } from "pinia";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const store = useMmaStore();

// If you want to load a default team's schedule on mounted
onMounted(() => {
  store.loadSchedule(); // And this will load the schedule for the default or selected team
});

const { schedules, error } = storeToRefs(store);
</script>
