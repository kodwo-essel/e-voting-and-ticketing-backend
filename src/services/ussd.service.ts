import { IUSSDService, USSDRequest, USSDResponse } from "../ussd.interface";
import { NaloUSSDService } from "./nalo-ussd.service";
import { Settings } from "../models/Settings.model";

type USSDProvider = "nalo";

export class USSDService {
  private static async getProvider(): Promise<USSDProvider> {
    const setting = await Settings.findOne({ key: "ussd_provider" });
    return (setting?.value as USSDProvider) || "nalo";
  }

  private static getService(): IUSSDService {
    // Always return nalo for now since it's the only provider
    return new NaloUSSDService();
  }

  static async handleRequest(request: USSDRequest): Promise<USSDResponse> {
    const service = this.getService();
    return service.handleRequest(request);
  }
}