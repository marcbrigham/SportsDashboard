<template>
  <div class="max-w[800]">
    <div v-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <template v-for="event in scores?.events" :key="event.id">
        <template
          v-for="competition in event.competitions"
          :key="competition.id"
        >
          <div class="pb-2 border-b border-gray-200 dark:border-gray-800">
            <p
              class="flex justify-end mr-4 mt-4 text-sm text-gray-600 dark:text-gray-400"
            >
              {{ event.status.type.detail }}
            </p>
            <a href="/nhl/252">
              <div class="flex flex-row justify-between px-4 py-2 h-[60px]">
                <div class="flex">
                  <img
                    alt="BYU Cougars"
                    width="24"
                    height="24"
                    class="h-6 w-6 mt-[2px]"
                    :src="competition.competitors[1].team.logo"
                  />
                  <div class="flex flex-col ml-4 leading-4 gap-y-1">
                    <p
                      class="font-semibold"
                      :class="[
                        competition.competitors[1].score >
                          competition.competitors[0].score ||
                        competition.competitors[1].score ===
                          competition.competitors[0].score
                          ? 'text-black dark:text-white'
                          : 'text-gray-600 dark:text-gray-400',
                      ]"
                    >
                      {{ competition.competitors[0].team.displayName }}
                    </p>
                    <p
                      class="text-sm text-gray-500"
                      :class="{
                        'text-gray-600 dark:text-gray-400':
                          competition.competitors[1].score >
                          competition.competitors[0].score,
                      }"
                    >
                      {{ competition.competitors[1].records[0].summary }}
                    </p>
                  </div>
                </div>
                <div
                  class="flex text-gray-500"
                  :class="{
                    'text-gray-900 dark:text-gray-100':
                      competition.competitors[1].score >
                        competition.competitors[0].score ||
                      competition.competitors[1].score ===
                        competition.competitors[0].score,
                  }"
                >
                  <p class="leading-normal font-semibold text-xl">
                    {{ competition.competitors[1].score }}
                  </p>
                </div>
              </div></a
            ><a href="/2116"
              ><div class="flex flex-row justify-between px-4 py-2 h-[60px]">
                <div class="flex">
                  <img
                    alt="UCF Knights"
                    fetchpriority="high"
                    width="24"
                    height="24"
                    decoding="async"
                    data-nimg="1"
                    class="h-6 w-6 mt-[2px]"
                    style="color: transparent"
                    :src="competition.competitors[0].team.logo"
                  />
                  <div class="flex flex-col ml-4 leading-4 gap-y-1">
                    <p
                      :class="{
                        'text-gray-500':
                          competition.competitors[0].score <
                          competition.competitors[1].score,
                      }"
                      class="font-semibold"
                    >
                      {{ competition.competitors[0].team.displayName }}
                    </p>
                    <p
                      class="text-sm"
                      :class="[
                        competition.competitors[0].score >
                          competition.competitors[1].score ||
                        competition.competitors[0].score ===
                          competition.competitors[1].score
                          ? 'text-gray-600 dark:text-gray-400'
                          : 'text-gray-500',
                      ]"
                    >
                      {{ competition.competitors[0].records[0].summary }}
                    </p>
                  </div>
                </div>
                <div class="flex">
                  <p
                    class="leading-normal font-semibold text-xl"
                    :class="{
                      'text-gray-500':
                        competition.competitors[0].score <
                        competition.competitors[1].score,
                    }"
                  >
                    {{ competition.competitors[0].score }}
                  </p>
                </div>
              </div></a
            >
          </div>
        </template>
      </template>
    </div>
  </div>
  <router-view></router-view>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useNhlStore } from "../stores/nhlStore";
import { storeToRefs } from "pinia";

const store = useNhlStore();

// If you want to load a default team's schedule on mounted
onMounted(() => {
  store.loadScores(); // This will load your teams
});

const { scores, error } = storeToRefs(store);
</script>
