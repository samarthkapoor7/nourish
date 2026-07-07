import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { nourishPlanningLoop } from '@/inngest/functions/nourish-planning-loop';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [nourishPlanningLoop],
});
