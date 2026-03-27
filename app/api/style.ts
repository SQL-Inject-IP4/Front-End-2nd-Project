export async function fetchBackgroundColor(): Promise<string> {
  // TODO: Actually fetch background color from backend
  return "rgb(0, 127, 255)";
}

export async function sendBackgroundColor(color: string): Promise<void> {
  // TODO: Send background color change request to backend
  console.log(color);
}

export async function fetchFont(): Promise<string> {
  // TODO: Actually fetch background color from backend
  return "Comic Sans MS";
}

export async function sendFont(font: string): Promise<void> {
  // TODO: Send background color change request to backend
  console.log(font);
}
