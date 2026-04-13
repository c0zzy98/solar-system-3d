export type PlanetId =
  | 'sun' | 'mercury' | 'earth' | 'moon' | 'mars' | 'jupiter'
  | 'saturn' | 'uranus' | 'neptune' | 'pluto'
  | 'voyager1' | 'voyager2' | 'new-horizons' | 'parker'

export type HabitabilityRating = 'good' | 'ok' | 'bad'

export type PlanetStory = {
  discovery: { year: string; event: string }[]
  habitability: {
    score: number
    label: string
    factors: { name: string; value: string; rating: HabitabilityRating }[]
  }
  images: { src: string; caption: string }[]
}

export type PlanetData = {
  id: PlanetId
  name: string
  color: string
  size: number
  position: [number, number, number]
  labelOffset: [number, number, number]
  orbitRadius?: number
  orbitSpeed?: number
  rotationSpeed?: number
  texturePath?: string
  ringTexturePath?: string
  gradientColors?: string[]
  probeImagePath?: string
  description: string
  subtitle: string
  fact: string
  stats: { label: string; value: string }[]
  story: PlanetStory
  isProbe?: boolean
}

export const PLANETS: PlanetData[] = [
  {
    id: 'sun',
    name: 'Słońce',
    color: '#f59e0b',
    size: 1.35,
    position: [0, 0, 0],
    labelOffset: [0, -1.9, 0],
    texturePath: '/textures/sun.png',
    rotationSpeed: 0.02,
    description:
      'Słońce jest centralnym punktem całego experience. To od niego zaczyna się układ i to ono buduje najmocniejszy akcent wizualny w hero.',
    subtitle: 'Centralna gwiazda układu i główne źródło światła.',
    fact: 'Słońce zawiera ponad 99% masy całego Układu Słonecznego.',
    stats: [
      { label: 'Typ', value: 'Gwiazda typu G' },
      { label: 'Wiek', value: '4.6 mld lat' },
      { label: 'Średnica', value: '1.39 mln km' },
    ],
    story: {
      discovery: [
        { year: 'ok. 4.6 mld lat temu', event: 'Słońce powstaje z obłoku gazu i pyłu — mgławicy słonecznej.' },
        { year: 'Starożytność', event: 'Babilończycy i Egipcjanie dokumentują cykl słoneczny i budują kalendarze.' },
        { year: '1543', event: 'Kopernik umieszcza Słońce w centrum układu, obalając model geocentryczny.' },
        { year: '1610', event: 'Galileusz obserwuje plamy słoneczne przez teleskop.' },
        { year: '1859', event: 'Richard Carrington opisuje pierwszą zarejestrowaną rozbłysk słoneczny.' },
        { year: 'Dziś', event: 'Sondy Parker Solar Probe i Solar Orbiter badają koronę i wiatr słoneczny z rekordowej bliskości.' },
      ],
      habitability: {
        score: 0,
        label: 'Niemożliwa do zamieszkania',
        factors: [
          { name: 'Temperatura', value: '5 500°C na powierzchni', rating: 'bad' },
          { name: 'Atmosfera', value: 'Plazma i gazy', rating: 'bad' },
          { name: 'Woda', value: 'Brak', rating: 'bad' },
          { name: 'Grawitacja', value: '274 m/s² (28× Ziemia)', rating: 'bad' },
          { name: 'Promieniowanie', value: 'Ekstremalne', rating: 'bad' },
          { name: 'Ciśnienie', value: 'Kolosalne', rating: 'bad' },
        ],
      },
      images: [
        { src: '/gallery/sun.png', caption: 'Słońce w ultrafioletowym obrazowaniu — NASA SDO, 2010' },
        { src: '/gallery/sun2.png', caption: 'Parker Solar Probe — sonda badająca Słońce z rekordowej odległości' },
      ],
    },
  },
  {
    id: 'mercury',
    name: 'Merkury',
    color: '#b7a18a',
    size: 0.22,
    position: [2.2, 0, 0],
    labelOffset: [0, -0.55, 0],
    orbitRadius: 2.2,
    texturePath: '/textures/mercury.png',
    orbitSpeed: 0.22,
    rotationSpeed: 0.012,
    description:
      'Merkury może działać jako bardziej techniczna i surowa sekcja. Mały obiekt, ale bardzo czytelny w całym układzie.',
    subtitle: 'Najbliższa planeta od Słońca.',
    fact: 'Dzień na Merkurym trwa dłużej niż jego rok.',
    stats: [
      { label: 'Dystans', value: '57.9 mln km' },
      { label: 'Rok', value: '88 dni' },
      { label: 'Księżyce', value: '0' },
    ],
    story: {
      discovery: [
        { year: 'Starożytność', event: 'Obserwowany przez Sumeryjczyków ok. 3000 p.n.e. jako „Skacząca planeta".' },
        { year: '1631', event: 'Pierre Gassendi po raz pierwszy obserwuje tranzyt Merkurego przez tarczę Słońca.' },
        { year: '1965', event: 'Odkrycie rezonansu 3:2 — Merkury obraca się 3 razy na każde 2 okrążenia Słońca.' },
        { year: '1974–75', event: 'Mariner 10 wykonuje pierwsze bliskie zdjęcia — kraterowana, księżycowa powierzchnia.' },
        { year: '2011–2015', event: 'Sonda MESSENGER wchodzi na orbitę i mapuje całą powierzchnię planety.' },
      ],
      habitability: {
        score: 5,
        label: 'Praktycznie niemożliwa',
        factors: [
          { name: 'Temperatura', value: '+430°C do -180°C', rating: 'bad' },
          { name: 'Atmosfera', value: 'Praktycznie brak', rating: 'bad' },
          { name: 'Woda', value: 'Lód w cieniu kraterów', rating: 'bad' },
          { name: 'Grawitacja', value: '3.7 m/s² (38% Ziemi)', rating: 'ok' },
          { name: 'Promieniowanie', value: 'Brak ochrony', rating: 'bad' },
          { name: 'Ciśnienie', value: 'Bliskie zeru', rating: 'bad' },
        ],
      },
      images: [
        { src: '/gallery/mercury.png', caption: 'Merkury w prawdziwych kolorach — MESSENGER, 2008' },
        { src: '/gallery/mercury2.png', caption: 'Fałszywe kolory ukazujące różnice składu powierzchni — MESSENGER' },
      ],
    },
  },
  {
    id: 'earth',
    name: 'Ziemia',
    color: '#3b82f6',
    size: 0.38,
    position: [4.2, 0, 0],
    labelOffset: [0, -0.7, 0],
    orbitRadius: 4.2,
    texturePath: '/textures/earth.png',
    orbitSpeed: 0.10,
    rotationSpeed: 0.09,
    description:
      'Ziemia jest najlepszym kandydatem pod najbardziej dopracowaną sekcję premium. Dobrze wygląda w 3D i świetnie nadaje się do storytellingu.',
    subtitle: 'Najbardziej rozpoznawalna planeta układu.',
    fact: 'To jedyna znana planeta, na której istnieje życie.',
    stats: [
      { label: 'Doba', value: '24h' },
      { label: 'Księżyce', value: '1' },
      { label: 'Woda', value: '≈ 71%' },
    ],
    story: {
      discovery: [
        { year: 'ok. 3.8 mld lat temu', event: 'Pojawienie się pierwszych form życia w oceanach — prokarioty.' },
        { year: '1543', event: 'Kopernik potwierdza, że Ziemia krąży wokół Słońca — nie odwrotnie.' },
        { year: '1957', event: 'Sputnik 1 — pierwszy sztuczny satelita Ziemi, otwarcie ery kosmicznej.' },
        { year: '1972', event: 'Apollo 17 wykonuje ikoniczne zdjęcie „Blue Marble" — pierwsze pełne zdjęcie Ziemi.' },
        { year: '2015', event: 'DSCOVR fotografuje Ziemię z odległości 1.5 mln km — nowe „Pale Blue Dot".' },
        { year: 'Dziś', event: 'Jedyna znana planeta z aktywnymi ekosystemami i cywilizacją techniczną.' },
      ],
      habitability: {
        score: 100,
        label: 'W pełni zamieszkiwalna',
        factors: [
          { name: 'Atmosfera', value: 'Azot 78%, tlen 21%', rating: 'good' },
          { name: 'Temperatura', value: 'śr. +15°C', rating: 'good' },
          { name: 'Woda', value: 'Ciekła, 71% powierzchni', rating: 'good' },
          { name: 'Grawitacja', value: '9.8 m/s² (baza)', rating: 'good' },
          { name: 'Promieniowanie', value: 'Tarcza magnetyczna', rating: 'good' },
          { name: 'Ciśnienie', value: '1 atm (baza)', rating: 'good' },
        ],
      },
      images: [
        { src: '/gallery/earth.png', caption: 'Blue Marble — Apollo 17, 1972' },
        { src: '/gallery/earth2.png', caption: 'Ziemia z odległości 1.5 mln km — DSCOVR, 2015' },
      ],
    },
  },
  {
    id: 'moon',
    name: 'Księżyc',
    color: '#d4d4d8',
    size: 0.12,
    position: [4.8, 0.25, 0],
    labelOffset: [0, -0.45, 0],
    orbitRadius: 4.85,
    texturePath: '/textures/moon.png',
    description:
      'Księżyc dobrze działa jako chłodniejszy, bardziej spokojny wizualnie blok. Jasny obiekt i ciemne tło dają fajny kontrast.',
    subtitle: 'Naturalny satelita Ziemi.',
    fact: 'Księżyc stabilizuje oś obrotu Ziemi i wpływa na pływy.',
    stats: [
      { label: 'Dystans', value: '384 400 km' },
      { label: 'Grawitacja', value: '1.62 m/s²' },
      { label: 'Orbita', value: '27.3 dnia' },
    ],
    story: {
      discovery: [
        { year: 'ok. 4.5 mld lat temu', event: 'Powstanie Księżyca po kolizji protoplanety Thei z Ziemią — hipoteza gigantycznego zderzenia.' },
        { year: 'Starożytność', event: 'Grecy mierzą odległość Księżyca od Ziemi z zaskakującą dokładnością — Hipparch ok. 380 000 km.' },
        { year: '1959', event: 'Luna 1 — pierwsza sonda, która opuściła obszar Ziemi i przeleciała obok Księżyca.' },
        { year: '1969', event: 'Apollo 11 — Neil Armstrong i Buzz Aldrin stawiają pierwsze kroki na Księżycu.' },
        { year: '2009', event: 'LCROSS potwierdza obecność wody (lodu) w permanentnie zacienionych kraterach.' },
      ],
      habitability: {
        score: 12,
        label: 'Ekstremalnie trudna',
        factors: [
          { name: 'Temperatura', value: '+127°C do -173°C', rating: 'bad' },
          { name: 'Atmosfera', value: 'Praktycznie brak', rating: 'bad' },
          { name: 'Woda', value: 'Lód w kraterach', rating: 'ok' },
          { name: 'Grawitacja', value: '1.62 m/s² (16% Ziemi)', rating: 'ok' },
          { name: 'Promieniowanie', value: 'Brak ochrony', rating: 'bad' },
          { name: 'Ciśnienie', value: 'Bliskie zeru', rating: 'bad' },
        ],
      },
      images: [
        { src: '/gallery/moon.png', caption: 'Pełnia Księżyca' },
        { src: '/gallery/moon2.png', caption: 'Buzz Aldrin na powierzchni Księżyca — Apollo 11, 1969' },
      ],
    },
  },
  {
    id: 'mars',
    name: 'Mars',
    color: '#c2410c',
    size: 0.3,
    position: [6.3, 0, 0],
    labelOffset: [0, -0.65, 0],
    orbitRadius: 6.3,
    texturePath: '/textures/mars.png',
    orbitSpeed: 0.054,
    rotationSpeed: 0.085,
    description:
      'Mars może być najbardziej pokazową sekcją portfolio. Ciepłe światło, mocny kolor i klimat sci-fi robią robotę.',
    subtitle: 'Najbardziej filmowy z bliskich światów.',
    fact: 'Na Marsie znajduje się Olympus Mons — największy wulkan w Układzie Słonecznym.',
    stats: [
      { label: 'Doba', value: '24h 37m' },
      { label: 'Księżyce', value: '2' },
      { label: 'Temp.', value: '≈ -63°C' },
    ],
    story: {
      discovery: [
        { year: 'Starożytność', event: 'Obserwowany przez Babilończyków i Greków — „Ares", bóg wojny.' },
        { year: '1877', event: 'Asaph Hall odkrywa dwa księżyce Marsa — Fobos i Deimos.' },
        { year: '1965', event: 'Mariner 4 wykonuje pierwsze bliskie zdjęcia — surowy, kraterowany krajobraz.' },
        { year: '2004', event: 'Łaziki Spirit i Opportunity potwierdzają ślady dawnej wody na powierzchni.' },
        { year: '2012', event: 'Curiosity ląduje w kraterze Gale i bada skały osadowe.' },
        { year: '2021', event: 'Perseverance pobiera próbki gleby i testuje produkcję tlenu (MOXIE).' },
        { year: 'Cel: ~2040', event: 'Planowane pierwsze załogowe misje na Marsa — SpaceX i NASA.' },
      ],
      habitability: {
        score: 22,
        label: 'Ekstremalnie trudna',
        factors: [
          { name: 'Atmosfera', value: 'CO₂ 95%, ciśn. 1%', rating: 'bad' },
          { name: 'Temperatura', value: 'śr. -63°C, do -125°C', rating: 'bad' },
          { name: 'Woda', value: 'Lód pod powierzchnią', rating: 'ok' },
          { name: 'Grawitacja', value: '3.72 m/s² (38% Ziemi)', rating: 'ok' },
          { name: 'Promieniowanie', value: 'Słabe pole mag.', rating: 'bad' },
          { name: 'Ciśnienie', value: '~0.006 atm', rating: 'bad' },
        ],
      },
      images: [
        { src: '/gallery/mars.png', caption: 'Mars w prawdziwych kolorach — sonda Rosetta' },
        { src: '/gallery/mars2.png', caption: 'Olympus Mons — największy wulkan w Układzie Słonecznym' },
      ],
    },
  },
  {
    id: 'jupiter',
    name: 'Jowisz',
    color: '#c88b3a',
    size: 0.78,
    position: [8.8, 0, 0],
    labelOffset: [0, -1.1, 0],
    orbitRadius: 8.8,
    orbitSpeed: 0.030,
    rotationSpeed: 0.19,
    texturePath: '/textures/jupiter.png',
    description:
      'Jowisz to największa planeta Układu Słonecznego — gazowy gigant, którego masa przekracza masę wszystkich pozostałych planet razem wziętych. Bada go sonda Juno.',
    subtitle: 'Największy olbrzym gazowy naszego układu.',
    fact: 'Wielka Czerwona Plama to antycyklon o rozmiarach Ziemi, trwający ponad 350 lat.',
    stats: [
      { label: 'Doba', value: '9h 56m' },
      { label: 'Księżyce', value: '95' },
      { label: 'Masa', value: '318× Ziemia' },
    ],
    story: {
      discovery: [
        { year: 'Starożytność', event: 'Jowisz znany od tysięcy lat — Babilończycy śledzili go jako „Marduka", boga piorunów.' },
        { year: '1610', event: 'Galileusz odkrywa cztery duże księżyce: Io, Europę, Ganimedesa i Kallisto — pierwsze ciała krążące nie wokół Ziemi.' },
        { year: '1665', event: 'Giovanni Cassini obserwuje Wielką Czerwoną Plamę — burzę, która trwa do dziś.' },
        { year: '1973–74', event: 'Pioneer 10 i 11 wykonują pierwsze bliskie przeloty, mierząc pole magnetyczne planety.' },
        { year: '1979', event: 'Voyager 1 i 2 odkrywają aktywne wulkany na Io i cienkie pierścienie Jowisza.' },
        { year: '1994', event: 'Kometa Shoemaker-Levy 9 rozbija się o Jowisza — pierwsze bezpośrednio obserwowane zderzenie w Układzie Słonecznym.' },
        { year: '1995–2003', event: 'Sonda Galileo spędza 8 lat na orbicie, badając atmosferę i lodowe księżyce.' },
        { year: 'Dziś', event: 'Sonda Juno (od 2016) bada wnętrze i bieguny z rekordowo bliskiej orbity polarnej.' },
      ],
      habitability: {
        score: 2,
        label: 'Niemożliwa do zamieszkania',
        factors: [
          { name: 'Temperatura', value: '-110°C (chmury)', rating: 'bad' },
          { name: 'Atmosfera', value: 'Wodór 89%, hel 10%', rating: 'bad' },
          { name: 'Powierzchnia', value: 'Brak stałej', rating: 'bad' },
          { name: 'Grawitacja', value: '24.8 m/s² (2.5× Ziemia)', rating: 'bad' },
          { name: 'Promieniowanie', value: 'Pasy Van Allena', rating: 'bad' },
          { name: 'Ciśnienie', value: 'Kolosalne w głębi', rating: 'bad' },
        ],
      },
      images: [
        { src: '/gallery/jupiter.png', caption: 'Jowisz i Wielka Czerwona Plama — Hubble, 2014' },
        { src: '/gallery/jupiter2.png', caption: 'Europa — lodowy księżyc z oceanem pod powierzchnią — Galileo, 1996' },
      ],
    },
  },
  {
    id: 'saturn',
    name: 'Saturn',
    color: '#c8a96e',
    size: 0.65,
    position: [11.5, 0, 0],
    labelOffset: [0, -0.95, 0],
    orbitRadius: 11.5,
    orbitSpeed: 0.022,
    rotationSpeed: 0.15,
    texturePath: '/textures/saturn.png',
    ringTexturePath: '/textures/saturn-ring.png',
    description:
      'Saturn to król pierścieni — gazowy gigant otoczony rozbudowanym systemem lodowych i skalnych pierścieni rozciągających się na setki tysięcy kilometrów od planety.',
    subtitle: 'Władca pierścieni Układu Słonecznego.',
    fact: 'Saturn jest mniej gęsty niż woda — gdyby istniał wystarczająco duży ocean, planeta by na nim pływała.',
    stats: [
      { label: 'Doba', value: '10h 33m' },
      { label: 'Księżyce', value: '146' },
      { label: 'Gęstość', value: '0.69 g/cm³' },
    ],
    story: {
      discovery: [
        { year: 'Starożytność', event: 'Saturn obserwowany jako najdalszy z widocznych gołym okiem — Babilończycy i Grecy znali go jako „Kronosa".' },
        { year: '1610', event: 'Galileusz przez teleskop widzi dziwny rozciągnięty kształt — myśli, że planeta ma „uszy".' },
        { year: '1655', event: 'Christiaan Huygens wyjaśnia, że Saturn otoczony jest płaskim pierścieniem i odkrywa księżyc Tytan.' },
        { year: '1675', event: 'Giovanni Cassini dostrzega podział między pierścieniami — dziś zwany Przerwą Cassiniego.' },
        { year: '1979–81', event: 'Pioneer 11, Voyager 1 i 2 przesyłają pierwsze szczegółowe obrazy pierścieni i księżyców.' },
        { year: '2004–2017', event: 'Sonda Cassini-Huygens spędza 13 lat na orbicie — odkrywa oceany ciekłej wody pod Enceladusem i jeziora metanu na Tytanie.' },
        { year: '2017', event: 'Cassini kończy misję Grand Finale — zanurza się celowo w atmosferę Saturna.' },
      ],
      habitability: {
        score: 3,
        label: 'Niemożliwa do zamieszkania',
        factors: [
          { name: 'Temperatura', value: '-178°C (chmury)', rating: 'bad' },
          { name: 'Atmosfera', value: 'Wodór 96%, hel 3%', rating: 'bad' },
          { name: 'Powierzchnia', value: 'Brak stałej', rating: 'bad' },
          { name: 'Grawitacja', value: '10.4 m/s² (106% Ziemi)', rating: 'bad' },
          { name: 'Promieniowanie', value: 'Intensywne', rating: 'bad' },
          { name: 'Ciśnienie', value: 'Ekstremalne w głębi', rating: 'bad' },
        ],
      },
      images: [
        { src: '/gallery/saturn.png', caption: 'Saturn podczas równonocy — Cassini, 2009' },
        { src: '/gallery/saturn2.png', caption: 'Gejzery wodne na Enceladusie — Cassini, 2006' },
      ],
    },
  },
  {
    id: 'uranus',
    name: 'Uran',
    color: '#7de8e8',
    size: 0.45,
    position: [14.0, 0, 0],
    labelOffset: [0, -0.75, 0],
    orbitRadius: 14.0,
    orbitSpeed: 0.015,
    rotationSpeed: 0.10,
    gradientColors: ['#a5f5f5', '#82e8ea', '#5ecede', '#68d4e2', '#82e0ec', '#a0f0f2'],
    description:
      'Uran to lodowy gigant o ekstremalnym nachyleniu osi obrotu — krąży wokół Słońca niemal „na boku", więc każdy biegun doświadcza 42-letnich dnia i nocy.',
    subtitle: 'Lodowy gigant obracający się na boku.',
    fact: 'Oś obrotu Urana jest nachylona o 97.77° — planeta toczy się wokół Słońca jak kula bilardowa.',
    stats: [
      { label: 'Rok', value: '84 lata' },
      { label: 'Księżyce', value: '27' },
      { label: 'Nachylenie', value: '97.77°' },
    ],
    story: {
      discovery: [
        { year: '1781', event: 'William Herschel odkrywa Urana 13 marca 1781 — pierwsza planeta odkryta przy użyciu teleskopu w nowożytnej historii.' },
        { year: '1787–1851', event: 'Odkrycie pierwszych czterech księżyców: Tytanii i Oberona (Herschel, 1787) oraz Ariela i Umbriela (Lassell, 1851).' },
        { year: '1977', event: 'Podczas okluzji gwiazdy odkryto pierścienie Urana — wąskie i ciemne, zupełnie inne od Saturna.' },
        { year: '1986', event: 'Voyager 2 — jedyna sonda, która odwiedziła Urana — odkrywa 10 nowych księżyców i bada pierścienie.' },
        { year: '1997–2003', event: 'Odkrycie kolejnych małych księżyców przy użyciu teleskopu Hubble\'a.' },
        { year: '2033 (plan)', event: 'NASA planuje misję Uranus Orbiter and Probe — pierwszą dedykowaną orbitera dla lodowego giganta.' },
      ],
      habitability: {
        score: 1,
        label: 'Niemożliwa do zamieszkania',
        factors: [
          { name: 'Temperatura', value: '-224°C (chmury)', rating: 'bad' },
          { name: 'Atmosfera', value: 'Metan, wodór, hel', rating: 'bad' },
          { name: 'Powierzchnia', value: 'Brak stałej', rating: 'bad' },
          { name: 'Grawitacja', value: '8.69 m/s² (89% Ziemi)', rating: 'bad' },
          { name: 'Promieniowanie', value: 'Bardzo intensywne', rating: 'bad' },
          { name: 'Ciśnienie', value: 'Kolosalne', rating: 'bad' },
        ],
      },
      images: [
        { src: '/gallery/uran.png', caption: 'Uran w barwach naturalnych — Voyager 2, 1986' },
        { src: '/gallery/uran2.png', caption: 'Pierścienie i księżyce Urana — Hubble, 2004' },
      ],
    },
  },
  {
    id: 'neptune',
    name: 'Neptun',
    color: '#4b70dd',
    size: 0.42,
    position: [16.5, 0, 0],
    labelOffset: [0, -0.75, 0],
    orbitRadius: 16.5,
    orbitSpeed: 0.010,
    rotationSpeed: 0.10,
    gradientColors: ['#182e70', '#254594', '#3a58bc', '#2d50aa', '#1e3c88', '#182e70'],
    description:
      'Neptun to najdalszy lodowy olbrzym Układu Słonecznego — ukryty świat szalejących wiatrów do 2100 km/h, odkryty jako pierwsza planeta drogą obliczeń matematycznych.',
    subtitle: 'Najdalszy i najwetrzniejszy świat układu.',
    fact: 'Wiatry na Neptunie osiągają 2100 km/h — najsilniejsze ze wszystkich planet Układu Słonecznego.',
    stats: [
      { label: 'Rok', value: '165 lat' },
      { label: 'Księżyce', value: '16' },
      { label: 'Wiatry', value: '2100 km/h' },
    ],
    story: {
      discovery: [
        { year: '1612–13', event: 'Galileusz obserwuje Neptuna, lecz zapisuje go jako nieruchomą gwiazdę — nie odkrywa go oficjalnie.' },
        { year: '1846', event: 'Le Verrier (Francja) i Adams (Anglia) niezależnie przewidują orbitę na podstawie perturbacji Urana; Galle i d\'Arrest odkrywają planetę 23 września 1846.' },
        { year: '1846', event: 'Zaledwie kilka tygodni po odkryciu William Lassell dostrzega Trytona — duży księżyc w ruchu wstecznym.' },
        { year: '1989', event: 'Voyager 2 — jedyna sonda odwiedzająca Neptuna — odkrywa Wielką Ciemną Plamę i gejzery azotowe na Trytonie.' },
        { year: '2013', event: 'Hubble odkrywa 14. księżyc Neptuna — S/2004 N 1, zaledwie 20 km średnicy.' },
        { year: 'Przyszłość', event: 'Misja do Neptuna jest w fazie planowania — może wzorować się na misji Cassini.' },
      ],
      habitability: {
        score: 0,
        label: 'Niemożliwa do zamieszkania',
        factors: [
          { name: 'Temperatura', value: '-214°C (chmury)', rating: 'bad' },
          { name: 'Atmosfera', value: 'Wodór, hel, metan', rating: 'bad' },
          { name: 'Powierzchnia', value: 'Brak stałej', rating: 'bad' },
          { name: 'Grawitacja', value: '11.15 m/s² (114% Ziemi)', rating: 'bad' },
          { name: 'Wiatry', value: '2100 km/h', rating: 'bad' },
          { name: 'Ciśnienie', value: 'Ekstremalne', rating: 'bad' },
        ],
      },
      images: [
        { src: '/gallery/neptun.png', caption: 'Neptun z Wielką Ciemną Plamą — Voyager 2, 1989' },
        { src: '/gallery/neptun2.png', caption: 'Tryton — największy księżyc Neptuna z gejzerami azotowymi — Voyager 2, 1989' },
      ],
    },
  },
  {
    id: 'pluto',
    name: 'Pluton',
    color: '#a08070',
    size: 0.10,
    position: [18.8, 0, 0],
    labelOffset: [0, -0.42, 0],
    orbitRadius: 18.8,
    orbitSpeed: 0.007,
    rotationSpeed: -0.04,
    gradientColors: ['#8c6b52', '#a08060', '#c8a882', '#9c8870', '#7e6048', '#8c6b52'],
    description:
      'Pluton — planeta karłowata na skraju Układu Słonecznego — skrywa lodowe góry, azotowe równiny i serce kształtu serca odkryte przez New Horizons w 2015 roku.',
    subtitle: 'Lodowy karzeł na rubieżach Układu Słonecznego.',
    fact: 'New Horizons odkrył na Plutonie lodowe góry wysokości Alp i serce — Regio Tombaugh — płynące lodami azotowymi.',
    stats: [
      { label: 'Rok', value: '248 lat' },
      { label: 'Księżyce', value: '5' },
      { label: 'Typ', value: 'Planeta karłowata' },
    ],
    story: {
      discovery: [
        { year: '1930', event: 'Clyde Tombaugh odkrywa Plutona 18 lutego 1930 w obserwatorium Lowell w Arizonie po roku mozolnego przeszukiwania płyt fotograficznych.' },
        { year: '1978', event: 'James Christy odkrywa Charona — księżyc prawie tak duży jak Pluton sam.' },
        { year: '1988', event: 'Pomiary okluzji gwiazdy potwierdzają obecność cienkiej atmosfery z azotem i metanem.' },
        { year: '2005', event: 'Teleskop Hubble\'a odkrywa Nix i Hydrę — dwa kolejne, mniejsze księżyce.' },
        { year: '2006', event: 'Międzynarodowa Unia Astronomiczna reklasyfikuje Plutona jako „planetę karłowatą".' },
        { year: '2015', event: 'New Horizons przelatuje 14 lipca w odległości 12 500 km — dostarcza pierwszych szczegółowych zdjęć: gór lodowych i serca Tombaugh Regio.' },
      ],
      habitability: {
        score: 2,
        label: 'Niemożliwa do zamieszkania',
        factors: [
          { name: 'Temperatura', value: '-230°C', rating: 'bad' },
          { name: 'Atmosfera', value: 'Azot, metan (śladowa)', rating: 'bad' },
          { name: 'Woda', value: 'Zamarznięta', rating: 'bad' },
          { name: 'Grawitacja', value: '0.62 m/s² (6% Ziemi)', rating: 'bad' },
          { name: 'Promieniowanie', value: 'Brak ochrony', rating: 'bad' },
          { name: 'Ciśnienie', value: 'Bliskie zeru', rating: 'bad' },
        ],
      },
      images: [
        { src: '/gallery/pluton.png', caption: 'Pluton w prawdziwych kolorach z sercem Tombaugh Regio — New Horizons, 2015' },
        { src: '/gallery/pluton2.png', caption: 'Charon — największy księżyc Plutona — New Horizons, 2015' },
      ],
    },
  },
  // ─── Probes ───────────────────────────────────────────────────────────────
  {
    id: 'parker',
    name: 'Parker Solar Probe',
    color: '#fb923c',
    size: 0.055,
    position: [0.82, 0.08, 0.38],
    labelOffset: [0, -0.22, 0],
    isProbe: true,
    description:
      'Parker Solar Probe to najszybszy obiekt stworzony przez człowieka. Nurkuje w koronę słoneczną, zbierając dane o wietrze słonecznym i polach magnetycznych.',
    subtitle: 'Najszybszy i najbliżej Słońca — sonda NASA.',
    fact: 'Parker osiągnął prędkość ponad 692 000 km/h — żaden wcześniejszy pojazd nie był szybszy.',
    stats: [
      { label: 'Start', value: '12.08.2018' },
      { label: 'Prędkość', value: '692 000 km/h' },
      { label: 'Dystans', value: '~0.07 AU' },
    ],
    story: {
      discovery: [
        { year: '2018', event: 'Start sondy Parker Solar Probe z Kennedy Space Center — misja NASA.' },
        { year: '2021', event: 'Sonda jako pierwsza przelatuje przez koronę słoneczną na odległości 8.5 mln km od fotosf.' },
        { year: '2024', event: 'Parker osiąga rekordową prędkość 692 000 km/h i zanurza się w koronę do odległości 6.1 mln km.' },
        { year: '2026', event: 'Sonda kontynuuje kolejne przeloty peryhelialne, dostarczając dane o strukturze wiatru słonecznego.' },
      ],
      habitability: {
        score: 0,
        label: 'Artefakt — nie dotyczy',
        factors: [
          { name: 'Typ', value: 'Sonda naukowa', rating: 'bad' },
          { name: 'Masa', value: '555 kg', rating: 'ok' },
          { name: 'Tarcza termiczna', value: 'Węgiel, 1377°C', rating: 'bad' },
          { name: 'Zasilanie', value: 'Panele fotowoltaiczne', rating: 'ok' },
          { name: 'Łączność', value: 'Deep Space Network', rating: 'ok' },
          { name: 'Misja', value: '2018 – ~2025', rating: 'ok' },
        ],
      },
      images: [
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Parker_Solar_Probe_spacecraft.jpg/800px-Parker_Solar_Probe_spacecraft.jpg', caption: 'Parker Solar Probe — wizualizacja artystyczna, NASA' },
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/800px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg', caption: 'Korona słoneczna w ultrafiolecie — NASA SDO' },
      ],
    },
  },
  {
    id: 'new-horizons',
    name: 'New Horizons',
    color: '#818cf8',
    size: 0.06,
    position: [12.1, 0.15, -19.4],
    labelOffset: [0, -0.26, 0],
    isProbe: true,
    probeImagePath: '/sondy/newhorizons.png',
    description:
      'New Horizons to pierwsza sonda, która wykonała bliski przelot obok Plutona w 2015 roku. Teraz wędruje przez Pas Kuipera, badając lodowe obiekty na obrzeżach Układu Słonecznego.',
    subtitle: 'Pierwsza sonda u granic Układu Słonecznego.',
    fact: 'New Horizons sfotografował serce Plutona — Tombaugh Regio — z odległości zaledwie 12 500 km.',
    stats: [
      { label: 'Start', value: '19.01.2006' },
      { label: 'Dystans', value: '~58 AU' },
      { label: 'Prędkość', value: '14.1 km/s' },
    ],
    story: {
      discovery: [
        { year: '2006', event: 'Start New Horizons z przylądka Canaveral — najszybsza sonda startująca bezpośrednio w kosmos.' },
        { year: '2007', event: 'Przelot obok Jowisza — sonda wykorzystuje grawitację planety do przyspieszenia.' },
        { year: '2015', event: '14 lipca — historyczny przelot obok Plutona w odległości 12 500 km. Pierwsze szczegółowe zdjęcia.' },
        { year: '2019', event: 'Przelot obok Arrokoth (2014 MU69) — najdalszy obiekt odwiedzony przez sondę kosmiczną.' },
        { year: '2026', event: 'New Horizons kontynuuje podróż przez Pas Kuipera, ok. 58 AU od Słońca.' },
      ],
      habitability: {
        score: 0,
        label: 'Artefakt — nie dotyczy',
        factors: [
          { name: 'Typ', value: 'Sonda naukowa', rating: 'bad' },
          { name: 'Masa', value: '478 kg', rating: 'ok' },
          { name: 'Zasilanie', value: 'RTG plutonowy', rating: 'ok' },
          { name: 'Łączność', value: 'Deep Space Network', rating: 'ok' },
          { name: 'Instrumenty', value: 'LORRI, SWAP, ALICE', rating: 'ok' },
          { name: 'Misja', value: '2006 – czynna', rating: 'good' },
        ],
      },
      images: [
        { src: '/gallery/newhorizons.png', caption: 'Pluton sfotografowany przez New Horizons, 2015' },
        { src: '/gallery/newhorizons2.png', caption: 'Arrokoth — kontaktowy obiekt Pasa Kuipera — New Horizons, 2019' },
      ],
    },
  },
  {
    id: 'voyager2',
    name: 'Voyager 2',
    color: '#34d399',
    size: 0.065,
    position: [-11.9, 0.7, 32.8],
    labelOffset: [0, -0.28, 0],
    isProbe: true,
    probeImagePath: '/sondy/voyager2.png',
    description:
      'Voyager 2 to jedyna sonda, która odwiedziła wszystkie cztery gazowe olbrzymy. W 2018 roku przekroczyła heliopauzę — granicę między wpływem Słońca a przestrzenią międzygwiezdną.',
    subtitle: 'Jedyna sonda odwiedzająca wszystkie gazowe olbrzymy.',
    fact: 'Voyager 2 odkrył 11 nowych księżyców Urana i 5 nowych księżycy Neptuna podczas jednej misji.',
    stats: [
      { label: 'Start', value: '20.08.1977' },
      { label: 'Dystans', value: '~136 AU' },
      { label: 'Prędkość', value: '15.4 km/s' },
    ],
    story: {
      discovery: [
        { year: '1977', event: 'Start Voyagera 2, 16 dni przed Voyagerem 1 — misja Grand Tour planet zewnętrznych.' },
        { year: '1979', event: 'Przelot obok Jowisza — odkrycie aktywnych wulkanów na Io i pierścieni planety.' },
        { year: '1981', event: 'Przelot obok Saturna — szczegółowe obrazy pierścieni i księżyców.' },
        { year: '1986', event: 'Przelot obok Urana — odkrycie 11 nowych księżyców, pomiar pola magnetycznego.' },
        { year: '1989', event: 'Przelot obok Neptuna — Wielka Ciemna Plama i gejzery azotowe na Trytonie.' },
        { year: '2018', event: 'Voyager 2 przekracza heliopauzę — wchodzi w przestrzeń międzygwiezdną.' },
        { year: '2026', event: 'Sygnał z sondy dociera do Ziemi po ~18,9 godziny. Zasilanie RTG stopniowo słabnie.' },
      ],
      habitability: {
        score: 0,
        label: 'Artefakt — nie dotyczy',
        factors: [
          { name: 'Typ', value: 'Sonda naukowa', rating: 'bad' },
          { name: 'Masa', value: '722 kg', rating: 'ok' },
          { name: 'Zasilanie', value: 'RTG plutonowy', rating: 'ok' },
          { name: 'Łączność', value: 'Deep Space Network', rating: 'ok' },
          { name: 'Instrumenty', value: 'PLS, MAG, PWS, UV', rating: 'ok' },
          { name: 'Misja', value: '1977 – czynna', rating: 'good' },
        ],
      },
      images: [
        { src: '/gallery/voyager2.png', caption: 'Neptun sfotografowany przez Voyagera 2, 1989' },
        { src: '/gallery/voyager2-2.png', caption: 'Tryton — księżyc Neptuna z gejzerami — Voyager 2, 1989' },
      ],
    },
  },
  {
    id: 'voyager1',
    name: 'Voyager 1',
    color: '#a78bfa',
    size: 0.065,
    position: [9.9, 1.2, 36.9],
    labelOffset: [0, -0.28, 0],
    isProbe: true,
    probeImagePath: '/sondy/voyager1.png',
    description:
      'Voyager 1 jest najdalej wysuniętym obiektem stworzonym przez człowieka. W 2012 roku jako pierwsza sonda weszła w przestrzeń międzygwiezdną, ponad 40 lat po starcie.',
    subtitle: 'Najdalszy obiekt stworzony przez człowieka.',
    fact: 'Sygnał radiowy z Voyagera 1 podróżuje do Ziemi przez ponad 22 godziny — z prędkością światła.',
    stats: [
      { label: 'Start', value: '05.09.1977' },
      { label: 'Dystans', value: '~163 AU' },
      { label: 'Prędkość', value: '17 km/s' },
    ],
    story: {
      discovery: [
        { year: '1977', event: 'Start Voyagera 1 — zaprojektowany głównie do badania Jowisza i Saturna.' },
        { year: '1979', event: 'Przelot obok Jowisza — pierwsze obrazy aktywnych wulkanów na Io.' },
        { year: '1980', event: 'Przelot obok Saturna — odkrycie złożonej struktury pierścieni Saturna i atmosfery Tytana.' },
        { year: '1990', event: 'Na prośbę Carla Sagana sonda obraca się i fotografuje „Pale Blue Dot" — Ziemię z 6 mld km.' },
        { year: '2012', event: 'Voyager 1 jako pierwszy obiekt ludzki przekracza heliopauzę — wchodzi w przestrzeń międzygwiezdną.' },
        { year: '2026', event: 'Sygnał z sondy dociera do Ziemi po ~22,6 godziny. Czynne instrumenty PLS i MAG.' },
      ],
      habitability: {
        score: 0,
        label: 'Artefakt — nie dotyczy',
        factors: [
          { name: 'Typ', value: 'Sonda naukowa', rating: 'bad' },
          { name: 'Masa', value: '722 kg', rating: 'ok' },
          { name: 'Zasilanie', value: 'RTG plutonowy', rating: 'ok' },
          { name: 'Łączność', value: 'Deep Space Network', rating: 'ok' },
          { name: 'Zlatyczna płyta', value: 'Golden Record', rating: 'good' },
          { name: 'Misja', value: '1977 – czynna', rating: 'good' },
        ],
      },
      images: [
        { src: '/gallery/voyager1.png', caption: '„Pale Blue Dot" — Ziemia sfotografowana przez Voyagera 1 z 6 mld km, 1990' },
        { src: '/gallery/voyager1-1.png', caption: 'Rodzinne zdjęcie Układu Słonecznego — Voyager 1, 1990' },
      ],
    },
  },
]

export const MOON_ORBIT_RADIUS = 0.65
export const ORBIT_PLANETS = PLANETS.filter(p => p.id !== 'moon')
export const MOON_PLANET_DATA = PLANETS.find(p => p.id === 'moon')!

export const PLANET_DISTANCE_KM: Partial<Record<PlanetId, number>> = {
  mercury: 57_900_000,
  earth: 149_600_000,
  moon: 149_984_400,
  mars: 227_900_000,
  jupiter: 778_500_000,
  saturn: 1_432_000_000,
  uranus: 2_867_000_000,
  neptune: 4_515_000_000,
  pluto: 5_906_000_000,
}

export function formatKm(km: number): string {
  if (km >= 1_000_000)
    return `${(km / 1_000_000).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} mln km`
  return `${(km / 1_000).toLocaleString('pl-PL', { maximumFractionDigits: 0 })} tys. km`
}
