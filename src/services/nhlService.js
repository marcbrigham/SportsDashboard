export const fetchNhlSchedule = async () => {
  const url =
    "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams/1/schedule";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error; // Rethrow to handle it in the calling code
  }
};
