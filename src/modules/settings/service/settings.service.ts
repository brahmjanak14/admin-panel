import { settingsModel } from '../model/settings.model';

export const settingsService = {
  async get(): Promise<Record<string, unknown>> {
    let setting = await settingsModel.findFirst();
    if (!setting) {
      setting = await settingsModel.create({});
    }
    return setting.data as Record<string, unknown>;
  },

  async update(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    let setting = await settingsModel.findFirst();
    if (!setting) {
      setting = await settingsModel.create(body);
    } else {
      setting = await settingsModel.update(setting.id, {
        ...(setting.data as object),
        ...body,
      });
    }
    return setting.data as Record<string, unknown>;
  },
};
