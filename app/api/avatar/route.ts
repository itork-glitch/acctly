import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'U';
  const letter = username.charAt(0).toUpperCase();

  const bgColors = [
    '#8592a8', // niebiesko-szary
    '#c9b187', // beżowy
    '#a8c9b1', // pastelowa zieleń
    '#d1a8c9', // różowy
    '#a8bfd1', // pastelowy błękit
  ];

  const color = bgColors[username.charCodeAt(0) & bgColors.length];

  const svg = `
    <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}" />
      <text x="50%" y="50%" font-size="64" text-anchor="middle" fill="white" dy=".35em" font-family="Arial, sans-serif">${letter}</text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
