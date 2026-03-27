import type { Route } from "./+types/home";
import { useLoaderData } from "react-router-dom";
import { fetchBackgroundColor, setBackgroundColor } from "../api/background";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SQL Inject IP4" },
    { name: "description", content: "Halo dunia'); DROP TABLE Groups;--" },
  ];
}

export async function loader() {
  const color = await fetchBackgroundColor();
  return { color };
}

function handleSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  // TODO: Input validation/sanitization
  const [r, g, b] = ["r", "g", "b"].map(c => parseInt(formData.get(c) as string));

  const color = `rgb(${r}, ${g}, ${b})`;

  setBackgroundColor(color);
  
}

export default function Home() {
  const { color } = useLoaderData() as { color: string };

  useEffect(() => {
    document.body.style.backgroundColor = color;
  }, [color]);

  return <div>
    <h1>SQL Inject IP4</h1>
    <div id="change-bg-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="r">R</label>
        <input type="number" id="r" name="r" min="0" max="255"/>
        <label htmlFor="g">G</label>
        <input type="number" id="g" name="g" min="0" max="255"/>
        <label htmlFor="b">B</label>
        <input type="number" id="b" name="b" min="0" max="255"/>
        <input type="submit" value="Change Background Color"/>
      </form>
    </div>
  </div>;
}
