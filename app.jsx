import React, { useState, useEffect, useRef } from "react";
import { useFireproof } from "use-fireproof";

// Zodiac signs data
const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", element: "Fire", modality: "Cardinal" },
  { name: "Taurus", symbol: "♉", element: "Earth", modality: "Fixed" },
  { name: "Gemini", symbol: "♊", element: "Air", modality: "Mutable" },
  { name: "Cancer", symbol: "♋", element: "Water", modality: "Cardinal" },
  { name: "Leo", symbol: "♌", element: "Fire", modality: "Fixed" },
  { name: "Virgo", symbol: "♍", element: "Earth", modality: "Mutable" },
  { name: "Libra", symbol: "♎", element: "Air", modality: "Cardinal" },
  { name: "Scorpio", symbol: "♏", element: "Water", modality: "Fixed" },
  { name: "Sagittarius", symbol: "♐", element: "Fire", modality: "Mutable" },
  { name: "Capricorn", symbol: "♑", element: "Earth", modality: "Cardinal" },
  { name: "Aquarius", symbol: "♒", element: "Air", modality: "Fixed" },
  { name: "Pisces", symbol: "♓", element: "Water", modality: "Mutable" }
];

const PLANET_SYMBOLS = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇",
  NNode: "☊", Chiron: "⚷", Lilith: "⚸"
};

// Helper to get zodiac sign from degree
function getZodiacSign(degree) {
  const signIndex = Math.floor(degree / 30);
  return ZODIAC_SIGNS[signIndex];
}

function getDegreeInSign(degree) {
  return Math.floor(degree % 30);
}

// Simple city geocoding (common cities)
const CITY_COORDS = {
  "new york": { lat: 40.7128, lng: -74.0060 },
  "los angeles": { lat: 34.0522, lng: -118.2437 },
  "chicago": { lat: 41.8781, lng: -87.6298 },
  "london": { lat: 51.5074, lng: -0.1278 },
  "paris": { lat: 48.8566, lng: 2.3522 },
  "tokyo": { lat: 35.6762, lng: 139.6503 },
  "sydney": { lat: -33.8688, lng: 151.2093 },
  "berlin": { lat: 52.5200, lng: 13.4050 },
  "rome": { lat: 41.9028, lng: 12.4964 },
  "madrid": { lat: 40.4168, lng: -3.7038 },
  "amsterdam": { lat: 52.3676, lng: 4.9041 },
  "toronto": { lat: 43.6532, lng: -79.3832 },
  "san francisco": { lat: 37.7749, lng: -122.4194 },
  "seattle": { lat: 47.6062, lng: -122.3321 },
  "miami": { lat: 25.7617, lng: -80.1918 },
  "boston": { lat: 42.3601, lng: -71.0589 },
  "denver": { lat: 39.7392, lng: -104.9903 },
  "austin": { lat: 30.2672, lng: -97.7431 },
  "portland": { lat: 45.5152, lng: -122.6784 },
  "atlanta": { lat: 33.7490, lng: -84.3880 },
  "mumbai": { lat: 19.0760, lng: 72.8777 },
  "delhi": { lat: 28.7041, lng: 77.1025 },
  "beijing": { lat: 39.9042, lng: 116.4074 },
  "shanghai": { lat: 31.2304, lng: 121.4737 },
  "singapore": { lat: 1.3521, lng: 103.8198 },
  "hong kong": { lat: 22.3193, lng: 114.1694 },
  "dubai": { lat: 25.2048, lng: 55.2708 },
  "cairo": { lat: 30.0444, lng: 31.2357 },
  "cape town": { lat: -33.9249, lng: 18.4241 },
  "moscow": { lat: 55.7558, lng: 37.6173 },
  "sao paulo": { lat: -23.5505, lng: -46.6333 },
  "mexico city": { lat: 19.4326, lng: -99.1332 },
  "buenos aires": { lat: -34.6037, lng: -58.3816 },
  "vancouver": { lat: 49.2827, lng: -123.1207 },
  "montreal": { lat: 45.5017, lng: -73.5673 },
  "barcelona": { lat: 41.3851, lng: 2.1734 },
  "munich": { lat: 48.1351, lng: 11.5820 },
  "vienna": { lat: 48.2082, lng: 16.3738 },
  "prague": { lat: 50.0755, lng: 14.4378 },
  "stockholm": { lat: 59.3293, lng: 18.0686 },
  "copenhagen": { lat: 55.6761, lng: 12.5683 },
  "oslo": { lat: 59.9139, lng: 10.7522 },
  "helsinki": { lat: 60.1699, lng: 24.9384 },
  "dublin": { lat: 53.3498, lng: -6.2603 },
  "lisbon": { lat: 38.7223, lng: -9.1393 },
  "athens, greece": { lat: 37.9838, lng: 23.7275 },
  "athens, ga": { lat: 33.9519, lng: -83.3576 },
  "athens, al": { lat: 34.8045, lng: -86.9717 },
  "athens, alabama": { lat: 34.8045, lng: -86.9717 },
  "athens, georgia": { lat: 33.9519, lng: -83.3576 },
  "athens": { lat: 33.9519, lng: -83.3576 },  // Default to US Athens
  "istanbul": { lat: 41.0082, lng: 28.9784 },
  "tel aviv": { lat: 32.0853, lng: 34.7818 },
  "bangkok": { lat: 13.7563, lng: 100.5018 },
  "seoul": { lat: 37.5665, lng: 126.9780 },
  "taipei": { lat: 25.0330, lng: 121.5654 },
  "manila": { lat: 14.5995, lng: 120.9842 },
  "jakarta": { lat: -6.2088, lng: 106.8456 },
  "auckland": { lat: -36.8509, lng: 174.7645 },
  "melbourne": { lat: -37.8136, lng: 144.9631 },
  "brisbane": { lat: -27.4698, lng: 153.0251 },
  "phoenix": { lat: 33.4484, lng: -112.0740 },
  "philadelphia": { lat: 39.9526, lng: -75.1652 },
  "san diego": { lat: 32.7157, lng: -117.1611 },
  "dallas": { lat: 32.7767, lng: -96.7970 },
  "houston": { lat: 29.7604, lng: -95.3698 },
  "washington": { lat: 38.9072, lng: -77.0369 },
  "nashville": { lat: 36.1627, lng: -86.7816 },
  "new orleans": { lat: 29.9511, lng: -90.0715 },
  "las vegas": { lat: 36.1699, lng: -115.1398 },
  "minneapolis": { lat: 44.9778, lng: -93.2650 },
  "detroit": { lat: 42.3314, lng: -83.0458 },
  "pittsburgh": { lat: 40.4406, lng: -79.9959 },
  "cleveland": { lat: 41.4993, lng: -81.6944 },
  "baltimore": { lat: 39.2904, lng: -76.6122 },
  "charlotte": { lat: 35.2271, lng: -80.8431 },
  "raleigh": { lat: 35.7796, lng: -78.6382 },
  "salt lake city": { lat: 40.7608, lng: -111.8910 },
  "honolulu": { lat: 21.3069, lng: -157.8583 },
  "anchorage": { lat: 61.2181, lng: -149.9003 }
};

function geocodeCity(cityName) {
  const normalized = cityName.toLowerCase().trim();

  // First, try exact match
  if (CITY_COORDS[normalized]) {
    return CITY_COORDS[normalized];
  }

  // Then try to find the most specific match (longer key = more specific)
  let bestMatch = null;
  let bestMatchLength = 0;

  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (normalized.includes(city) || city.includes(normalized)) {
      // Prefer longer (more specific) matches
      if (city.length > bestMatchLength) {
        bestMatch = coords;
        bestMatchLength = city.length;
      }
    }
  }

  if (bestMatch) {
    return bestMatch;
  }

  // Default to NYC if not found
  return { lat: 40.7128, lng: -74.0060 };
}

// Calculate Local Sidereal Time from Julian Date and longitude
function calculateLocalSiderealTime(jd, longitude) {
  // Calculate Greenwich Mean Sidereal Time
  const T = (jd - 2451545.0) / 36525;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
             0.000387933 * T * T - T * T * T / 38710000;
  gmst = gmst % 360;
  if (gmst < 0) gmst += 360;

  // Convert to Local Sidereal Time
  let lst = gmst + longitude;
  lst = lst % 360;
  if (lst < 0) lst += 360;

  return lst;
}

// Calculate Ascendant using the proper astrological formula
// This finds where the ecliptic crosses the eastern horizon
function calculateAscendantIterative(lst, latitude, obliquity) {
  const toRad = (deg) => deg * Math.PI / 180;
  const toDeg = (rad) => rad * 180 / Math.PI;

  const lstRad = toRad(lst);
  const latRad = toRad(latitude);
  const oblRad = toRad(obliquity);

  // Standard ascendant formula
  // tan(ASC) = cos(ARMC) / -(sin(ARMC) * cos(ε) + tan(φ) * sin(ε))
  const sinLst = Math.sin(lstRad);
  const cosLst = Math.cos(lstRad);
  const sinObl = Math.sin(oblRad);
  const cosObl = Math.cos(oblRad);
  const tanLat = Math.tan(latRad);

  const y = cosLst;
  const x = -(sinLst * cosObl + tanLat * sinObl);

  let asc = toDeg(Math.atan2(y, x));

  // Normalize to 0-360
  if (asc < 0) asc += 360;

  return asc;
}

// Aspect definitions with orbs
const ASPECTS = [
  { name: "Conjunction", symbol: "☌", angle: 0, orb: 8 },
  { name: "Sextile", symbol: "⚹", angle: 60, orb: 6 },
  { name: "Square", symbol: "□", angle: 90, orb: 8 },
  { name: "Trine", symbol: "△", angle: 120, orb: 8 },
  { name: "Opposition", symbol: "☍", angle: 180, orb: 8 }
];

// Calculate aspects between planets
function calculateAspects(planets) {
  const aspects = [];
  const planetNames = Object.keys(planets);

  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const planet1 = planetNames[i];
      const planet2 = planetNames[j];
      const pos1 = planets[planet1][0];
      const pos2 = planets[planet2][0];

      // Calculate angular separation
      let diff = Math.abs(pos1 - pos2);
      if (diff > 180) diff = 360 - diff;

      // Check each aspect type
      for (const aspect of ASPECTS) {
        const orbDiff = Math.abs(diff - aspect.angle);
        if (orbDiff <= aspect.orb) {
          aspects.push({
            planet1,
            planet2,
            aspect: aspect.name,
            symbol: aspect.symbol,
            angle: aspect.angle,
            orb: orbDiff.toFixed(1)
          });
          break;
        }
      }
    }
  }

  return aspects;
}

// Calculate current transits (aspects between current sky and natal chart)
async function calculateTransits(natalPlanets) {
  try {
    const Astronomy = await import("https://esm.sh/astronomy-engine@2.1.19");
    const now = new Date();
    const observer = new Astronomy.Observer(0, 0, 0); // Position doesn't matter for ecliptic longitude

    const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    const currentPlanets = {};

    // Calculate current positions
    for (const body of bodies) {
      try {
        const equ = Astronomy.Equator(body, now, observer, true, true);
        const ecl = Astronomy.Ecliptic(equ.vec);
        let lon = ecl.elon;
        if (lon < 0) lon += 360;
        currentPlanets[body] = lon;
      } catch (e) {
        console.log(`Could not calculate current ${body}:`, e);
      }
    }

    // Find transits (aspects between current and natal positions)
    const transits = [];
    const transitAspects = [
      { name: "conjunct", angle: 0, orb: 3, symbol: "☌" },
      { name: "sextile", angle: 60, orb: 2, symbol: "⚹" },
      { name: "square", angle: 90, orb: 3, symbol: "□" },
      { name: "trine", angle: 120, orb: 3, symbol: "△" },
      { name: "opposite", angle: 180, orb: 3, symbol: "☍" }
    ];

    // Only check outer planet transits to natal positions (most significant)
    const transitingPlanets = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    const natalBodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

    for (const transiting of transitingPlanets) {
      if (!currentPlanets[transiting]) continue;
      const transitPos = currentPlanets[transiting];
      const transitSign = ZODIAC_SIGNS[Math.floor(transitPos / 30)].name;
      const transitDeg = Math.floor(transitPos % 30);

      for (const natal of natalBodies) {
        const natalData = natalPlanets[natal];
        if (!natalData) continue;
        const natalPos = Array.isArray(natalData) ? natalData[0] : natalData;

        let diff = Math.abs(transitPos - natalPos);
        if (diff > 180) diff = 360 - diff;

        for (const aspect of transitAspects) {
          const orbDiff = Math.abs(diff - aspect.angle);
          if (orbDiff <= aspect.orb) {
            const natalSign = ZODIAC_SIGNS[Math.floor(natalPos / 30)].name;
            transits.push({
              transiting,
              transitSign,
              transitDeg,
              aspect: aspect.name,
              symbol: aspect.symbol,
              natal,
              natalSign,
              orb: orbDiff.toFixed(1)
            });
            break;
          }
        }
      }
    }

    // Also note which houses transiting planets are in (based on natal chart)
    // Current positions through the zodiac
    const currentPositionsSummary = Object.entries(currentPlanets)
      .map(([planet, deg]) => {
        const sign = ZODIAC_SIGNS[Math.floor(deg / 30)].name;
        const degInSign = Math.floor(deg % 30);
        return `${planet}: ${degInSign}° ${sign}`;
      })
      .join('\n');

    return { transits, currentPositions: currentPositionsSummary, currentPlanets };
  } catch (err) {
    console.error("Transit calculation error:", err);
    return { transits: [], currentPositions: "", currentPlanets: {} };
  }
}

// Chart visualization component with aspect lines and collision avoidance
function NatalChartSVG({ chartData }) {
  const size = 600;
  const center = size / 2;
  const signRadius = 270;      // Zodiac signs - outermost
  const outerRadius = 230;     // Outer circle
  const planetRadius = 195;    // Planet positions
  const innerRadius = 160;     // Inner circle - aspect lines touch here

  if (!chartData || !chartData.planets) {
    return null;
  }

  const planets = chartData.planets;
  const cusps = chartData.cusps || [];

  // Calculate planet positions with collision avoidance
  const planetEntries = Object.entries(planets).map(([name, data]) => {
    const degree = Array.isArray(data) ? data[0] : data;
    return { name, degree };
  });

  // Sort by degree for collision detection
  planetEntries.sort((a, b) => a.degree - b.degree);

  // Collision avoidance: nudge planets that are too close
  const minAngleDiff = 12; // Minimum degrees apart
  const adjustedPositions = [];

  for (let i = 0; i < planetEntries.length; i++) {
    let adjustedDegree = planetEntries[i].degree;

    // Check against already placed planets
    for (let j = 0; j < adjustedPositions.length; j++) {
      let diff = Math.abs(adjustedDegree - adjustedPositions[j].adjustedDegree);
      if (diff > 180) diff = 360 - diff;

      if (diff < minAngleDiff) {
        // Nudge outward from the cluster
        adjustedDegree = (adjustedPositions[j].adjustedDegree + minAngleDiff) % 360;
      }
    }

    adjustedPositions.push({
      ...planetEntries[i],
      adjustedDegree,
      symbol: PLANET_SYMBOLS[planetEntries[i].name] || planetEntries[i].name[0]
    });
  }

  // Aspect colors
  const aspectColors = {
    "Conjunction": "oklch(55% 0.18 320)", // Purple
    "Sextile": "oklch(55% 0.15 230)",     // Blue
    "Square": "oklch(60% 0.20 25)",       // Red-orange
    "Trine": "oklch(50% 0.15 160)",       // Teal
    "Opposition": "oklch(55% 0.22 15)"    // Red
  };

  // Calculate aspects for drawing
  const aspects = [];
  for (let i = 0; i < adjustedPositions.length; i++) {
    for (let j = i + 1; j < adjustedPositions.length; j++) {
      const p1 = adjustedPositions[i];
      const p2 = adjustedPositions[j];

      let diff = Math.abs(p1.degree - p2.degree);
      if (diff > 180) diff = 360 - diff;

      // Check each aspect type
      for (const aspect of ASPECTS) {
        const orbDiff = Math.abs(diff - aspect.angle);
        if (orbDiff <= aspect.orb) {
          aspects.push({
            p1: p1.degree,
            p2: p2.degree,
            type: aspect.name,
            color: aspectColors[aspect.name]
          });
          break;
        }
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[600px] mx-auto">
      {/* Background for inner circle */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill="oklch(99% 0.089 282)"
      />

      {/* Aspect lines - connect to inner circle edge */}
      {aspects.map((aspect, idx) => {
        const angle1 = (aspect.p1 - 90) * (Math.PI / 180);
        const angle2 = (aspect.p2 - 90) * (Math.PI / 180);
        // Lines touch the inner circle edge
        const x1 = center + innerRadius * Math.cos(angle1);
        const y1 = center + innerRadius * Math.sin(angle1);
        const x2 = center + innerRadius * Math.cos(angle2);
        const y2 = center + innerRadius * Math.sin(angle2);

        return (
          <line
            key={`aspect-${idx}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={aspect.color}
            strokeWidth="1.5"
            opacity="0.7"
          />
        );
      })}

      {/* Outer circle */}
      <circle
        cx={center}
        cy={center}
        r={outerRadius}
        fill="none"
        stroke="oklch(47% 0.118 222)"
        strokeWidth="2"
      />

      {/* Inner circle */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill="none"
        stroke="oklch(67% 0.164 252)"
        strokeWidth="1.5"
      />

      {/* Zodiac divisions */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = center + innerRadius * Math.cos(angle);
        const y1 = center + innerRadius * Math.sin(angle);
        const x2 = center + outerRadius * Math.cos(angle);
        const y2 = center + outerRadius * Math.sin(angle);
        return (
          <line
            key={`div-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="oklch(82% 0.125 242)"
            strokeWidth="1"
          />
        );
      })}

      {/* Zodiac symbols - outside the outer circle */}
      {ZODIAC_SIGNS.map((sign, i) => {
        const angle = ((i * 30 + 15) - 90) * (Math.PI / 180);
        const x = center + signRadius * Math.cos(angle);
        const y = center + signRadius * Math.sin(angle);
        return (
          <text
            key={`sign-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="oklch(47% 0.118 222)"
            fontSize="24"
            fontFamily="serif"
          >
            {sign.symbol}
          </text>
        );
      })}

      {/* Planet positions - using adjusted positions to avoid overlap */}
      {adjustedPositions.map((planet) => {
        const angle = (planet.adjustedDegree - 90) * (Math.PI / 180);
        const x = center + planetRadius * Math.cos(angle);
        const y = center + planetRadius * Math.sin(angle);

        return (
          <g key={planet.name}>
            <circle
              cx={x}
              cy={y}
              r="18"
              fill="oklch(96% 0.05 267)"
              stroke="oklch(67% 0.164 252)"
              strokeWidth="2"
            />
            <text
              x={x}
              y={y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="oklch(40% 0.12 222)"
              fontSize="18"
              fontWeight="500"
            >
              {planet.symbol}
            </text>
          </g>
        );
      })}

      {/* Center point */}
      <circle cx={center} cy={center} r="4" fill="oklch(67% 0.164 252)" />
    </svg>
  );
}

// Loading spinner
function Spinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-8 h-8 border-2 border-[oklch(82%_0.125_242)] border-t-[oklch(67%_0.164_252)] rounded-full animate-spin" />
    </div>
  );
}

// Editorial-style reading display with markdown parsing
function ReadingDisplay({ content, sunSign, moonSign, risingSign }) {
  // Parse markdown content into styled sections
  const parseContent = (text) => {
    const sections = [];
    const paragraphs = text.split('\n\n');
    let isFirstParagraph = true;
    let pullQuoteExtracted = false;

    paragraphs.forEach((para, idx) => {
      const trimmed = para.trim();
      if (!trimmed) return;

      // Check if it's a header (starts with ** and ends with **)
      const headerMatch = trimmed.match(/^\*\*(.+?)\*\*$/);
      if (headerMatch) {
        sections.push({
          type: 'header',
          content: headerMatch[1],
          key: idx
        });
        isFirstParagraph = true; // Next paragraph gets special treatment
        return;
      }

      // Parse inline markdown
      let parsed = trimmed
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/—/g, '—');

      // Extract a pull quote from longer paragraphs (only once)
      if (!pullQuoteExtracted && parsed.length > 300 && idx > 2 && idx < paragraphs.length - 3) {
        // Find a compelling sentence for pull quote
        const sentences = trimmed.split(/(?<=[.!?])\s+/);
        const goodSentence = sentences.find(s =>
          s.length > 40 && s.length < 150 &&
          (s.includes('you') || s.includes('Your'))
        );
        if (goodSentence) {
          sections.push({
            type: 'pullquote',
            content: goodSentence.replace(/\*+/g, ''),
            key: `pq-${idx}`
          });
          pullQuoteExtracted = true;
        }
      }

      sections.push({
        type: isFirstParagraph ? 'lead' : 'body',
        content: parsed,
        key: idx
      });
      isFirstParagraph = false;
    });

    return sections;
  };

  const sections = parseContent(content);

  return (
    <article className="relative">
      {/* Decorative top element */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-px bg-[oklch(67%_0.164_252)]" />
          <span className="text-[oklch(67%_0.164_252)] text-2xl">✧</span>
          <div className="w-16 h-px bg-[oklch(67%_0.164_252)]" />
        </div>
      </div>

      {/* Sign badges */}
      <div className="flex justify-center gap-6 mb-16 flex-wrap">
        <div className="text-center">
          <div className="text-xs tracking-[0.2em] uppercase text-[oklch(57%_0.133_232)] mb-1">Sun</div>
          <div className="text-lg font-medium text-[oklch(47%_0.118_222)]">{sunSign}</div>
        </div>
        <div className="w-px h-10 bg-[oklch(82%_0.125_242)]" />
        <div className="text-center">
          <div className="text-xs tracking-[0.2em] uppercase text-[oklch(57%_0.133_232)] mb-1">Moon</div>
          <div className="text-lg font-medium text-[oklch(47%_0.118_222)]">{moonSign}</div>
        </div>
        <div className="w-px h-10 bg-[oklch(82%_0.125_242)]" />
        <div className="text-center">
          <div className="text-xs tracking-[0.2em] uppercase text-[oklch(57%_0.133_232)] mb-1">Rising</div>
          <div className="text-lg font-medium text-[oklch(47%_0.118_222)]">{risingSign}</div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {sections.map((section) => {
          if (section.type === 'header') {
            return (
              <h3
                key={section.key}
                className="text-xl md:text-2xl font-normal text-[oklch(47%_0.118_222)] mt-16 mb-6 tracking-tight"
                style={{ fontVariationSettings: "'opsz' 32" }}
              >
                {section.content}
              </h3>
            );
          }

          if (section.type === 'pullquote') {
            return (
              <blockquote
                key={section.key}
                className="relative my-16 py-8 px-6 md:px-12 md:-mx-8"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[oklch(67%_0.164_252)] to-[oklch(82%_0.125_242)]" />
                <p
                  className="text-xl md:text-2xl font-light text-[oklch(47%_0.118_222)] leading-relaxed italic"
                  style={{ fontVariationSettings: "'opsz' 28" }}
                >
                  "{section.content}"
                </p>
              </blockquote>
            );
          }

          if (section.type === 'lead') {
            return (
              <p
                key={section.key}
                className="text-lg md:text-xl text-[oklch(47%_0.118_222)] leading-[1.8] first-letter:text-5xl first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[oklch(67%_0.164_252)]"
                style={{ fontVariationSettings: "'opsz' 18" }}
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            );
          }

          // Body paragraphs
          return (
            <p
              key={section.key}
              className="text-base md:text-lg text-[oklch(47%_0.118_222)] leading-[1.9]"
              style={{ fontVariationSettings: "'opsz' 14" }}
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          );
        })}
      </div>

      {/* Decorative bottom element */}
      <div className="flex justify-center mt-16">
        <div className="flex items-center gap-3">
          <span className="text-[oklch(82%_0.125_242)] text-lg">✦</span>
          <span className="text-[oklch(67%_0.164_252)] text-2xl">✧</span>
          <span className="text-[oklch(82%_0.125_242)] text-lg">✦</span>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  // Multi-tenant database scoping
  const { dbName } = typeof useTenant !== 'undefined' ? useTenant() : { dbName: "astrology-chat-db" };
  const { database, useLiveQuery, useDocument } = useFireproof(dbName);
  const { callAI, loading: aiLoading } = useAI();

  // Check for existing user profile
  const { docs: profiles } = useLiveQuery("type", { key: "profile" });
  const existingProfile = profiles[0];

  // Chat messages
  const { docs: messages } = useLiveQuery("type", { key: "message" });
  const sortedMessages = [...messages].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

  // App state
  const [step, setStep] = useState(existingProfile ? "chart" : "welcome");
  const [chartData, setChartData] = useState(null);
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Form state for onboarding
  const { doc: formData, merge: updateForm } = useDocument({
    type: "form",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    birthHour: "",
    birthMinute: "",
    birthCity: "",
    timeUncertain: false
  });

  // Chat input
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Load chart if profile exists
  useEffect(() => {
    if (existingProfile && !chartData) {
      generateChart(existingProfile);
    }
  }, [existingProfile]);

  async function generateChart(profile) {
    setGenerating(true);

    try {
      // Use astronomy-engine for precise planetary calculations
      const Astronomy = await import("https://esm.sh/astronomy-engine@2.1.19");

      // Get timezone offset for birth location using longitude approximation
      // Each 15° of longitude = 1 hour offset from UTC
      // This is approximate - proper solution would use a timezone database
      const longitudeOffset = Math.round(profile.longitude / 15);

      // Create UTC date from local birth time
      // We need to convert local birth time at birth location to UTC
      // Handle hour carefully - 0 is valid (midnight), don't default to 12
      const localHour = profile.birthHour !== "" ? parseInt(profile.birthHour) : 12;
      const localMinute = profile.birthMinute !== "" ? parseInt(profile.birthMinute) : 0;

      // For US locations in summer, we also need to account for DST
      // This is a simplification - assumes DST for summer months in US
      const month = parseInt(profile.birthMonth);
      const isDST = profile.longitude < -50 && profile.longitude > -130 &&
                    (month >= 4 && month <= 10); // Rough DST estimate for US
      const dstOffset = isDST ? 1 : 0;

      // Calculate UTC hour
      const utcHour = localHour - longitudeOffset - dstOffset;

      // Create date in UTC
      const birthDate = new Date(Date.UTC(
        parseInt(profile.birthYear),
        parseInt(profile.birthMonth) - 1,
        parseInt(profile.birthDay),
        utcHour,
        localMinute
      ));

      // Observer location
      const observer = new Astronomy.Observer(profile.latitude, profile.longitude, 0);

      // Calculate planetary positions
      const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
      const planets = {};

      for (const body of bodies) {
        try {
          const equ = Astronomy.Equator(body, birthDate, observer, true, true);
          const ecl = Astronomy.Ecliptic(equ.vec);
          // Convert to 0-360 degree range
          let lon = ecl.elon;
          if (lon < 0) lon += 360;
          planets[body] = [lon];
        } catch (e) {
          console.log(`Could not calculate ${body}:`, e);
        }
      }

      // Calculate Ascendant using astronomy-engine's horizon functions
      const time = Astronomy.MakeTime(birthDate);

      // Get the obliquity at this specific time
      const obliquity = 23.4393 - 0.013 * ((time.ut - 2451545.0) / 36525);

      // Calculate Local Sidereal Time properly
      // astronomy-engine gives us Julian UT1 date
      const jd = time.ut;

      // Use astronomy-engine's sidereal time function if available
      let lst;
      if (Astronomy.SiderealTime) {
        // Get Greenwich Sidereal Time in hours, convert to degrees
        const gst = Astronomy.SiderealTime(time);
        lst = (gst * 15 + profile.longitude) % 360;
        if (lst < 0) lst += 360;
      } else {
        lst = calculateLocalSiderealTime(jd, profile.longitude);
      }

      // DEBUG: Log the values
      console.log("=== CHART DEBUG ===");
      console.log("Birth Date (UTC):", birthDate.toISOString());
      console.log("Julian Date:", jd);
      console.log("Local Sidereal Time (degrees):", lst);
      console.log("LST (hours):", lst / 15);
      console.log("Latitude:", profile.latitude);
      console.log("Longitude:", profile.longitude);
      console.log("Obliquity:", obliquity);

      // Calculate ascendant - the ecliptic longitude at eastern horizon
      let ascendant = calculateAscendantIterative(lst, profile.latitude, obliquity);

      console.log("Calculated Ascendant (degrees):", ascendant);
      console.log("Ascendant Sign:", ZODIAC_SIGNS[Math.floor(ascendant / 30)].name);
      console.log("===================");

      // Generate house cusps using equal house system (Ascendant-based)
      const cusps = [];
      for (let i = 0; i < 12; i++) {
        cusps.push((ascendant + i * 30) % 360);
      }

      // Calculate aspects between planets
      const aspects = calculateAspects(planets);

      // Store calculated data for AI reading
      const horoscopeData = {
        planets,
        cusps,
        ascendant,
        aspects,
        CelestialBodies: Object.fromEntries(
          Object.entries(planets).map(([name, [deg]]) => [
            name.toLowerCase(),
            {
              Sign: { label: ZODIAC_SIGNS[Math.floor(deg / 30)].name },
              ChartPosition: { Ecliptic: { DecimalDegrees: deg } }
            }
          ])
        ),
        Ascendant: { Sign: { label: ZODIAC_SIGNS[Math.floor(ascendant / 30)].name } }
      };

      setHoroscopeData(horoscopeData);

      setChartData({ planets, cusps });

      // Check if we need to generate a reading
      const { docs: readings } = await database.query("type", { key: "reading" });
      if (readings.length === 0) {
        await generateReading(horoscopeData, profile);
      }

    } catch (err) {
      console.error("Chart generation error:", err);
    }

    setGenerating(false);
  }

  async function generateReading(chartInfo, profile) {
    // Build chart summary for AI
    const celestialBodies = chartInfo.CelestialBodies || {};
    const sunSign = celestialBodies.sun?.Sign?.label || "Unknown";
    const moonSign = celestialBodies.moon?.Sign?.label || "Unknown";
    const risingSign = chartInfo.Ascendant?.Sign?.label || "Unknown";

    const planetPositions = Object.entries(celestialBodies)
      .map(([planet, data]) => {
        const sign = data?.Sign?.label || "Unknown";
        const degree = data?.ChartPosition?.Ecliptic?.DecimalDegrees;
        const degInSign = degree ? Math.floor(degree % 30) : 0;
        return `${planet.charAt(0).toUpperCase() + planet.slice(1)}: ${degInSign}° ${sign}`;
      })
      .join("\n");

    // Format aspects for the prompt
    const aspectsList = (chartInfo.aspects || [])
      .map(a => `${a.planet1} ${a.symbol} ${a.planet2} (${a.aspect}, ${a.orb}° orb)`)
      .join("\n");

    // Identify element and modality distributions
    const elements = { Fire: [], Earth: [], Air: [], Water: [] };
    const modalities = { Cardinal: [], Fixed: [], Mutable: [] };

    Object.entries(celestialBodies).forEach(([planet, data]) => {
      const sign = data?.Sign?.label;
      const signData = ZODIAC_SIGNS.find(s => s.name === sign);
      if (signData) {
        elements[signData.element].push(planet);
        modalities[signData.modality].push(planet);
      }
    });

    const elementSummary = Object.entries(elements)
      .map(([el, planets]) => `${el}: ${planets.length} (${planets.join(', ') || 'none'})`)
      .join('\n');

    const modalitySummary = Object.entries(modalities)
      .map(([mod, planets]) => `${mod}: ${planets.length} (${planets.join(', ') || 'none'})`)
      .join('\n');

    // Find dominant element and modality
    const dominantElement = Object.entries(elements).sort((a, b) => b[1].length - a[1].length)[0];
    const dominantModality = Object.entries(modalities).sort((a, b) => b[1].length - a[1].length)[0];

    // Identify stelliums (3+ planets in same sign)
    const signCounts = {};
    Object.entries(celestialBodies).forEach(([planet, data]) => {
      const sign = data?.Sign?.label;
      if (sign) {
        signCounts[sign] = signCounts[sign] || [];
        signCounts[sign].push(planet);
      }
    });
    const stelliums = Object.entries(signCounts)
      .filter(([sign, planets]) => planets.length >= 3)
      .map(([sign, planets]) => `${sign} (${planets.join(', ')})`)
      .join('; ');

    const prompt = `You are a veteran astrologer with 30+ years of experience. Your gift is seeing the WHOLE person—not just what each placement means, but how they weave together into a living, breathing human story.

═══════════════════════════════════════════
NATAL CHART DATA
═══════════════════════════════════════════

THE BIG THREE:
• Sun: ${sunSign} (${celestialBodies.sun?.ChartPosition?.Ecliptic?.DecimalDegrees?.toFixed(1) || 0}°)
• Moon: ${moonSign} (${celestialBodies.moon?.ChartPosition?.Ecliptic?.DecimalDegrees?.toFixed(1) || 0}°)
• Rising/Ascendant: ${risingSign}

ALL PLANET POSITIONS:
${planetPositions}

ASPECTS (planetary relationships):
${aspectsList || "No major aspects"}

ELEMENT BALANCE:
${elementSummary}
→ Dominant: ${dominantElement[0]} (${dominantElement[1].length} planets)

MODALITY BALANCE:
${modalitySummary}
→ Dominant: ${dominantModality[0]} (${dominantModality[1].length} planets)

${stelliums ? `STELLIUMS: ${stelliums}` : 'No stelliums (3+ planets in one sign)'}

BIRTH: ${profile.birthCity}, ${profile.birthMonth}/${profile.birthDay}/${profile.birthYear}

═══════════════════════════════════════════
YOUR TASK
═══════════════════════════════════════════

Write an 800-1200 word reading that makes this person feel truly SEEN.

FIRST, silently analyze (don't write this part):
- What does the Sun-Moon-Rising combination reveal about core self vs. emotional needs vs. public face?
- What's the chart's overall "flavor" from element/modality dominance?
- What tensions exist in the aspects? What flows easily?
- Where is the ruler of their Sun sign? Their Rising? What layers does this add?
- What's their likely core wound? Their superpower?

THEN, write the reading with this approach:
- Open with what strikes you MOST—the single most interesting or paradoxical thing about this chart. Hook them immediately.
- Weave placements into a coherent narrative about WHO this person is—not a list of traits
- Name the CENTRAL TENSION they likely feel daily—the push-pull that defines their inner life
- Identify their "secret"—something they might not fully realize about themselves, but will recognize instantly when they read it
- Speak to the EXPERIENCE of being them: "You probably find yourself..." / "There's a part of you that..."
- Find unexpected connections: How does Mars illuminate Moon? How does Rising mask or reveal Sun?
- Ask: What question is their soul trying to answer in this lifetime?
- End with something profound—not advice, but RECOGNITION. Honor the complexity of who they are.

VOICE & STYLE:
- Warm but not soft. You see clearly, including the hard parts.
- CONFIDENT. No "may" or "might" hedging—speak with knowing.
- Occasionally poetic, but grounded. Psychology as much as mysticism.
- Flowing prose, NOT headers or bullet points
- Short paragraphs for rhythm
- *Italics* for emphasis, sparingly
- NO generic sign descriptions. Everything specific to THIS chart.

A great reading makes someone feel like you've known them their whole life. Surprise them with how deeply you understand.`;

    try {
      const response = await callAI({
        model: "anthropic/claude-sonnet-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000
      });

      const reading = response.choices[0].message.content;

      await database.put({
        type: "reading",
        content: reading,
        chartSummary: { sunSign, moonSign, risingSign, aspects: aspectsList },
        createdAt: Date.now()
      });

    } catch (err) {
      console.error("Reading generation error:", err);
    }
  }

  async function handleOnboardingSubmit(e) {
    e.preventDefault();

    const coords = geocodeCity(formData.birthCity);

    const profile = {
      type: "profile",
      birthMonth: formData.birthMonth,
      birthDay: formData.birthDay,
      birthYear: formData.birthYear,
      birthHour: formData.birthHour || "12",
      birthMinute: formData.birthMinute || "0",
      birthCity: formData.birthCity,
      latitude: coords.lat,
      longitude: coords.lng,
      timeUncertain: formData.timeUncertain,
      createdAt: Date.now()
    };

    await database.put(profile);
    setStep("chart");
    generateChart(profile);
  }

  async function handleChatSubmit(e) {
    e.preventDefault();
    if (!chatInput.trim() || aiLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");

    // Save user message
    await database.put({
      type: "message",
      role: "user",
      content: userMessage,
      createdAt: Date.now()
    });

    // Get reading for context
    const { docs: readings } = await database.query("type", { key: "reading" });
    const reading = readings[0];

    // Calculate current transits
    let transitContext = "";
    if (chartData?.planets) {
      const { transits, currentPositions } = await calculateTransits(chartData.planets);

      if (transits.length > 0) {
        const transitList = transits
          .map(t => `• Transiting ${t.transiting} (${t.transitDeg}° ${t.transitSign}) ${t.aspect} natal ${t.natal} (${t.natalSign}) - ${t.orb}° orb`)
          .join('\n');

        transitContext = `
═══════════════════════════════════════════
CURRENT TRANSITS (as of today)
═══════════════════════════════════════════

Active transits to natal chart:
${transitList}

Current sky positions:
${currentPositions}

Use these transits to discuss timing, current influences, and what energies are active RIGHT NOW in their life. Transits show the weather—what external energies they're navigating.`;
      }
    }

    // Build conversation history
    const history = sortedMessages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));

    const systemPrompt = `You are an experienced, intuitive astrologer continuing a private consultation.

═══════════════════════════════════════════
NATAL CHART (birth blueprint)
═══════════════════════════════════════════
${reading?.chartSummary ? `Sun: ${reading.chartSummary.sunSign}
Moon: ${reading.chartSummary.moonSign}
Rising: ${reading.chartSummary.risingSign}

Natal Aspects:
${reading.chartSummary.aspects || "Not recorded"}` : "Chart data not available"}
${transitContext}

═══════════════════════════════════════════
CONSULTATION GUIDELINES
═══════════════════════════════════════════

Your initial reading covered their core patterns. Now they're asking follow-up questions.

When discussing TIMING or FUTURE:
- Reference active transits and what they're bringing up
- Outer planet transits (Saturn, Uranus, Neptune, Pluto) are major life themes lasting months/years
- Jupiter transits bring expansion and opportunity, lasting about a year per house
- Be specific: "With Saturn currently squaring your natal Moon, you're likely feeling..."

VOICE:
- Reference chart placements naturally when relevant
- Speak with warmth and confident intuition
- Be curious about what they're really asking beneath the surface
- Occasionally be direct or profound—don't always be soft
- No disclaimers. You see clearly.
- When they ask about the future, use the transit data to give grounded, specific timing insights`;

    try {
      const response = await callAI({
        model: "anthropic/claude-sonnet-4",
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: userMessage }
        ],
        max_tokens: 1000
      });

      const aiResponse = response.choices[0].message.content;

      await database.put({
        type: "message",
        role: "assistant",
        content: aiResponse,
        createdAt: Date.now()
      });

    } catch (err) {
      console.error("Chat error:", err);
    }
  }

  // Get reading
  const { docs: readings } = useLiveQuery("type", { key: "reading" });
  const reading = readings[0];

  return (
    <div className="min-h-screen bg-[oklch(99%_0.089_282)] font-['Fraunces',serif]">
      {/* Welcome / Onboarding */}
      {step === "welcome" && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <h1 className="text-4xl font-light text-[oklch(47%_0.118_222)] mb-4 tracking-tight">
              Let's begin
            </h1>
            <p className="text-[oklch(57%_0.133_232)] text-lg mb-8 leading-relaxed">
              I'll need a few details to draw your chart—your birthday, birth time, and birthplace.
              These form the foundation of who you are.
            </p>
            <button
              onClick={() => setStep("birth-date")}
              className="px-8 py-4 bg-[oklch(67%_0.164_252)] text-white rounded-full text-lg font-medium hover:bg-[oklch(62%_0.164_252)] transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Birth Date */}
      {step === "birth-date" && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-light text-[oklch(47%_0.118_222)] mb-2 text-center">
              When were you born?
            </h2>
            <p className="text-[oklch(57%_0.133_232)] text-center mb-8">
              The exact date matters—it determines where the planets were.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-[oklch(57%_0.133_232)] mb-1">Month</label>
                  <select
                    value={formData.birthMonth}
                    onChange={(e) => updateForm({ birthMonth: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[oklch(82%_0.125_242)] rounded-lg bg-white text-[oklch(47%_0.118_222)] focus:border-[oklch(67%_0.164_252)] focus:outline-none"
                  >
                    <option value="">--</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2000, i, 1).toLocaleString("default", { month: "long" })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[oklch(57%_0.133_232)] mb-1">Day</label>
                  <select
                    value={formData.birthDay}
                    onChange={(e) => updateForm({ birthDay: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[oklch(82%_0.125_242)] rounded-lg bg-white text-[oklch(47%_0.118_222)] focus:border-[oklch(67%_0.164_252)] focus:outline-none"
                  >
                    <option value="">--</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[oklch(57%_0.133_232)] mb-1">Year</label>
                  <input
                    type="number"
                    placeholder="1990"
                    value={formData.birthYear}
                    onChange={(e) => updateForm({ birthYear: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[oklch(82%_0.125_242)] rounded-lg bg-white text-[oklch(47%_0.118_222)] focus:border-[oklch(67%_0.164_252)] focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep("birth-time")}
                disabled={!formData.birthMonth || !formData.birthDay || !formData.birthYear}
                className="w-full mt-6 px-8 py-4 bg-[oklch(67%_0.164_252)] text-white rounded-full text-lg font-medium hover:bg-[oklch(62%_0.164_252)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Birth Time */}
      {step === "birth-time" && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-light text-[oklch(47%_0.118_222)] mb-2 text-center">
              What time were you born?
            </h2>
            <p className="text-[oklch(57%_0.133_232)] text-center mb-8">
              Your rising sign changes every two hours. If you're unsure,
              check your birth certificate or ask family.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[oklch(57%_0.133_232)] mb-1">Hour (24h)</label>
                  <select
                    value={formData.birthHour}
                    onChange={(e) => updateForm({ birthHour: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[oklch(82%_0.125_242)] rounded-lg bg-white text-[oklch(47%_0.118_222)] focus:border-[oklch(67%_0.164_252)] focus:outline-none"
                  >
                    <option value="">--</option>
                    {[...Array(24)].map((_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, "0")}:00
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[oklch(57%_0.133_232)] mb-1">Minute</label>
                  <select
                    value={formData.birthMinute}
                    onChange={(e) => updateForm({ birthMinute: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[oklch(82%_0.125_242)] rounded-lg bg-white text-[oklch(47%_0.118_222)] focus:border-[oklch(67%_0.164_252)] focus:outline-none"
                  >
                    <option value="">--</option>
                    {[...Array(60)].map((_, m) => (
                      <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.timeUncertain}
                  onChange={(e) => updateForm({ timeUncertain: e.target.checked })}
                  className="w-5 h-5 rounded border-2 border-[oklch(82%_0.125_242)] accent-[oklch(67%_0.164_252)]"
                />
                <span className="text-[oklch(57%_0.133_232)]">I'm not sure of the exact time</span>
              </label>

              <button
                onClick={() => setStep("birth-place")}
                className="w-full mt-6 px-8 py-4 bg-[oklch(67%_0.164_252)] text-white rounded-full text-lg font-medium hover:bg-[oklch(62%_0.164_252)] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Birth Place */}
      {step === "birth-place" && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <form onSubmit={handleOnboardingSubmit} className="max-w-md w-full">
            <h2 className="text-3xl font-light text-[oklch(47%_0.118_222)] mb-2 text-center">
              Where were you born?
            </h2>
            <p className="text-[oklch(57%_0.133_232)] text-center mb-8">
              The city and country—this determines your house placements.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[oklch(57%_0.133_232)] mb-1">City</label>
                <input
                  type="text"
                  placeholder="New York, London, Tokyo..."
                  value={formData.birthCity}
                  onChange={(e) => updateForm({ birthCity: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[oklch(82%_0.125_242)] rounded-lg bg-white text-[oklch(47%_0.118_222)] focus:border-[oklch(67%_0.164_252)] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!formData.birthCity}
                className="w-full mt-6 px-8 py-4 bg-[oklch(67%_0.164_252)] text-white rounded-full text-lg font-medium hover:bg-[oklch(62%_0.164_252)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate My Chart
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chart & Reading View */}
      {step === "chart" && (
        <div className="min-h-screen">
          <div className="max-w-2xl mx-auto px-6 py-12">
            {/* Header */}
            <header className="text-center mb-12">
              <h1 className="text-3xl font-light text-[oklch(47%_0.118_222)] mb-2">
                Your Natal Chart
              </h1>
              {existingProfile && (
                <p className="text-[oklch(57%_0.133_232)]">
                  {existingProfile.birthCity} · {existingProfile.birthMonth}/{existingProfile.birthDay}/{existingProfile.birthYear}
                </p>
              )}
            </header>

            {/* Chart */}
            {generating ? (
              <div className="py-12">
                <Spinner />
                <p className="text-center text-[oklch(57%_0.133_232)] mt-4">Drawing your chart...</p>
              </div>
            ) : chartData ? (
              <div className="mb-12">
                <NatalChartSVG chartData={chartData} />
              </div>
            ) : null}

            {/* Reading */}
            {reading ? (
              <div className="mb-16">
                <ReadingDisplay
                  content={reading.content}
                  sunSign={reading.chartSummary?.sunSign || "Unknown"}
                  moonSign={reading.chartSummary?.moonSign || "Unknown"}
                  risingSign={reading.chartSummary?.risingSign || "Unknown"}
                />
              </div>
            ) : generating || aiLoading ? (
              <div className="py-8">
                <Spinner />
                <p className="text-center text-[oklch(57%_0.133_232)] mt-4">Interpreting your chart...</p>
              </div>
            ) : null}

            {/* Transition to Chat */}
            {reading && (
              <div className="border-t border-[oklch(82%_0.125_242)] pt-12">
                <h2 className="text-2xl font-light text-[oklch(47%_0.118_222)] mb-4 text-center">
                  Ask me anything
                </h2>
                <p className="text-[oklch(57%_0.133_232)] text-center mb-8">
                  About relationships, timing, career, emotional patterns—I'm here.
                </p>

                {/* Chat Messages */}
                <div className="space-y-4 mb-6">
                  {sortedMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`p-4 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-[oklch(67%_0.164_252)] text-white ml-12"
                          : "bg-[oklch(92%_0.103_267)] text-[oklch(47%_0.118_222)] mr-12"
                      }`}
                    >
                      {msg.content.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                      ))}
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="bg-[oklch(92%_0.103_267)] p-4 rounded-2xl mr-12">
                      <Spinner />
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleChatSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="What would you like to explore?"
                    className="flex-1 px-4 py-3 border-2 border-[oklch(82%_0.125_242)] rounded-full bg-white text-[oklch(47%_0.118_222)] focus:border-[oklch(67%_0.164_252)] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading || !chatInput.trim()}
                    className="px-6 py-3 bg-[oklch(67%_0.164_252)] text-white rounded-full font-medium hover:bg-[oklch(62%_0.164_252)] transition-colors disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Google Fonts & Typography Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&display=swap');

        /* Enhanced typography */
        article strong {
          font-weight: 500;
          color: oklch(47% 0.118 222);
        }

        article em {
          font-style: italic;
          font-variation-settings: 'opsz' 14;
        }

        /* Smooth optical sizing transitions */
        article p, article h3, article blockquote {
          font-optical-sizing: auto;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }

        /* First letter styling enhancement */
        article p.lead::first-letter {
          line-height: 0.8;
        }

        /* Reading container max-width for optimal line length */
        article {
          max-width: 42rem;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </div>
  );
}
