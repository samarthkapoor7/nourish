import { inngest } from '@/inngest/client';
import { runNourishPlanningCycle } from '@/lib/engine/orchestrator';

/**
 * Scheduled replanning loop.
 * Trigger this function every few minutes from Inngest to keep Nourish alive.
 */
export const nourishPlanningLoop = inngest.createFunction(
  { id: 'nourish-planning-loop', triggers: [{ event: 'nourish/agent.run' }] },
  async ({ logger }) => {
    const result = await runNourishPlanningCycle({});
    logger.info('Nourish planning loop completed', {
      state: result.state,
      confidence: result.confidence,
      feedCount: result.feed.length,
    });
    return result;
  },
);
