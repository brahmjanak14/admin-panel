import type { Lead } from '../../../modules/leads/leads.types';
import type { LeadIntegration } from './types';

const integrations: LeadIntegration[] = [];

export function registerIntegration(integration: LeadIntegration): void {
  if (integrations.some((i) => i.name === integration.name)) return;
  integrations.push(integration);
}

/**
 * Fan-out: notify every enabled integration that supports this lead.
 * Individual failures are logged and never block the API response path.
 */
export async function notifyLeadCreated(lead: Lead): Promise<void> {
  const tasks = integrations
    .filter((integration) => integration.isEnabled() && integration.supports(lead))
    .map(async (integration) => {
      try {
        await integration.sync(lead);
      } catch (err) {
        console.error(`[integrations:${integration.name}] Failed to sync lead`, lead.id, err);
      }
    });

  await Promise.all(tasks);
}
