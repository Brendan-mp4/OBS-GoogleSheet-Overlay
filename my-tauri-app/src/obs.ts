import OBSWebSocket from "obs-websocket-js";

export class OBS {
  obs: OBSWebSocket;
  ipAddress: string;
  password: string;

  constructor(ipAddress: string, password: string) {
    this.obs = new OBSWebSocket();
    this.ipAddress = ipAddress;
    this.password = password;
  }

  async connect(): Promise<boolean> {
    try {
      await this.obs.connect(`ws://${this.ipAddress}`, this.password);
      console.log("Connected to OBS");
      return true;
    } catch (error) {
      console.error("Connection failed:", error);
      return false;
    }
  }

  async updateInput(inputName: string, inputType: string, data: string): Promise<boolean> {
    // Code for updating text or image sources based on type.
    try {
      if (inputType === "text") {
        await this.obs.call("SetInputSettings", {
          inputName,
          inputSettings: { text: data }
        });
      } else if (inputType === "image") {
        await this.obs.call("SetInputSettings", {
          inputName,
          inputSettings: { file: data }
        });
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}