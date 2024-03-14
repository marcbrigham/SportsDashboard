<template>
  <div
    class="flex-grow overflow-y-scroll h-[calc(100vh_-_48px)] border-b border-gray-200 dark:border-gray-800"
  >
    <Tabs default-value="nfl">
      <div class="p-4">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="nfl">🏈 NFL</TabsTrigger>
          <TabsTrigger value="ncaam">🏀 NCAA M</TabsTrigger>
          <TabsTrigger value="nhl">🏒 NHL</TabsTrigger>
        </TabsList>
      </div>
      <main>
        <keep-alive>
          <TabsContent value="nfl">
            <div class="grid md:grid-cols-2 lg:grid-cols-3">
              <section
                class="w-full mx-auto p-6 border-r border-gray-200 dark:border-gray-800"
              >
                <NflSchedule />
              </section>
              <section
                class="w-full mx-auto p-6 border-r border-gray-200 dark:border-gray-800"
              >
                <h2 class="font-semibold text-2xl">Scores</h2>
                <p>Coming Soon</p>
              </section>
              <section
                class="w-full mx-auto p-6 border-r border-gray-200 dark:border-gray-800"
              >
                <h2 class="font-semibold text-2xl">Conference</h2>
                <p>Coming Soon</p>
              </section>
            </div>
          </TabsContent>
        </keep-alive>
        <keep-alive>
          <TabsContent value="ncaam">
            <div class="grid md:grid-cols-2 lg:grid-cols-3">
              <section
                class="w-full mx-auto p-6 border-r border-gray-200 dark:border-gray-800"
              >
                <NcaaMSchedule />
              </section>
              <section
                class="w-full mx-auto p-6 border-r border-gray-200 dark:border-gray-800"
              >
                <h2 class="font-semibold text-2xl">Scores</h2>
                <p>Coming Soon</p>
              </section>
              <section
                class="w-full mx-auto p-6 border-r border-gray-200 dark:border-gray-800"
              >
                <h2 class="font-semibold text-2xl">Conference</h2>
                <p>Coming Soon</p>
              </section>
            </div>
          </TabsContent>
        </keep-alive>
        <keep-alive>
          <TabsContent value="nhl">
            <div class="grid md:grid-cols-2 lg:grid-cols-3">
              <section
                class="w-full mx-auto p-6 border-r border-gray-200 dark:border-gray-800"
              >
                <NhlSchedule />
              </section>
              <section
                class="w-full mx-auto p-6 border-r border-gray-200 dark:border-gray-800"
              >
                <h2 class="font-semibold text-2xl">Scores</h2>
                <NhlScores />
              </section>
              <section
                class="w-full mx-auto p-6 border-r border-gray-200 dark:border-gray-800"
              >
                <h2 class="font-semibold text-2xl">Conference</h2>
                <p>Coming Soon</p>
              </section>
            </div>
          </TabsContent>
        </keep-alive>
              <section
                class="w-full mx-auto p-6 border-r border-gray-200 dark:border-gray-800"
              >
                <h2 class="font-semibold text-2xl">Scores</h2>
                <p>Coming Soon</p>
              </section>
              <section
                class="w-full mx-auto p-6 border-r border-gray-200 dark:border-gray-800"
              >
                <h2 class="font-semibold text-2xl">Conference</h2>
                <p>Coming Soon</p>
              </section>
            </div>
          </TabsContent>
        </keep-alive>
      </main>
    </Tabs>
  </div>
</template>

<script setup>
import { provide, ref } from "vue";
import NflSchedule from "../components/nflSchedule.vue";
import NhlSchedule from "../components/nhlSchedule.vue";
import NhlScores from "../components/nhlScores.vue";
import NcaaMSchedule from "../components/ncaaMSchedule.vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const nflSelectedTeamId = ref("1");
const ncaamSelectedTeamId = ref("183");
const nhlSelectedTeamId = ref("1");

provide("nflSelectedTeamId", nflSelectedTeamId);
provide("ncaamSelectedTeamId", ncaamSelectedTeamId);
provide("nhlSelectedTeamId", nhlSelectedTeamId);
</script>
