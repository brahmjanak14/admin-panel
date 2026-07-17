import type { Lead } from '../../../modules/leads/leads.types';

/**
 * Contract every outbound integration must implement.
 * Add Slack, email, CRM, etc. by creating a new folder that exports this shape.
 */
export interface LeadIntegration {
  readonly name: string;
  isEnabled(): boolean;
  /** Return true if this integration handles the given lead type. */
  supports(lead: Lead): boolean;
  sync(lead: Lead): Promise<void>;
}
