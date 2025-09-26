import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const zodiac = searchParams.get("zodiac");

  if (!zodiac) {
    return NextResponse.json(
      { error: "Missing zodiac parameter" },
      { status: 400 }
    );
  }

  try {
    const resp = await fetch(
      `https://api.api-ninjas.com/v1/horoscope?zodiac=${zodiac}&type=daily`,

      {
        headers: {
          "X-Api-Key": process.env.HOROSCOPE_API_KEY ?? "",
        },
        cache: "no-store",
      }
    );

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Horoscope API error:", resp.status, errorText);
      console.log("API KEY from env:", process.env.HOROSCOPE_API_KEY);

      return NextResponse.json(
        { error: "Horoscope API failed" },
        { status: 500 }
      );
    }

    const data = await resp.json();
    console.log("🔮 API Ninjas response:", data); // 🐞 log full JSON
    return NextResponse.json(data);
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
