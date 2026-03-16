const pois = [
  {
    id: 'old-san-juan-el-morro',
    name: 'Castillo San Felipe del Morro',
    municipality: 'San Juan',
    type: 'Historical / Fortress',
    secondary: false,
    coordinates: { lat: 18.4708427, lng: -66.1242276 },
    triggerRadiusMeters: 500,
    mandatory: false,
    pausePrompt: false,
    segment: 1,
    estimatedStopMinutes: 20,
    narration: {
      en: `On the western edge of Old San Juan, Castillo San Felipe del Morro stands above the entrance to San Juan Bay like a stone gatekeeper. Construction began in 1539, and over the next two centuries the Spanish crown expanded it into the six-level fortress seen today. Its position mattered as much as its walls: any ship hoping to enter the harbor had to pass directly under its guns.

El Morro survived some of the best-known attacks in Puerto Rico's colonial history, including the assaults of Francis Drake in 1595, George Clifford in 1598, the Dutch in 1625, and the British expedition led by Ralph Abercromby in 1797. Even in 1898, during the Spanish-American War, the fort remained part of San Juan's defenses. What looks timeless from the road is really a record of repeated adaptation.

The broad lawn in front of the fortress, now filled with kites and families, once functioned as a military field of fire. That contrast captures something essential about Puerto Rico: spaces built for empire have been repurposed into places of memory, leisure, and local identity. El Morro is not just a monument to Spanish engineering. It is one of the clearest physical links between the island's colonial past and its modern civic life.`,
    },
    summary: {
      en: 'The best-known fort in Puerto Rico, begun in 1539 to defend San Juan Bay and later recognized as part of a UNESCO World Heritage Site.',
    },
    audio: {
      en: '/audio/en/pois/old-san-juan-el-morro.mp3',
    },
  },
  {
    id: 'plaza-del-quinto-centenario',
    name: 'Plaza del Quinto Centenario',
    municipality: 'San Juan',
    type: 'Historical / Public Plaza',
    secondary: true,
    coordinates: { lat: 18.4679206, lng: -66.1190706 },
    triggerRadiusMeters: 300,
    mandatory: false,
    pausePrompt: false,
    segment: 1,
    estimatedStopMinutes: 10,
    narration: {
      en: `Just inland from El Morro is Plaza del Quinto Centenario, a modern public square built in 1992 to mark five hundred years since Columbus's first voyage. The plaza is a useful reminder that Old San Juan is not frozen in the sixteenth century. It is a historic district that continues to reinterpret its own story in public space.

From here you can read the layers of the walled city in one glance: barracks, ramparts, plazas, and the dense urban fabric that grew around military priorities. Even though the plaza itself is modern, it sits within one of the most historically concentrated landscapes in the Caribbean. It works less as a single attraction than as an overlook on the civic and defensive plan of Old San Juan.`,
    },
    summary: {
      en: 'A 1992 plaza beside El Morro that frames the old military heart of San Juan and helps connect the historic district to the present day.',
    },
    audio: {
      en: '/audio/en/pois/plaza-del-quinto-centenario.mp3',
    },
  },
  {
    id: 'caguas-botanical-garden',
    name: 'Jardín Botánico y Cultural de Caguas William Miranda Marín',
    municipality: 'Caguas',
    type: 'Natural / Cultural Garden',
    secondary: false,
    coordinates: { lat: 18.2395442, lng: -66.0622302 },
    triggerRadiusMeters: 500,
    mandatory: false,
    pausePrompt: false,
    segment: 2,
    estimatedStopMinutes: 20,
    narration: {
      en: `As the route bends into the Caguas valley, you pass near the Jardín Botánico y Cultural de Caguas William Miranda Marín. The site brings together native vegetation, cultural interpretation, and the valley's long agricultural story in one landscape. It is a useful midpoint between the colonial coast and the mountain interior ahead.

What gives the garden its particular character is the way it ties plant life to identity. Caguas is named for a Taíno leader, and the garden includes areas that interpret indigenous cultivation traditions alongside later layers of Puerto Rican history. Rather than presenting nature and culture as separate, the site treats the valley as a lived environment shaped by farming, settlement, and memory.

For this drive, the garden matters because it marks a change in geography. San Juan's dense port city gives way here to a greener basin ringed by hills, and the route begins to feel less urban and more inland. It is one of the clearest transition points on the tour.`,
    },
    summary: {
      en: 'A botanical and cultural garden in the Caguas valley that links native plants, Taíno heritage, and the island’s inland agricultural landscape.',
    },
    audio: {
      en: '/audio/en/pois/caguas-botanical-garden.mp3',
    },
  },
  {
    id: 'cayey-mountain-corridor',
    name: 'Cayey Mountain Corridor',
    municipality: 'Cayey',
    type: 'Scenic / Mountain Pass',
    secondary: false,
    coordinates: { lat: 18.128, lng: -66.158 },
    triggerRadiusMeters: 600,
    mandatory: false,
    pausePrompt: false,
    segment: 3,
    estimatedStopMinutes: 10,
    narration: {
      en: `This stretch through Cayey is one of the most dramatic elevation changes on the route. You are crossing the Cordillera Central corridor, where the island's road network threads through Puerto Rico's mountainous spine. Even from the car, the temperature, cloud cover, and vegetation often shift noticeably here.

The importance of Cayey is geographic as much as civic. It sits at a hinge between metropolitan San Juan and the southern municipalities, which is why this corridor has long mattered for movement, trade, and military logistics. Driving through it makes clear how quickly Puerto Rico compresses distinct landscapes into a short distance.

If the coast introduced the island through fortifications and harbor defense, Cayey introduces it through topography. Roads here are not incidental infrastructure. They are a negotiation with ridgelines, valleys, weather, and the basic fact that Puerto Rico is mountainous at its core.`,
    },
    summary: {
      en: 'A mountain passage through Cayey where the route crosses Puerto Rico’s central highlands and the island’s geography becomes the main attraction.',
    },
    audio: {
      en: '/audio/en/pois/cayey-mountain-corridor.mp3',
    },
  },
  {
    id: 'guavate',
    name: 'Guavate',
    municipality: 'Cayey',
    type: 'Cultural / Roadside District',
    secondary: true,
    coordinates: { lat: 18.1325382, lng: -66.0810171 },
    triggerRadiusMeters: 500,
    mandatory: false,
    pausePrompt: false,
    segment: 3,
    estimatedStopMinutes: 20,
    narration: {
      en: `Nearby Guavate is one of Puerto Rico's best-known mountain food districts, especially famous for its lechoneras. For many residents, Guavate is not just a place to eat. It is a ritual stop tied to weekend drives, holiday gatherings, and the social culture of the interior.

What makes Guavate fit this tour is that it shows a different kind of heritage than the formal monuments in San Juan. Here the culture is lived through music, smoke from roadside kitchens, family crowds, and the continued importance of mountain communities to Puerto Rican identity. Even if you do not stop today, knowing Guavate is nearby helps explain why Cayey occupies such a strong place in the island's mental map.`,
    },
    summary: {
      en: 'A well-known mountain district in Cayey associated with lechoneras, weekend drives, and the social life of Puerto Rico’s interior.',
    },
    audio: {
      en: '/audio/en/pois/guavate.mp3',
    },
  },
  {
    id: 'juana-diaz-plaza',
    name: 'Juana Díaz Plaza and San Ramón Nonato Church',
    municipality: 'Juana Díaz',
    type: 'Historical / Town Center',
    secondary: false,
    coordinates: { lat: 18.0525, lng: -66.5066 },
    triggerRadiusMeters: 500,
    mandatory: false,
    pausePrompt: false,
    segment: 4,
    estimatedStopMinutes: 15,
    narration: {
      en: `Juana Díaz was founded in 1798 and remains one of the most culturally resonant towns on Puerto Rico's southern side. Its plaza and church anchor a municipality known for the Three Kings festival and for its literary connection to Luis Lloréns Torres, one of the island's most celebrated poets.

Lloréns Torres was born in the municipality and associated deeply with barrio Collores, the valley landscape ahead. That connection matters because the route is not only moving toward a waterfall. It is moving into a place already shaped in Puerto Rican memory through poetry.

The plaza itself also helps pace the drive. After the mountain passage through Cayey, Juana Díaz feels flatter, warmer, and more open. It is a threshold between transit and arrival, the last urban reference point before the route pushes into the greener folds around Salto Collores.`,
    },
    summary: {
      en: 'The civic heart of Juana Díaz, a town founded in 1798 and closely linked to the Three Kings tradition and poet Luis Lloréns Torres.',
    },
    audio: {
      en: '/audio/en/pois/juana-diaz-plaza.mp3',
    },
  },
  {
    id: 'salto-collores',
    name: 'Salto Collores',
    municipality: 'Juana Díaz',
    type: 'Natural / Waterfall',
    secondary: false,
    coordinates: { lat: 18.0821, lng: -66.5312 },
    triggerRadiusMeters: 800,
    mandatory: true,
    pausePrompt: true,
    segment: 4,
    estimatedStopMinutes: 40,
    narration: {
      en: `This is the mandatory stop on the tour and the point where landscape takes over from roadway. Salto Collores lies in the Collores area of Juana Díaz, a green valley made famous well beyond the municipality by the writing of Luis Lloréns Torres. The waterfall is part of why that valley became such a durable image in Puerto Rican cultural memory.

What makes the stop compelling is not scale alone. It is the combination of moving water, enclosed vegetation, rock shelves, and the feeling of having stepped away from the faster rhythms of the highway. In a compact island drive, Salto Collores supplies the sense of immersion that road narration can only prepare you for.

This stop also resolves the route thematically. You began with military stone at the edge of the Atlantic and now arrive in a place defined by runoff, shade, and inland quiet. Puerto Rico's natural and historical stories do not sit in separate compartments. On this route they keep folding into one another, and Salto Collores is where that becomes most tangible.`,
    },
    summary: {
      en: 'A waterfall stop in the Collores landscape of Juana Díaz, where natural scenery and one of Puerto Rico’s most literary valleys meet.',
    },
    audio: {
      en: '/audio/en/pois/salto-collores.mp3',
    },
  },
  {
    id: 'laguna-tortuguero',
    name: 'Laguna Tortuguero',
    municipality: 'Vega Baja / Manatí',
    type: 'Natural / Lagoon',
    secondary: false,
    coordinates: { lat: 18.4618977, lng: -66.4467585 },
    triggerRadiusMeters: 700,
    mandatory: false,
    pausePrompt: false,
    segment: 5,
    estimatedStopMinutes: 15,
    narration: {
      en: `Back on the north coast, Laguna Tortuguero introduces another Puerto Rico entirely. This lagoon system sits behind dunes and coastal lowlands and is one of the most distinctive wetland environments on the island. After the mountain and waterfall sections of the drive, the route opens into flatter land shaped by water in a completely different way.

The lagoon matters ecologically because it supports wetland habitat and bird life, but it also matters as a reminder that the north coast is more than beaches and highway frontage. Between urban centers are protected and semi-protected environments whose value comes from hydrology, habitat, and the fragile transition between inland freshwater systems and the coast.

For the logic of the tour, Tortuguero works as a closing landscape chapter. It rounds out the drive by showing that Puerto Rico's variety is not just scenic variety. It is a rapid succession of genuinely different ecological zones.`,
    },
    summary: {
      en: 'A major northern-coast lagoon landscape that broadens the tour from mountains and waterfalls into wetlands and coastal ecology.',
    },
    audio: {
      en: '/audio/en/pois/laguna-tortuguero.mp3',
    },
  },
  {
    id: 'balneario-puerto-nuevo',
    name: 'Balneario Puerto Nuevo',
    municipality: 'Vega Baja',
    type: 'Natural / Beach',
    secondary: true,
    coordinates: { lat: 18.4919376, lng: -66.3984963 },
    triggerRadiusMeters: 500,
    mandatory: false,
    pausePrompt: false,
    segment: 5,
    estimatedStopMinutes: 20,
    narration: {
      en: `If you continue exploring after Tortuguero, Balneario Puerto Nuevo is one of the clearest examples of how dramatic the north coast can look in a short span. The beach is known for the large rock formation that helps shelter the bathing area from stronger open-water wave action behind it.

What makes Puerto Nuevo useful as a secondary stop is that it complements the lagoon nearby without repeating it. Tortuguero emphasizes habitat and wetlands. Puerto Nuevo emphasizes the exposed limestone and surf energy of the Atlantic edge. Together they give a fuller picture of Vega Baja's coastal environment.`,
    },
    summary: {
      en: 'A Vega Baja beach known for its protective rock formation and for the more exposed Atlantic character of the north coast.',
    },
    audio: {
      en: '/audio/en/pois/balneario-puerto-nuevo.mp3',
    },
  },
  {
    id: 'caparra-ruins',
    name: 'Ruinas de Caparra',
    municipality: 'Guaynabo',
    type: 'Historical / Archaeological',
    secondary: false,
    coordinates: { lat: 18.405187, lng: -66.1136498 },
    triggerRadiusMeters: 500,
    mandatory: false,
    pausePrompt: false,
    segment: 6,
    estimatedStopMinutes: 15,
    narration: {
      en: `Near the end of the loop, the Ruinas de Caparra take you back to the beginning of the Spanish colonial presence in Puerto Rico. Caparra was founded in 1508 by Juan Ponce de León and became the island's first Spanish settlement on the main island. The site was later abandoned in favor of the more defensible and better-connected location that became Old San Juan.

That makes Caparra especially powerful as a final stop. It explains why San Juan developed where it did. The move was not symbolic. It was driven by practical problems of health, transport, defense, and communication. In other words, the entire urban story you encountered at the beginning of the tour rests partly on the failure of this first settlement.

The ruins are modest, but their importance is not. They provide the origin point for the colonial thread running through the day, and they tie the route into a full historical loop before you return to metropolitan San Juan.`,
    },
    summary: {
      en: 'The archaeological remains of Puerto Rico’s first Spanish settlement, founded in 1508 and later abandoned in favor of Old San Juan.',
    },
    audio: {
      en: '/audio/en/pois/caparra-ruins.mp3',
    },
  },
];

export const routeWaypoints = [
  { lat: 18.4655, lng: -66.1057 },
  { lat: 18.4708427, lng: -66.1242276 },
  { lat: 18.2395442, lng: -66.0622302 },
  { lat: 18.128, lng: -66.158 },
  { lat: 18.0525, lng: -66.5066 },
  { lat: 18.0821, lng: -66.5312 },
  { lat: 18.4618977, lng: -66.4467585 },
  { lat: 18.405187, lng: -66.1136498 },
  { lat: 18.4655, lng: -66.1057 },
];

export default pois;