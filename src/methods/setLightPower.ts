import { AxiosInstance } from "axios";

export async function setLightPower(
  axiosInstance: AxiosInstance,
  lightId: string,
  isOn: boolean
): Promise<boolean> {
  try {
    const requestBody = {
      on: { on: isOn }
    };

    const response = await axiosInstance.put(`/light/${lightId}`, requestBody);

    if (response.status === 200) {
      return true;
    } else {
      console.warn(`Unexpected response status: ${response.status}`);
      return false;
    }
  } catch (err: any) {
    console.error(`Failed to update light power (${lightId}):`, err.message);
    if (err.response) {
      console.error("Response Data:", JSON.stringify(err.response.data, null, 2));
    }
    return false;
  }
}
