import { getInngestClient, getQueueFunctions } from "@/services/queue";
import { serve } from "inngest/express";

export const inngestRoutes = serve({
  client: getInngestClient(),
  functions: getQueueFunctions(),
});
