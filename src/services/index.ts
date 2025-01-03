import { CronJob } from "cron";
import { Chedda } from "chedda-sdk";
import { LeaderboardService } from "./leaderboardService";
import { PriceService } from "./priceService";
import { PoolEventService } from "./poolEventsService";
import { jsonRpcUrl } from "../utils/constants";

const chedda = new Chedda(jsonRpcUrl);

const priceService = new PriceService(chedda);
const leaderboardService = new LeaderboardService(priceService);
const poolEventService = new PoolEventService(leaderboardService);

export const initLeaderboardServices = () => {
  // Start pool event listeners
  poolEventService.listenToPoolEvents();

  // Initialize points calculation cron job
  new CronJob(
    "* * * * *",
    () => leaderboardService.calculateHourlyPoints(),
    null,
    true,
    "UTC"
  ).start();
};
