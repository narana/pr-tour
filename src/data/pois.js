const pois = [
  {
    id: 'caguas-botanical-garden',
    name: 'Jardin Botanico y Cultural de Caguas William Miranda Marin',
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
      en: `As the route bends into the Caguas valley, you pass near the Jardin Botanico y Cultural de Caguas William Miranda Marin. The site brings together native vegetation, cultural interpretation, and the valley's long agricultural story in one landscape. It is a useful midpoint between the colonial coast and the mountain interior ahead.

What gives the garden its particular character is the way it ties plant life to identity. Caguas is named for a Taino leader, and the garden includes areas that interpret indigenous cultivation traditions alongside later layers of Puerto Rican history. Rather than presenting nature and culture as separate, the site treats the valley as a lived environment shaped by farming, settlement, and memory.

For this drive, the garden matters because it marks a change in geography. San Juan's dense port city gives way here to a greener basin ringed by hills, and the route begins to feel less urban and more inland. It is one of the clearest transition points on the tour.`,
    },
    preview: {
      en: `The next major waypoint brings you into the greener basin around Caguas. Expect a softer landscape here, with valley-floor development, garden space, and a stronger sense that the route is leaving the coast behind.

Quick trivia: Caguas takes its name from a Taino leader, not from a Spanish governor. True or false? The answer is true.`,
    },
    summary: {
      en: "A botanical and cultural garden in the Caguas valley that links native plants, Taino heritage, and the island's inland agricultural landscape.",
    },
    audio: {
      en: '/audio/en/pois/caguas-botanical-garden.mp3',
    },
  },
  {
    id: 'carite-cloud-forest',
    name: 'Carite Cloud Forest Approach',
    municipality: 'Guayama / Cayey',
    type: 'Scenic / Forest Corridor',
    secondary: true,
    coordinates: { lat: 18.1556, lng: -66.1034 },
    triggerRadiusMeters: 550,
    mandatory: false,
    pausePrompt: false,
    segment: 3,
    estimatedStopMinutes: 5,
    narration: {
      en: `This stretch signals your climb toward the wetter ridges associated with Bosque Estatal de Carite. Even if you are not entering the forest proper, the road begins to feel different here. The air often cools, clouds hang lower, and the vegetation thickens into a greener, more moisture-driven landscape.

Carite matters in Puerto Rico's environmental history because these uplands help capture water and protect forest cover in the island's interior. It is a reminder that mountain driving here is not only scenic. It is tied to watersheds, reservoirs, and the ecological systems that support communities downhill.

Trivia while you roll on: which side of Puerto Rico is generally wetter, the windward north and east or the drier south coast? The answer is the north and east, which catch more trade-wind moisture.`,
    },
    preview: {
      en: `Ahead, the road starts to feel cooler and more enclosed as you approach the Carite uplands. Listen for a shift in the mood of the drive: this is where the island begins to feel more mountainous and more humid.

Quick multiple-choice trivia: what usually makes cloud forest zones feel wetter? A, trade-wind moisture rising over mountains. B, volcanic steam. C, underground springs only. The answer is A.`,
    },
    summary: {
      en: 'A drive-by mountain-forest corridor where the route enters cooler, wetter uplands on the way toward Cayey.',
    },
    soundscape: {
      type: 'forest',
      durationSeconds: 18,
      en: '/audio/en/ambience/carite-cloud-forest.wav',
    },
    audio: {
      en: '/audio/en/pois/carite-cloud-forest.mp3',
    },
  },
  {
    id: 'boriquen-heritage-corridor',
    name: 'Boriquen Heritage Corridor',
    municipality: 'Cidra / Aibonito approach',
    type: 'Cultural / Historical Drive-By',
    secondary: true,
    coordinates: { lat: 18.210517, lng: -66.047904 },
    triggerRadiusMeters: 650,
    mandatory: false,
    pausePrompt: false,
    segment: 3,
    estimatedStopMinutes: 5,
    narration: {
      en: `This is a good stretch to step back from individual towns and talk about the island as a whole. Long before the name Puerto Rico took hold, the island was known as Boriquen or Boriken, a name associated with the Indigenous Taino world that shaped its rivers, settlements, agriculture, and sacred geography. That older name still carries emotional force today because it points to a Puerto Rico deeper than the colonial map.

The Tainos were not simply a vanished prologue. Their legacy survives in place names, foodways, language, and in the stubborn persistence of memory. Words such as hamaca, huracan, and barbacoa entered wider use through Indigenous Caribbean languages, while cassava, or yuca bread, remained part of everyday life long after Spanish conquest tried to reorganize society.

As the road carries you inland, that continuity matters. Puerto Rican culture is often described through later empires, but the island's first layers were formed by communities that understood these valleys, river corridors, and mountain passages as a lived homeland. Hearing the word Boriquen on this drive is one way of remembering that the story starts there.`,
    },
    preview: {
      en: `The next narration break steps away from a specific landmark and into the deeper origin story of the island. This is where the tour pauses to talk about Boriquen, the Tainos, and the cultural memory that still lives under Puerto Rico's later names and borders.

Quick trivia: which name is older, Puerto Rico or Boriquen? The answer is Boriquen.`,
    },
    summary: {
      en: 'A drive-by history beat introducing Boriquen, Taino cultural continuity, and the island identity beneath later colonial names.',
    },
    audio: {
      en: '/audio/en/pois/boriquen-heritage-corridor.mp3',
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
    preview: {
      en: `A major landscape shift is coming up in Cayey. The next waypoint is less about a single building and more about the feel of the route itself: ridgelines, changing cloud cover, and the sense that the island is folding upward around you.

Trivia question: what is the name of Puerto Rico's central mountain spine? A, Cordillera Central. B, Sierra Madre. C, Montes Azules. The answer is A, Cordillera Central.`,
    },
    summary: {
      en: "A mountain passage through Cayey where the route crosses Puerto Rico's central highlands and the island's geography becomes the main attraction.",
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
    preview: {
      en: `One of Puerto Rico's best-known food corridors is coming up near Guavate. Even without stopping, this is a good place to imagine weekend traffic made up as much of families and appetite as of commuters.

Quick trivia: Guavate is most famous for what mountain-road specialty? A, roast pork. B, lobster. C, sugarcane juice stands only. The answer is A, roast pork.`,
    },
    summary: {
      en: "A well-known mountain district in Cayey associated with lechoneras, weekend drives, and the social life of Puerto Rico's interior.",
    },
    audio: {
      en: '/audio/en/pois/guavate.mp3',
    },
  },
  {
    id: 'coamo-valley-overlook',
    name: 'Coamo Valley Overlook',
    municipality: 'Coamo',
    type: 'Scenic / Valley Transition',
    secondary: true,
    coordinates: { lat: 18.0799, lng: -66.3578 },
    triggerRadiusMeters: 600,
    mandatory: false,
    pausePrompt: false,
    segment: 4,
    estimatedStopMinutes: 5,
    narration: {
      en: `As the route drops toward the south, the landscape begins to open and dry out. This valley transition near Coamo helps explain one of Puerto Rico's strongest environmental contrasts. The mountains catch moisture, but the southern side often sits in a rain shadow, with warmer conditions and a more open visual character.

Coamo is also one of Puerto Rico's oldest municipalities, associated with thermal springs, athletics, and a long inland settlement history. Even when viewed from the road, the valley helps connect climate, topography, and human settlement into one readable scene.

Trivia for the car: which side of Puerto Rico is usually drier, the north coast or the south coast? The answer is the south coast.`,
    },
    preview: {
      en: `The next drive-by waypoint marks a climate shift more than a formal stop. Watch how the vegetation and light change as the route leans into the drier southern side of the island.

Multiple-choice trivia: Coamo is especially known for what long-standing attraction? A, thermal springs. B, glaciers. C, lighthouse cliffs. The answer is A, thermal springs.`,
    },
    summary: {
      en: "A drive-by valley segment near Coamo that highlights Puerto Rico's drier southern rain-shadow landscape.",
    },
    audio: {
      en: '/audio/en/pois/coamo-valley-overlook.mp3',
    },
  },
  {
    id: 'colonial-transition-corridor',
    name: 'Colonial Transition Corridor',
    municipality: 'Aibonito / Coamo approach',
    type: 'Historical / Drive-By',
    secondary: true,
    coordinates: { lat: 18.066369, lng: -66.219139 },
    triggerRadiusMeters: 650,
    mandatory: false,
    pausePrompt: false,
    segment: 4,
    estimatedStopMinutes: 5,
    narration: {
      en: `As the route descends toward the south, it also moves through landscapes that were deeply reorganized under Spanish rule. After 1493 and especially after colonization accelerated in the early sixteenth century, Puerto Rico was drawn into an imperial system built around ports, military control, land grants, forced labor, religion, and later plantation-style agriculture. The result was not a simple replacement of one culture by another. It was a long, uneven transformation of the island's people and terrain.

Roads like this make that history easier to picture. The Spanish colonial world depended on moving goods, livestock, officials, and information between coast and interior. Town plazas, churches, grazing land, and agricultural districts were tied together through exactly these kinds of corridors, even if today's pavement and traffic belong to a much later era.

It is also important to remember that Puerto Rican culture was forged not only from Taino and Spanish influence, but from African heritage as well. Enslaved Africans and their descendants shaped music, religion, labor systems, language, cuisine, and the human reality of colonial Puerto Rico. By the time you reach the southern towns, you are moving through a landscape formed by all of those histories at once.`,
    },
    preview: {
      en: `A broader history segment is coming up on this longer leg. Listen for a shift from scenery to the larger colonial story: Spanish rule, African heritage, and the inland road networks that helped bind Puerto Rico together.

Quick trivia: Puerto Rican culture grew from only two influences, Taino and Spanish. True or false? The answer is false. African heritage is essential to the story as well.`,
    },
    summary: {
      en: 'A long-leg narration point about Spanish rule, colonial road systems, and the combined Taino, Spanish, and African roots of Puerto Rican culture.',
    },
    audio: {
      en: '/audio/en/pois/colonial-transition-corridor.mp3',
    },
  },
  {
    id: 'juana-diaz-plaza',
    name: 'Juana Diaz Plaza and San Ramon Nonato Church',
    municipality: 'Juana Diaz',
    type: 'Historical / Town Center',
    secondary: false,
    coordinates: { lat: 18.0525, lng: -66.5066 },
    triggerRadiusMeters: 500,
    mandatory: false,
    pausePrompt: false,
    segment: 4,
    estimatedStopMinutes: 15,
    narration: {
      en: `Juana Diaz was founded in 1798 and remains one of the most culturally resonant towns on Puerto Rico's southern side. Its plaza and church anchor a municipality known for the Three Kings festival and for its literary connection to Luis Llorens Torres, one of the island's most celebrated poets.

Llorens Torres was born in the municipality and associated deeply with barrio Collores, the valley landscape ahead. That connection matters because the route is not only moving toward a waterfall. It is moving into a place already shaped in Puerto Rican memory through poetry.

The plaza itself also helps pace the drive. After the mountain passage through Cayey, Juana Diaz feels flatter, warmer, and more open. It is a threshold between transit and arrival, the last urban reference point before the route pushes into the greener folds around Salto Collores.`,
    },
    preview: {
      en: `Juana Diaz is the next named waypoint, and it serves as a cultural threshold before the road turns more intimate again. The plaza and church give you one last urban anchor before the route narrows toward greener terrain.

Trivia question: Juana Diaz is especially known for which holiday tradition? A, the Three Kings festival. B, Carnival only. C, a midsummer lantern regatta. The answer is A.`,
    },
    summary: {
      en: 'The civic heart of Juana Diaz, a town founded in 1798 and closely linked to the Three Kings tradition and poet Luis Llorens Torres.',
    },
    audio: {
      en: '/audio/en/pois/juana-diaz-plaza.mp3',
    },
  },
  {
    id: 'salto-collores',
    name: 'Salto Collores',
    municipality: 'Juana Diaz',
    type: 'Natural / Waterfall',
    secondary: false,
    coordinates: { lat: 18.0821, lng: -66.5312 },
    triggerRadiusMeters: 800,
    mandatory: true,
    pausePrompt: true,
    segment: 4,
    estimatedStopMinutes: 40,
    narration: {
      en: `This is the mandatory stop on the tour and the point where landscape takes over from roadway. Salto Collores lies in the Collores area of Juana Diaz, a green valley made famous well beyond the municipality by the writing of Luis Llorens Torres. The waterfall is part of why that valley became such a durable image in Puerto Rican cultural memory.

What makes the stop compelling is not scale alone. It is the combination of moving water, enclosed vegetation, rock shelves, and the feeling of having stepped away from the faster rhythms of the highway. In a compact island drive, Salto Collores supplies the sense of immersion that road narration can only prepare you for.

This stop also resolves the route thematically. You began with military stone at the edge of the Atlantic and now arrive in a place defined by runoff, shade, and inland quiet. Puerto Rico's natural and historical stories do not sit in separate compartments. On this route they keep folding into one another, and Salto Collores is where that becomes most tangible.`,
    },
    preview: {
      en: `The route is closing in on Salto Collores, the point where the tour stops feeling like a drive and starts feeling like an arrival. Expect greener enclosure, running water, and a shift from broad road views to a more intimate landscape.

Quick trivia: the valley around Collores is strongly tied to which Puerto Rican writer? A, Luis Llorens Torres. B, Julia de Burgos. C, Antonio Pedreira. The answer is A, Luis Llorens Torres.`,
    },
    summary: {
      en: "A waterfall stop in the Collores landscape of Juana Diaz, where natural scenery and one of Puerto Rico's most literary valleys meet.",
    },
    soundscape: {
      type: 'waterfall',
      durationSeconds: 18,
      en: '/audio/en/ambience/salto-collores.wav',
    },
    audio: {
      en: '/audio/en/pois/salto-collores.mp3',
    },
  },
  {
    id: 'coqui-soundscape-corridor',
    name: 'Coqui Soundscape Corridor',
    municipality: 'Adjuntas / Jayuya approach',
    type: 'Natural / Wildlife Drive-By',
    secondary: true,
    coordinates: { lat: 18.161137, lng: -66.510011 },
    triggerRadiusMeters: 700,
    mandatory: false,
    pausePrompt: false,
    segment: 5,
    estimatedStopMinutes: 5,
    narration: {
      en: `This quieter leg is a good moment to talk about one of the island's most beloved living symbols: the coqui. These small tree frogs are famous for the two-note call that fills Puerto Rican evenings, especially in wetter and more wooded areas. You may not hear them clearly from the car in daylight, but their sound is so strongly tied to home and memory that the coqui has become a cultural emblem far beyond its size.

What makes the coqui especially meaningful is that it is both ordinary and deeply local. Several coqui species are found in Puerto Rico, and their presence is part of the island's nighttime atmosphere in gardens, forests, and mountain communities. For many Puerto Ricans, the sound of coquis is not just wildlife. It is belonging.

This part of the interior also supports other emblematic species and habitats, from native birds and bats to cloud-fed forests and river valleys. Puerto Rico's natural beauty is not only visual. It is acoustic, ecological, and seasonal. The island's identity lives as much in those repeating sounds of rain, frogs, and birds as it does in forts, plazas, or flags.`,
    },
    preview: {
      en: `The next narration beat is about the island's living soundtrack. On this mountain leg, the tour pauses for the coqui frog and for the idea that Puerto Rican identity is carried not only in history books, but in the sounds of the land itself.

Trivia question: the coqui is a large marsh frog found only on the south coast. True or false? The answer is false. It is a small tree frog strongly associated with Puerto Rico, especially in wetter habitats.`,
    },
    summary: {
      en: 'A wildlife narration point centered on the coqui frog, endemic soundscapes, and the ecological identity of Puerto Rico’s interior.',
    },
    soundscape: {
      type: 'coqui',
      durationSeconds: 18,
      en: '/audio/en/ambience/coqui-soundscape-corridor.wav',
    },
    audio: {
      en: '/audio/en/pois/coqui-soundscape-corridor.mp3',
    },
  },
  {
    id: 'jayuya-highland-corridor',
    name: 'Jayuya Highland Corridor',
    municipality: 'Jayuya',
    type: 'Scenic / Mountain Interior',
    secondary: true,
    coordinates: { lat: 18.2108, lng: -66.5913 },
    triggerRadiusMeters: 650,
    mandatory: false,
    pausePrompt: false,
    segment: 5,
    estimatedStopMinutes: 5,
    narration: {
      en: `As you climb toward Jayuya, the route enters one of the island's most symbolically charged mountain interiors. Jayuya is often associated with indigenous memory, central highland identity, and the idea of Puerto Rico's interior as something culturally distinct from the coastal capital.

The road itself helps explain that reputation. Here the land folds tightly, sight lines shorten, and the trip feels slower and more deliberate. It is a good reminder that the mountains do not just occupy the center of Puerto Rico on a map. They shape tempo, settlement, and imagination.

Trivia while the road winds on: Jayuya sits near Puerto Rico's highest mountains. Which peak is the island's highest? The answer is Cerro de Punta.`,
    },
    preview: {
      en: `Another long stretch is about to be broken by the Jayuya highlands. This upcoming waypoint is about mountain character: tighter curves, deeper folds, and one of the strongest interior identities on the island.

Multiple-choice trivia: which municipality is closely associated with the 1950 nationalist uprising? A, Jayuya. B, Rincon. C, Fajardo. The answer is A, Jayuya.`,
    },
    summary: {
      en: 'A drive-by mountain segment announcing arrival into the culturally resonant highlands around Jayuya.',
    },
    audio: {
      en: '/audio/en/pois/jayuya-highland-corridor.mp3',
    },
  },
  {
    id: 'la-piedra-escrita',
    name: 'La Piedra Escrita',
    municipality: 'Coabey, Jayuya',
    type: 'Historical / Petroglyph Site',
    secondary: false,
    coordinates: { lat: 18.2171404, lng: -66.5731355 },
    triggerRadiusMeters: 500,
    mandatory: false,
    pausePrompt: false,
    segment: 5,
    estimatedStopMinutes: 20,
    narration: {
      en: `La Piedra Escrita is one of the most evocative archaeological stops on the route. Set near the river in Coabey, this large boulder is carved with petroglyphs associated with Puerto Rico's indigenous past. The site matters not because it offers a single easy translation, but because it preserves a visual language from before the colonial order reshaped the island.

What many visitors remember first is the setting. You arrive not at a grand museum facade but at a quieter landscape where water, stone, and vegetation frame the carved surface. That physical context matters. Petroglyphs were not random decorations. They belonged to places already charged with meaning.

La Piedra Escrita also changes the historical balance of the tour. San Juan and Caparra tell colonial stories in stone and walls. This stop shifts attention farther back, toward indigenous presence, ritual landscapes, and the long continuity of memory in the central mountains.

Here is a quick car-trivia answer as you arrive: petroglyphs are images carved into rock, not painted onto it. That distinction is exactly what gives this site its name and its durability.`,
    },
    preview: {
      en: `The upcoming stop at La Piedra Escrita will feel different from the plazas and forts earlier on the route. Expect a quieter, river-adjacent setting where the main experience is the meeting of carved stone and mountain landscape.

Quick multiple-choice trivia: what is a petroglyph? A, a carved image on rock. B, a painted mural on plaster. C, a map drawn on bark. The answer is A, a carved image on rock.`,
    },
    summary: {
      en: 'A petroglyph site in Coabey, Jayuya, where carved indigenous imagery survives in a river-and-stone mountain setting.',
    },
    audio: {
      en: '/audio/en/pois/la-piedra-escrita.mp3',
    },
  },
  {
    id: 'ciales-coffee-ridges',
    name: 'Ciales Coffee Ridges',
    municipality: 'Ciales',
    type: 'Cultural / Agricultural Corridor',
    secondary: true,
    coordinates: { lat: 18.3366, lng: -66.4715 },
    triggerRadiusMeters: 650,
    mandatory: false,
    pausePrompt: false,
    segment: 6,
    estimatedStopMinutes: 5,
    narration: {
      en: `This portion of the drive helps bridge the central mountains and the north. Around Ciales, the landscape has long been tied to coffee cultivation, steep ridges, and towns that developed in close relation to interior agriculture. Even when modern traffic moves quickly, the terrain still reveals that older mountain economy.

Ciales also works as a transition zone. You are no longer in the deepest highland folds around Jayuya, but you have not yet reached the flatter north-coast plain. The result is a layered landscape where coffee country starts to give way to the limestone systems farther north.

Trivia for the road: which crop became especially identified with many of Puerto Rico's upland municipalities in the nineteenth century? The answer is coffee.`,
    },
    preview: {
      en: `To break up the next stretch, listen for a waypoint tied less to monuments and more to the working landscape. The ridges ahead helped sustain coffee cultivation and inland communities long before modern highways shortened the island.

Quick trivia: coffee in Puerto Rico historically thrived more in the cooler uplands than on the hottest coastal plain. True or false? The answer is true.`,
    },
    summary: {
      en: 'A drive-by agricultural landscape near Ciales that marks the transition from the highlands toward the north.',
    },
    audio: {
      en: '/audio/en/pois/ciales-coffee-ridges.mp3',
    },
  },
  {
    id: 'biodiversity-bridge-corridor',
    name: 'Biodiversity Bridge Corridor',
    municipality: 'Utuado / Ciales approach',
    type: 'Natural / Ecology Drive-By',
    secondary: true,
    coordinates: { lat: 18.246768, lng: -66.520195 },
    triggerRadiusMeters: 700,
    mandatory: false,
    pausePrompt: false,
    segment: 6,
    estimatedStopMinutes: 5,
    narration: {
      en: `As the road transitions from the highest interior folds toward the north-central districts, it passes through a surprisingly compact range of life zones. Puerto Rico is small, but the island compresses dry forest, moist uplands, karst country, wetlands, mangroves, beaches, and cloud-touched ridges into a single day's drive. That concentration is one reason the island feels so visually rich even over short distances.

This ecological variety helps explain the wildlife people associate with Puerto Rico. Hummingbirds move through flowering gardens and forests, bats pollinate and disperse seeds in cave and karst systems, migratory birds use the coast and wetlands, and species such as the Puerto Rican parrot have become symbols of both fragility and resilience. Even when you do not see each animal from the road, the habitats that support them are part of the scenery around you.

That is one of the tour's larger lessons. Puerto Rico's beauty is not a single postcard image. It is the speed with which one environment yields to another, and the way culture keeps adapting to those shifts in water, stone, elevation, and climate.`,
    },
    preview: {
      en: `Another long driving leg is about to turn into an ecology segment. Listen for the idea that Puerto Rico's beauty comes not from one famous view, but from the island's unusual concentration of habitats and wildlife.

Quick trivia: Puerto Rico has only one major type of landscape from coast to interior. True or false? The answer is false. The island packs many ecological zones into a very small space.`,
    },
    summary: {
      en: 'A drive-by ecology segment about Puerto Rico’s compressed life zones, wildlife, and the rapid transitions that define the island’s beauty.',
    },
    audio: {
      en: '/audio/en/pois/biodiversity-bridge-corridor.mp3',
    },
  },
  {
    id: 'north-karst-window',
    name: 'North Karst Window',
    municipality: 'Vega Baja / Manati',
    type: 'Natural / Karst Landscape',
    secondary: true,
    coordinates: { lat: 18.3975, lng: -66.4821 },
    triggerRadiusMeters: 700,
    mandatory: false,
    pausePrompt: false,
    segment: 6,
    estimatedStopMinutes: 5,
    narration: {
      en: `The north is coming back into view through one of Puerto Rico's most important landforms: the karst belt. This is the world of limestone hills, sinkholes, caves, and underground water systems that define a huge portion of the north-central island.

Even from the road, karst landscapes often feel irregular compared with open valley driving. The ground rises in rounded formations, drainage patterns become less obvious, and the land hints at what is happening underground. That hidden dimension is the point. Karst is shaped as much by water moving through stone as by what you can see on the surface.

Quick trivia: what is the common local term for Puerto Rico's steep limestone hills? The answer is mogotes.`,
    },
    preview: {
      en: `A new kind of landscape is approaching: the north-coast karst belt. Instead of broad plains or tight mountain folds, the road will soon move through limestone country shaped by caves, sinkholes, and rounded hills.

Multiple-choice trivia: what are Puerto Rico's steep karst hills often called? A, mogotes. B, atoles. C, cenotes. The answer is A, mogotes.`,
    },
    summary: {
      en: 'A drive-by karst waypoint that introduces the limestone landforms shaping north-central Puerto Rico.',
    },
    audio: {
      en: '/audio/en/pois/north-karst-window.mp3',
    },
  },
  {
    id: 'laguna-tortuguero',
    name: 'Laguna Tortuguero',
    municipality: 'Vega Baja / Manati',
    type: 'Natural / Lagoon',
    secondary: false,
    coordinates: { lat: 18.4618977, lng: -66.4467585 },
    triggerRadiusMeters: 700,
    mandatory: false,
    pausePrompt: false,
    segment: 6,
    estimatedStopMinutes: 15,
    narration: {
      en: `Back on the north coast, Laguna Tortuguero introduces another Puerto Rico entirely. This lagoon system sits behind dunes and coastal lowlands and is one of the most distinctive wetland environments on the island. After the mountain and waterfall sections of the drive, the route opens into flatter land shaped by water in a completely different way.

The lagoon matters ecologically because it supports wetland habitat and bird life, but it also matters as a reminder that the north coast is more than beaches and highway frontage. Between urban centers are protected and semi-protected environments whose value comes from hydrology, habitat, and the fragile transition between inland freshwater systems and the coast.

For the logic of the tour, Tortuguero works as a closing landscape chapter. It rounds out the drive by showing that Puerto Rico's variety is not just scenic variety. It is a rapid succession of genuinely different ecological zones.`,
    },
    preview: {
      en: `Laguna Tortuguero is coming up, and the experience ahead is more open, flatter, and wetter than the mountain stretches behind you. Think reeds, lowland water, and the subtle ecology of a protected lagoon system rather than a dramatic cliff or fortification.

Quick trivia: is Laguna Tortuguero a mountain reservoir or a coastal lagoon system? The answer is a coastal lagoon system.`,
    },
    summary: {
      en: 'A major northern-coast lagoon landscape that broadens the tour from mountains and waterfalls into wetlands and coastal ecology.',
    },
    soundscape: {
      type: 'wetland',
      durationSeconds: 18,
      en: '/audio/en/ambience/laguna-tortuguero.wav',
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
    segment: 6,
    estimatedStopMinutes: 20,
    narration: {
      en: `If you continue exploring after Tortuguero, Balneario Puerto Nuevo is one of the clearest examples of how dramatic the north coast can look in a short span. The beach is known for the large rock formation that helps shelter the bathing area from stronger open-water wave action behind it.

What makes Puerto Nuevo useful as a secondary stop is that it complements the lagoon nearby without repeating it. Tortuguero emphasizes habitat and wetlands. Puerto Nuevo emphasizes the exposed limestone and surf energy of the Atlantic edge. Together they give a fuller picture of Vega Baja's coastal environment.`,
    },
    preview: {
      en: `A secondary coastal waypoint lies ahead near Puerto Nuevo, where the north shore feels less like wetland and more like exposed Atlantic shoreline. If you continue exploring later, this is where surf energy and rock formations become the main story.

Trivia question: Puerto Nuevo is especially known for a rock formation that helps do what? It helps shelter part of the bathing area from stronger surf.`,
    },
    summary: {
      en: 'A Vega Baja beach known for its protective rock formation and for the more exposed Atlantic character of the north coast.',
    },
    soundscape: {
      type: 'surf',
      durationSeconds: 18,
      en: '/audio/en/ambience/balneario-puerto-nuevo.wav',
    },
    audio: {
      en: '/audio/en/pois/balneario-puerto-nuevo.mp3',
    },
  },
  {
    id: 'cultural-mosaic-corridor',
    name: 'Cultural Mosaic Corridor',
    municipality: 'Dorado / Toa Baja approach',
    type: 'Cultural / Historical Drive-By',
    secondary: true,
    coordinates: { lat: 18.425105, lng: -66.288483 },
    triggerRadiusMeters: 700,
    mandatory: false,
    pausePrompt: false,
    segment: 7,
    estimatedStopMinutes: 5,
    narration: {
      en: `On the return toward the metropolitan north, it is worth pausing for the bigger picture of Puerto Rican culture. Over centuries, the island became a creole society shaped by Indigenous memory, Spanish colonial institutions, African survival and creativity, migration, trade, and later political change under the United States. None of those layers erased the others completely. Puerto Rican identity grew by absorbing, resisting, and remixing them.

That is why the culture can feel so unified even though its roots are multiple. You hear it in bomba and plena, in Spanish inflected by local vocabulary, in roadside food, in saints' festivals, in baseball, in family networks, and in the symbolic power of words such as Boricua. The term carries an echo of Boriquen while also naming a modern people who understand themselves through both continuity and change.

By this point in the drive, you have seen why that identity is so durable. It is tied to coast and mountain, plaza and forest, archaeology and everyday sound. Puerto Rico's culture is inseparable from the island's landscapes, which is why a road trip can tell the story unusually well.`,
    },
    preview: {
      en: `One final long-leg narration is ahead before Caparra. It pulls the whole day together by looking at Puerto Rico as a cultural mosaic, where Boricua identity carries Indigenous memory, Spanish and African legacies, and the lived reality of the modern island.

Quick trivia: the word Boricua echoes an older Indigenous name for the island. The answer is true.`,
    },
    summary: {
      en: 'A late-route cultural synthesis about Boricua identity and the intertwined Indigenous, Spanish, African, and modern layers of Puerto Rican life.',
    },
    audio: {
      en: '/audio/en/pois/cultural-mosaic-corridor.mp3',
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
    segment: 7,
    estimatedStopMinutes: 15,
    narration: {
      en: `Near the end of the loop, the Ruinas de Caparra take you back to the beginning of the Spanish colonial presence in Puerto Rico. Caparra was founded in 1508 by Juan Ponce de Leon and became the island's first Spanish settlement on the main island. The site was later abandoned in favor of the more defensible and better-connected location that became Old San Juan.

That makes Caparra especially powerful as a final stop. It explains why San Juan developed where it did. The move was not symbolic. It was driven by practical problems of health, transport, defense, and communication. In other words, the entire urban story you encountered at the beginning of the tour rests partly on the failure of this first settlement.

The ruins are modest, but their importance is not. They provide the origin point for the colonial thread running through the day, and they tie the route into a full historical loop before you return to metropolitan San Juan.`,
    },
    preview: {
      en: `The final historical waypoint before the return to San Juan is Caparra. Expect a quieter archaeological site than El Morro, but one that carries a huge share of the island's early colonial story.

Quick trivia: was Caparra founded before or after Old San Juan became the main colonial center? The answer is before.`,
    },
    summary: {
      en: "The archaeological remains of Puerto Rico's first Spanish settlement, founded in 1508 and later abandoned in favor of Old San Juan.",
    },
    audio: {
      en: '/audio/en/pois/caparra-ruins.mp3',
    },
  },
];

export const routeWaypoints = [
  { lat: 18.4655, lng: -66.1057 },
  { lat: 18.2395442, lng: -66.0622302 },
  { lat: 18.128, lng: -66.158 },
  { lat: 18.0525, lng: -66.5066 },
  { lat: 18.0821, lng: -66.5312 },
  { lat: 18.2171404, lng: -66.5731355 },
  { lat: 18.4618977, lng: -66.4467585 },
  { lat: 18.405187, lng: -66.1136498 },
  { lat: 18.4655, lng: -66.1057 },
];

export const routeWaypointLabels = [
  'Jardin Botanico y Cultural de Caguas William Miranda Marin',
  'Cayey Mountain Corridor',
  'Juana Diaz Plaza and San Ramon Nonato Church',
  'Salto Collores',
  'La Piedra Escrita',
  'Laguna Tortuguero',
  'Ruinas de Caparra',
  'San Juan',
];

export default pois;
