// Local dev cron — runs only in development mode
// Import this in a server-side entry point if needed

if (process.env.NODE_ENV === "development") {
  import("node-cron").then(({ default: cron }) => {
    cron.schedule("0 1 * * *", async () => {
      console.log("[cron] Running daily tool sync...");
      try {
        const res = await fetch("http://localhost:3000/api/fetch-tools", {
          method: "POST",
        });
        const data = await res.json();
        console.log("[cron] Sync result:", data);
      } catch (err) {
        console.error("[cron] Sync failed:", err);
      }
    });
    console.log("[cron] Daily sync scheduled for 01:00 local time.");
  });
}
