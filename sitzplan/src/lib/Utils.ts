import { Controller } from "./Controller";
import { StorageData } from "./Model";

export function getInitialDataFromUrl(): Controller {
  const data = getDataFromUrl();

  if (data) {
    return new Controller(
      data.className,
      data.roomName,
      data.rows,
      data.columns,
      data.fields
    );
  } else {
    return new Controller();
  }
}

export function getDataFromUrl(): StorageData | undefined {
  const dataString: string | null = new URLSearchParams(location.search).get(
    "state"
  );

  const data: StorageData | undefined = dataString
    ? JSON.parse(atob(decodeURIComponent(dataString)))
    : undefined;

  return data;
}

export function generateDataUrl(data: StorageData): string {
  const base64data = window.btoa(JSON.stringify(data));

  const paramsString = `state=${base64data}`;
  const searchParams = new URLSearchParams(paramsString);

  return `${import.meta.env.BASE_URL}?${searchParams.toString()}`;
}
