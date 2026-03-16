/**
 * Points of Interest data for the Puerto Rico Heritage & Nature Tour.
 *
 * FOLLOW-UP: All GPS coordinates are approximate and must be verified
 * on-site before production release (PRD §12 Q1).
 *
 * FOLLOW-UP: Narration scripts below are placeholder AI-generated text.
 * Per PRD §6.2, scripts should be regenerated via the AI prompt template
 * and reviewed by a human editor for factual accuracy before final TTS synthesis.
 */

const pois = [
  {
    id: 'old-san-juan',
    name: 'Old San Juan — Castillo San Felipe del Morro',
    municipality: 'San Juan',
    type: 'Historical / Military',
    coordinates: { lat: 18.4706, lng: -66.1240 },
    triggerRadiusMeters: 600,
    mandatory: false,
    pausePrompt: false,
    segment: 1,
    estimatedStopMinutes: 20,
    narration: {
      en: `Coming up on your left, rising from the rocky headland like a sentinel watching over San Juan Bay, is Castillo San Felipe del Morro — one of the most iconic fortifications in the Americas. Construction began in 1539, just decades after the Spanish first arrived on this island, and it took over 200 years to complete the massive six-level structure you see today.

El Morro, as locals call it, was designed to guard the entrance to San Juan Harbor from seaborne attacks. And it saw plenty of action — the fortress withstood assaults by Sir Francis Drake in 1595, the Dutch in 1625, and even a bombardment by the United States Navy in 1898 during the Spanish-American War. Those cannon-scarred walls have stories etched into every stone.

Here's something most visitors don't realize: the wide grassy field stretching in front of the fort, the esplanade, was intentionally kept clear of buildings. It wasn't a park — it was a killing ground, designed to give defenders an unobstructed line of fire at anyone approaching. Today, that same field is where families fly kites on Sunday afternoons. It's one of the most striking transformations of military space into community joy you'll find anywhere.

El Morro is a UNESCO World Heritage Site and a cornerstone of Puerto Rican identity. For many boricuas, it represents resilience — a structure that endured centuries of conflict and still stands proud. It's a fitting start to our journey through the island's heritage.`,
    },
    summary: {
      en: 'A UNESCO World Heritage fortress begun in 1539, guarding San Juan Harbor for over 400 years. One of the most iconic Spanish colonial military structures in the Americas.',
    },
  },
  {
    id: 'caguas-botanical-garden',
    name: 'Jardín Botánico y Cultural de Caguas',
    municipality: 'Caguas',
    type: 'Natural / Cultural',
    coordinates: { lat: 18.2352, lng: -66.0378 },
    triggerRadiusMeters: 500,
    mandatory: false,
    pausePrompt: false,
    segment: 2,
    estimatedStopMinutes: 15,
    narration: {
      en: `As we enter the Caguas valley, you're passing near the Jardín Botánico y Cultural de Caguas — the Botanical and Cultural Garden of Caguas. What makes this place remarkable isn't just the tropical flora — it's the story of transformation beneath your feet.

This land was once an industrial zone, part of the sugar cane processing infrastructure that dominated Puerto Rico's economy for centuries. When that industry declined, the city of Caguas made a bold choice: instead of letting it decay, they reclaimed it. The result is a lush green sanctuary that weaves together native plant species, walking trails, and a Taíno heritage garden that honors the indigenous people who first cultivated this valley over a thousand years ago.

The Taíno garden section is particularly special. It showcases the crops and medicinal plants the Taíno people relied on — yuca, sweet potato, tobacco, and cotton — alongside petroglyphs and reconstructed ceremonial spaces. Caguas itself takes its name from a Taíno cacique, a chief named Caguax, who governed this region before Spanish colonization.

Here's a detail that often surprises visitors: Caguas is known as the "Criollo City" — a celebration of the blended identity that defines Puerto Rican culture. The botanical garden is a living expression of that idea, combining indigenous, African, and Spanish influences in a single green space. It's a quiet but powerful reminder that Puerto Rico's heritage grows from many roots.`,
    },
    summary: {
      en: 'A reclaimed industrial site transformed into a botanical garden featuring native flora and a Taíno heritage garden honoring indigenous culture.',
    },
  },
  {
    id: 'mirador-piedra-degetau',
    name: 'Mirador Piedra Degetau',
    municipality: 'Cayey',
    type: 'Natural / Scenic Overlook',
    coordinates: { lat: 18.1280, lng: -66.1580 },
    triggerRadiusMeters: 500,
    mandatory: false,
    pausePrompt: true,
    segment: 3,
    estimatedStopMinutes: 15,
    narration: {
      en: `If you can safely pull over here, you're approaching one of the most breathtaking viewpoints on the entire island — Mirador Piedra Degetau, perched high in the mountains of Cayey along the Luis A. Ferré Highway.

From this elevation, you're looking out over the Cordillera Central, Puerto Rico's mountainous spine that runs east to west through the heart of the island. On a clear day, the views extend for miles across rolling green peaks, mist-filled valleys, and the patchwork of small farms that cling to the hillsides. This is the Puerto Rico that most tourists never see — rural, mountainous, and stunningly beautiful.

The mirador is named after Federico Degetau, a Puerto Rican politician and writer who served as the island's first Resident Commissioner to the United States Congress in 1901. He was a passionate advocate for Puerto Rican self-governance and civil rights during a critical period when the island was transitioning from Spanish to American rule.

Something you might not expect: the road you're traveling, PR-52, cuts through what ecologists call a cloud forest transition zone at its highest points. That mist you might see rolling over the peaks isn't just weather — it's a microclimate that supports unique plant species found nowhere else on Earth. You're driving not just through history but through one of the Caribbean's most ecologically significant corridors.

Take a moment to breathe it in. The contrast between the urban bustle of San Juan you left behind and this serene mountain panorama is one of the great pleasures of driving through Puerto Rico.`,
    },
    summary: {
      en: 'A dramatic scenic overlook in Cayey with panoramic views of the Cordillera Central mountain range and cloud forest transition zone.',
    },
  },
  {
    id: 'juana-diaz-town',
    name: 'Juana Díaz — Birthplace of Puerto Rican Poetry',
    municipality: 'Juana Díaz',
    type: 'Historical / Cultural',
    coordinates: { lat: 18.0534, lng: -66.5066 },
    triggerRadiusMeters: 500,
    mandatory: false,
    pausePrompt: false,
    segment: 4,
    estimatedStopMinutes: 10,
    narration: {
      en: `Welcome to Juana Díaz, a town that punches well above its weight in Puerto Rican cultural history. Known locally as the "City of the Magi," Juana Díaz hosts one of the most spectacular Three Kings Day celebrations in all of Latin America every January.

But there's another claim to fame here that runs even deeper. Juana Díaz is the birthplace of Luis Lloréns Torres, widely regarded as the national poet of Puerto Rico. Born here in 1876, Lloréns Torres wrote verses that captured the beauty of the island's landscape and the spirit of its people with an intimacy that still resonates today. His poem "Valle de Collores" — yes, named after the very valley we're heading toward — is considered one of the masterpieces of Puerto Rican literature.

The town center still preserves its colonial-era plaza and the Church of San Ramón Nonato, founded in 1798. The streets here have a slower, more contemplative rhythm than the coast. You'll notice that the architecture transitions from the cosmopolitan Spanish colonial style of San Juan to something more rural and grounded — whitewashed walls, wrought-iron balconies, and modest facades that speak to the agricultural heart of this region.

Juana Díaz sits at the crossroads between Puerto Rico's southern coastal plain and the mountain interior we've been driving through. It's a gateway town, and right now, it's your gateway to the waterfalls that lie just ahead.`,
    },
    summary: {
      en: 'Known as the "City of the Magi," Juana Díaz is the birthplace of Puerto Rico\'s national poet Luis Lloréns Torres and hosts spectacular Three Kings Day celebrations.',
    },
  },
  {
    id: 'salto-collores',
    name: 'Salto Collores',
    municipality: 'Juana Díaz',
    type: 'Natural / Waterfall',
    coordinates: { lat: 18.0821, lng: -66.5312 },
    triggerRadiusMeters: 800,
    mandatory: true,
    pausePrompt: true,
    segment: 4,
    estimatedStopMinutes: 40,
    narration: {
      en: `You've arrived at the highlight of our tour — Salto Collores, a magnificent waterfall hidden in the lush tropical ravine of barrio Collores in Juana Díaz. Find a safe place to park — this stop is absolutely worth getting out of the car.

Salto Collores is a multi-tiered cascade that tumbles down a series of rock shelves carved over millennia by a mountain stream flowing from the Cordillera Central. The water falls through dense tropical vegetation — ferns, heliconias, and towering bamboo — creating a natural amphitheater of sound and mist. It's one of Puerto Rico's most beautiful waterfalls, yet it remains relatively unknown to the tourist mainstream, making it a genuine hidden gem.

The trail to the falls is short but involves some uneven terrain, so watch your footing. As you walk in, listen for the sound of the water growing louder through the trees. That building anticipation — the green tunnel opening up to reveal the white cascade — is a moment that stays with people long after they leave.

Here's something to reflect on as you stand at the base of the falls: this valley, Collores, is the same landscape that inspired Luis Lloréns Torres to write "Valle de Collores," the poem we mentioned back in Juana Díaz. When he described the valley's beauty in verse — the rivers, the green hills, the feeling of standing in a place untouched by time — this is exactly what he was seeing. You're standing inside a poem.

The geology here tells its own story. These rock formations are part of the volcanic and sedimentary layers that built Puerto Rico millions of years ago. The water has been carving these falls for thousands of years, and the lush plant life surrounding you is part of a subtropical moist forest ecosystem that supports dozens of endemic species.

Take your time here. Breathe in the mist. Listen to the water. Salto Collores isn't just a scenic stop — it's a place where Puerto Rico's natural beauty, literary heritage, and geological history all converge. This is why we came.`,
    },
    summary: {
      en: 'A stunning multi-tiered waterfall cascading through a lush tropical ravine in barrio Collores. The landscape that inspired Puerto Rico\'s national poet. A must-stop destination.',
    },
  },
  {
    id: 'lago-tortuguero',
    name: 'Laguna de Tortuguero',
    municipality: 'Vega Baja',
    type: 'Natural / Wildlife Refuge',
    coordinates: { lat: 18.4710, lng: -66.3930 },
    triggerRadiusMeters: 700,
    mandatory: false,
    pausePrompt: false,
    segment: 5,
    estimatedStopMinutes: 15,
    narration: {
      en: `As we approach Vega Baja along the northern coast, you're passing near one of Puerto Rico's most important natural treasures — Laguna de Tortuguero, the only natural freshwater coastal lagoon in Puerto Rico.

This 326-acre lagoon is a critical habitat for migratory waterfowl and resident wildlife, including the endangered West Indian manatee. The lagoon sits behind the coastal dunes and is connected to the ocean through a narrow channel, creating a unique brackish-to-fresh water gradient that supports an extraordinary diversity of life. Birdwatchers come from across the Caribbean to spot species here, from the snowy egret to the Caribbean coot.

The name "Tortuguero" comes from the Spanish word for turtle — this was once a major nesting area for sea turtles. While nesting activity has declined over the decades due to coastal development, conservation efforts are working to bring the turtles back. The surrounding nature reserve encompasses mangrove forests, freshwater marsh, and coastal forest — a complete cross-section of Puerto Rico's coastal ecology in one compact area.

Here's an interesting detail: the lagoon's ecosystem is so unique that scientists use it as a natural laboratory for studying how freshwater and saltwater environments interact. Research conducted here has contributed to wetland conservation practices used across the Caribbean.

We've transitioned from the mountain interior back to the coast, and this lagoon perfectly illustrates how quickly Puerto Rico's landscapes change. In just a few hours, you've traveled from colonial forts to mountain cloud forests to tropical waterfalls to coastal wetlands. That's the magic of this island — an entire world compressed into 100 by 35 miles.`,
    },
    summary: {
      en: 'Puerto Rico\'s only natural freshwater coastal lagoon — a critical wildlife habitat home to endangered manatees, migratory birds, and coastal ecology research.',
    },
  },
  {
    id: 'caparra-ruins',
    name: 'Ruinas de Caparra',
    municipality: 'Guaynabo (San Juan Metro)',
    type: 'Historical / Archaeological',
    coordinates: { lat: 18.4027, lng: -66.1108 },
    triggerRadiusMeters: 600,
    mandatory: false,
    pausePrompt: false,
    segment: 6,
    estimatedStopMinutes: 10,
    narration: {
      en: `As we approach San Juan to complete our loop, you're passing near the Ruinas de Caparra — the archaeological remains of the very first Spanish settlement in Puerto Rico, and one of the oldest European settlement sites in the Americas.

Caparra was founded in 1508 by Juan Ponce de León, the island's first governor and the man who would later become famous for his search for the Fountain of Youth. The settlement was established on a hill overlooking the bay, but the site proved problematic — the marshy lowlands bred mosquito-borne illnesses and the location lacked good harbor access. Within a few years, Ponce de León moved the settlement across the bay to what is now Old San Juan, and Caparra was abandoned.

What remains today are the stone foundations of Ponce de León's house and a small museum operated by the Institute of Puerto Rican Culture. The ruins are modest — low walls tracing the outlines of rooms where the colony's first Spanish governor planned the colonization of an island — but their historical significance is enormous. This is ground zero for the European story in Puerto Rico.

Here's a detail that brings it full circle: the fort where we started today, El Morro, was built precisely because the Spanish learned from their Caparra mistake. They needed a defensible, well-positioned harbor. Every massive stone in El Morro's walls traces its purpose back to the lessons learned in these humble ruins.

As we return to San Juan, you've now seen the full arc — from the island's first European foothold, through the mountains and waterfalls of its interior, to the coastal ecosystems that sustain it. That's Puerto Rico in one drive: layered, surprising, and profoundly beautiful.`,
    },
    summary: {
      en: 'Archaeological site of the first Spanish settlement in Puerto Rico, founded by Juan Ponce de León in 1508. Where the European chapter of the island\'s story began.',
    },
  },
];

/**
 * Route waypoints define the driving path between POI clusters.
 * These are passed to the routing engine to generate the road-following polyline.
 *
 * FOLLOW-UP: These intermediate waypoints are approximate. The routing engine
 * (OSRM via Leaflet Routing Machine) will snap them to the road network.
 */
export const routeWaypoints = [
  { lat: 18.4655, lng: -66.1057 },  // San Juan (start)
  { lat: 18.4706, lng: -66.1240 },  // El Morro
  { lat: 18.2352, lng: -66.0378 },  // Caguas
  { lat: 18.1280, lng: -66.1580 },  // Cayey / Mirador
  { lat: 18.0534, lng: -66.5066 },  // Juana Díaz
  { lat: 18.0821, lng: -66.5312 },  // Salto Collores
  { lat: 18.4710, lng: -66.3930 },  // Vega Baja / Tortuguero
  { lat: 18.4027, lng: -66.1108 },  // Caparra Ruins
  { lat: 18.4655, lng: -66.1057 },  // San Juan (return)
];

export default pois;
