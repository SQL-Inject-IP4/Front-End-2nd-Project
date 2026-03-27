import type { Route } from "./+types/home";
import { useLoaderData } from "react-router-dom";
import { fetchBackgroundColor, sendBackgroundColor, fetchFont, sendFont } from "../api/background";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SQL Inject IP4" },
    { name: "description", content: "Halo dunia'); DROP TABLE Groups;--" },
  ];
}

export async function loader() {
  const color = await fetchBackgroundColor();
  const font = await fetchFont();
  return { color, font };
}

function handleSubmitBackground(e) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  // TODO: Input validation/sanitization
  const [r, g, b] = ["r", "g", "b"].map(c => parseInt(formData.get(c) as string));

  const color = `rgb(${r}, ${g}, ${b})`;

  sendBackgroundColor(color);
}

function handleSubmitFont(e) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  // TODO: Input validation/sanitization
  const font = formData.get("new-font") as string;

  sendFont(font);
}

export default function Home() {
  const { color, font } = useLoaderData() as { color: string, font: string };

  useEffect(() => {
    document.body.style.backgroundColor = color;
    document.body.style.fontFamily = font;
  }, [color, font]);

  return <div>
    <h1>SQL Inject IP4</h1>
    <div id="change-bg-container">
      <form onSubmit={handleSubmitBackground}>
        <label htmlFor="r">R</label>
        <input type="number" id="r" name="r" min="0" max="255"/>
        <label htmlFor="g">G</label>
        <input type="number" id="g" name="g" min="0" max="255"/>
        <label htmlFor="b">B</label>
        <input type="number" id="b" name="b" min="0" max="255"/>
        <input type="submit" value="Change Background Color"/>
      </form>
    </div>
    <div id="change-font-container">
      <form onSubmit={handleSubmitFont}>
        <label htmlFor="r">New font name: </label>
        <input type="text" id="new-font" name="new-font" required/>
        <input type="submit" value="Change Font"/>
      </form>
    </div>
  </div>;
}
