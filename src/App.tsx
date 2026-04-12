import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls, useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import * as THREE from 'three'

type PlanetId = 'sun' | 'mercury' | 'earth' | 'moon' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto'

type HabitabilityRating = 'good' | 'ok' | 'bad'

type PlanetStory = {
  discovery: { year: string; event: string }[]
  habitability: {
    score: number
    label: string
    factors: { name: string; value: string; rating: HabitabilityRating }[]
  }
  images: { src: string; caption: string }[]
}

type PlanetData = {
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
  description: string
  subtitle: string
  fact: string
  stats: { label: string; value: string }[]
  story: PlanetStory
}

const PLANETS: PlanetData[] = [
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
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/800px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg', caption: 'Słońce w ultrafioletowym obrazowaniu — NASA SDO, 2010' },
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Parker_Solar_Probe_spacecraft.jpg/800px-Parker_Solar_Probe_spacecraft.jpg', caption: 'Parker Solar Probe — sonda badająca Słońce z rekordowej odległości' },
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
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/800px-Mercury_in_true_color.jpg', caption: 'Merkury w prawdziwych kolorach — MESSENGER, 2008' },
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/800px-Mercury_in_color_-_Prockter07-edit1.jpg', caption: 'Fałszywe kolory ukazujące różnice składu powierzchni — MESSENGER' },
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
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/800px-The_Earth_seen_from_Apollo_17.jpg', caption: 'Blue Marble — Apollo 17, 1972' },
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Africa_and_Europe_from_a_Million_Miles_Away.png/800px-Africa_and_Europe_from_a_Million_Miles_Away.png', caption: 'Ziemia z odległości 1.5 mln km — DSCOVR, 2015' },
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
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/800px-FullMoon2010.jpg', caption: 'Pełnia Księżyca — Gregorius, 2010' },
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Aldrin_Apollo_11_original.jpg/800px-Aldrin_Apollo_11_original.jpg', caption: 'Buzz Aldrin na powierzchni Księżyca — Apollo 11, 1969' },
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
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/800px-OSIRIS_Mars_true_color.jpg', caption: 'Mars w prawdziwych kolorach — sonda Rosetta' },
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Olympus_Mons_alt.jpg/800px-Olympus_Mons_alt.jpg', caption: 'Olympus Mons — największy wulkan w Układzie Słonecznym' },
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
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/800px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg', caption: 'Jowisz i Wielka Czerwona Plama — Hubble, 2014' },
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Europa-moon-with-margins.jpg/800px-Europa-moon-with-margins.jpg', caption: 'Europa — lodowy księżyc z oceanem pod powierzchnią — Galileo, 1996' },
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
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/800px-Saturn_during_Equinox.jpg', caption: 'Saturn podczas równonocy — Cassini, 2009' },
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Enceladus_geysers_revised.jpg/800px-Enceladus_geysers_revised.jpg', caption: 'Gejzery wodne na Enceladusie — Cassini, 2006' },
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
        { src: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg', caption: 'Uran w barwach naturalnych — Voyager 2, 1986' },
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Uranus_rings_and_moons.jpg/800px-Uranus_rings_and_moons.jpg', caption: 'Pierścienie i księżyce Urana — Hubble, 2004' },
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
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/800px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg', caption: 'Neptun z Wielką Ciemną Plamą — Voyager 2, 1989' },
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Triton_moon_mosaic_Voyager_2_%2829347980650%29.jpg/800px-Triton_moon_mosaic_Voyager_2_%2829347980650%29.jpg', caption: 'Tryton — największy księżyc Neptuna z gejzerami azotowymi — Voyager 2, 1989' },
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
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pluto_in_True_Color_-_High-Res.jpg/800px-Pluto_in_True_Color_-_High-Res.jpg', caption: 'Pluton w prawdziwych kolorach z sercem Tombaugh Regio — New Horizons, 2015' },
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Charon_-_July_13_2015.jpg/800px-Charon_-_July_13_2015.jpg', caption: 'Charon — największy księżyc Plutona — New Horizons, 2015' },
      ],
    },
  },
]

const MOON_ORBIT_RADIUS = 0.65

// Real average distances from the Sun in kilometres
const PLANET_DISTANCE_KM: Partial<Record<PlanetId, number>> = {
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

function formatKm(km: number): string {
  if (km >= 1_000_000)
    return `${(km / 1_000_000).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} mln km`
  if (km >= 1_000)
    return `${(km / 1_000).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} tys. km`
  return `${km.toLocaleString('pl-PL')} km`
}

export default function App() {
  const [activePlanetId, setActivePlanetId] = useState<PlanetId | null>(null)
  const [storyPlanetId, setStoryPlanetId] = useState<PlanetId | null>(null)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio('/ambient/loop.mp3.mp3')
    audio.loop = true
    audio.volume = 0.07
    audioRef.current = audio
    const play = () => { audio.play().catch(() => {}) }
    audio.play().catch(() => {
      document.addEventListener('click', play, { once: true })
    })
    return () => {
      audio.pause()
      document.removeEventListener('click', play)
    }
  }, [])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      audio.play().catch(() => {})
      setMuted(false)
    } else {
      audio.pause()
      setMuted(true)
    }
  }

  const activePlanet =
    PLANETS.find((planet) => planet.id === activePlanetId) ?? null
  const storyPlanet =
    PLANETS.find((planet) => planet.id === storyPlanetId) ?? null

  return (
    <div className="min-h-screen bg-[#02050b] text-white">
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(1,3,8,0.76),rgba(4,8,18,0.78),rgba(2,5,11,0.96))]" />
      </div>

      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute left-6 top-6 z-10">
          <p className="text-xs uppercase tracking-[0.45em] text-white/55">
            Solar System 3D
          </p>
        </div>



        <Canvas
          style={{ width: '100%', height: '100%' }}
          camera={{ position: [0, 10, 16], fov: 45 }}
        >
          <Scene activePlanetId={activePlanetId} onPlanetClick={setActivePlanetId} hideLabels={storyPlanetId !== null} />
        </Canvas>

        {/* Mute / unmute button — bottom-left */}
        <button
          onClick={toggleMute}
          title={muted ? 'Włącz muzykę' : 'Wycisz muzykę'}
          className="absolute bottom-6 left-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/60 backdrop-blur-md transition hover:border-white/35 hover:text-white/90"
        >
          {muted ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>

        <AnimatePresence>
          {activePlanet && (
            <motion.aside
              key={activePlanet.id}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 220 }}
              className="absolute right-0 top-0 z-10 h-full w-full max-w-xs overflow-y-auto border-l border-white/10 bg-black/70 backdrop-blur-2xl sm:max-w-sm"
            >
              <div className="flex flex-col gap-5 px-6 pb-10 pt-8">
                {/* Header row: back button + label */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActivePlanetId(null)}
                    className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.35em] text-white/45 transition-colors hover:text-white/90"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Powrót
                  </button>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
                    Aktywna planeta
                  </p>
                </div>

                <div>
                  <h2 className="font-orbitron text-3xl font-bold uppercase tracking-[0.06em]">
                    {activePlanet.name}
                  </h2>
                  <p className="mt-2 text-sm text-white/65">
                    {activePlanet.subtitle}
                  </p>
                </div>

                <PlanetPreview planet={activePlanet} />

                <p className="text-sm leading-7 text-white/60">
                  {activePlanet.description}
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {activePlanet.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                    >
                      <p className="text-[9px] uppercase tracking-[0.3em] text-white/38">
                        {stat.label}
                      </p>
                      <p className="mt-1.5 text-sm font-medium text-white/90">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-white/38">
                    Ciekawostka
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {activePlanet.fact}
                  </p>
                </div>

                <button
                  onClick={() => setStoryPlanetId(activePlanet.id)}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/6 py-3 text-sm font-medium tracking-[0.06em] text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  Odkryj historię →
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {storyPlanet && (
            <PlanetStoryOverlay
              planet={storyPlanet}
              onClose={() => setStoryPlanetId(null)}
            />
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}

function Scene({
  activePlanetId,
  onPlanetClick,
  hideLabels,
}: {
  activePlanetId: PlanetId | null
  onPlanetClick: (id: PlanetId) => void
  hideLabels: boolean
}) {
  const orbitControlsRef = useRef<any>(null)
  const planetPositionsRef = useRef<Record<string, THREE.Vector3>>({})

  return (
    <>
      <color attach="background" args={['#02050b']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={35} color="#f59e0b" />
      <directionalLight position={[8, 6, 8]} intensity={1.3} />
      <MilkyWayBackground />
      <ParallaxStars />
      <SunGlow />
      <SolarSystemScene
        activePlanetId={activePlanetId}
        onPlanetClick={onPlanetClick}
        planetPositionsRef={planetPositionsRef}
        hideLabels={hideLabels}
      />
      <PlanetDistanceLine
        activePlanetId={activePlanetId}
        planetPositionsRef={planetPositionsRef}
      />
      <CameraController
        activePlanetId={activePlanetId}
        orbitControlsRef={orbitControlsRef}
        planetPositionsRef={planetPositionsRef}
      />
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={0.3}
        maxDistance={55}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        rotateSpeed={0.45}
      />
    </>
  )
}

function CameraController({
  activePlanetId,
  orbitControlsRef,
  planetPositionsRef,
}: {
  activePlanetId: PlanetId | null
  orbitControlsRef: { current: any }
  planetPositionsRef: { current: Record<string, THREE.Vector3> }
}) {
  useThree()
  const lerpedTarget = useRef(new THREE.Vector3())
  const prevPlanetId = useRef<PlanetId | null>(null)
  const zeroVec = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    const controls = orbitControlsRef.current
    if (!controls) return

    const activePlanetPos = activePlanetId
      ? planetPositionsRef.current[activePlanetId]
      : undefined
    const desiredTarget = activePlanetPos ?? zeroVec.current

    if (activePlanetId !== prevPlanetId.current) {
      prevPlanetId.current = activePlanetId
      lerpedTarget.current.copy(controls.target)
    }

    lerpedTarget.current.lerp(desiredTarget, 0.07)
    controls.target.copy(lerpedTarget.current)
    controls.update()
  })

  return null
}

// ─── Planet Distance Line ───────────────────────────────────────────────────

function PlanetDistanceLine({
  activePlanetId,
  planetPositionsRef,
}: {
  activePlanetId: PlanetId | null
  planetPositionsRef: { current: Record<string, THREE.Vector3> }
}) {
  const midGroupRef = useRef<THREE.Group>(null)
  const posBuffer = useMemo(() => new Float32Array(6), [])

  const planetForLine =
    activePlanetId && activePlanetId !== 'sun'
      ? PLANETS.find((p) => p.id === activePlanetId) ?? null
      : null

  const lineObj = useMemo(() => {
    if (!planetForLine) return null
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posBuffer, 3))
    const mat = new THREE.LineDashedMaterial({
      color: planetForLine.color,
      dashSize: 0.22,
      gapSize: 0.1,
      opacity: 0.65,
      transparent: true,
    })
    return new THREE.Line(geo, mat)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planetForLine?.id])

  useFrame(() => {
    if (!activePlanetId || activePlanetId === 'sun' || !lineObj) return
    const pos = planetPositionsRef.current[activePlanetId]
    if (!pos || !midGroupRef.current) return
    posBuffer[3] = pos.x
    posBuffer[4] = pos.y
    posBuffer[5] = pos.z
    ;(lineObj.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
    lineObj.computeLineDistances()
    midGroupRef.current.position.set(pos.x * 0.5, pos.y * 0.5 + 0.18, pos.z * 0.5)
  })

  if (!activePlanetId || activePlanetId === 'sun' || !planetForLine || !lineObj) return null

  const km = PLANET_DISTANCE_KM[activePlanetId]

  return (
    <group>
      <primitive object={lineObj} />
      {km && (
        <group ref={midGroupRef}>
          <Html center distanceFactor={10} zIndexRange={[0, 10]}>
            <div
              style={{
                background: 'rgba(2,5,11,0.82)',
                border: `1px solid ${planetForLine.color}55`,
                borderRadius: 8,
                padding: '4px 10px',
                color: '#fff',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                fontSize: 12,
                lineHeight: 1.5,
                backdropFilter: 'blur(6px)',
                boxShadow: `0 0 10px ${planetForLine.color}33`,
              }}
            >
              <span style={{ color: planetForLine.color, fontWeight: 700 }}>{formatKm(km)}</span>
              <br />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>od Słońca</span>
            </div>
          </Html>
        </group>
      )}
    </group>
  )
}

// ─── Sci-Fi Orbit Ring ────────────────────────────────────────────────────

const ORBIT_VERT = `
  attribute float aAngle;
  uniform float time;
  uniform float pulseSpeed;
  varying float vAlpha;
  #define PI2 6.2831853
  void main() {
    float n = aAngle / PI2;
    float t = mod(n - time * pulseSpeed, 1.0);
    float pulse = exp(-t * t * 22.0) * 2.1;
    float dash = step(0.38, fract(n * 32.0));
    vAlpha = 0.11 * dash + pulse * 0.78;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const ORBIT_FRAG = `
  uniform vec3 orbitColor;
  varying float vAlpha;
  void main() {
    vec3 c = mix(orbitColor, vec3(0.55, 0.88, 1.0), 0.28);
    gl_FragColor = vec4(c, clamp(vAlpha, 0.0, 1.0));
  }
`

function SciFiOrbitRing({
  radius,
  color,
  pulseSpeed = 0.07,
}: {
  radius: number
  color: string
  pulseSpeed?: number
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const N = 512

  const { positions, angles } = useMemo(() => {
    const pos = new Float32Array(N * 3)
    const ang = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2
      pos[i * 3] = Math.cos(a) * radius
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = Math.sin(a) * radius
      ang[i] = a
    }
    return { positions: pos, angles: ang }
  }, [radius])

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      orbitColor: { value: new THREE.Color(color) },
      pulseSpeed: { value: pulseSpeed },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.time.value = clock.getElapsedTime()
  })

  return (
    <lineLoop>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aAngle" args={[angles, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={ORBIT_VERT}
        fragmentShader={ORBIT_FRAG}
        transparent
        depthWrite={false}
      />
    </lineLoop>
  )
}

// ─── Solar System Scene ───────────────────────────────────────────────────

type SolarSystemSceneProps = {
  activePlanetId: PlanetId | null
  onPlanetClick: (id: PlanetId) => void
  planetPositionsRef: { current: Record<string, THREE.Vector3> }
  hideLabels: boolean
}

function SolarSystemScene({
  activePlanetId,
  onPlanetClick,
  planetPositionsRef,
  hideLabels,
}: SolarSystemSceneProps) {
  const moonData = PLANETS.find((p) => p.id === 'moon')!

  return (
    <group rotation={[0, 0, 0]}>
      {PLANETS.filter((p) => p.orbitRadius && p.id !== 'moon').map((planet) => (
        <SciFiOrbitRing
          key={planet.id}
          radius={planet.orbitRadius!}
          color={planet.color}
          pulseSpeed={(planet.orbitSpeed ?? 0.05) * 0.48}
        />
      ))}

      {PLANETS.filter((p) => p.id !== 'moon').map((planet) => (
        <AnimatedPlanet
          key={planet.id}
          planet={planet}
          isActive={activePlanetId === planet.id}
          onClick={() => onPlanetClick(planet.id)}
          planetPositionsRef={planetPositionsRef}
          hideLabel={hideLabels}
        >
          {planet.id === 'earth' && (
            <>
              <SciFiOrbitRing
                radius={MOON_ORBIT_RADIUS}
                color="#c8c8d8"
                pulseSpeed={0.14}
              />
              <AnimatedMoon
                moon={moonData}
                isActive={activePlanetId === 'moon'}
                onClick={() => onPlanetClick('moon')}
                planetPositionsRef={planetPositionsRef}
                hideLabel={hideLabels}
              />
            </>
          )}
          {planet.id === 'saturn' && (
            <SaturnRing planetSize={planet.size} />
          )}
        </AnimatedPlanet>
      ))}
    </group>
  )
}

type AnimatedPlanetProps = {
  planet: PlanetData
  isActive: boolean
  onClick: () => void
  children?: ReactNode
  planetPositionsRef: { current: Record<string, THREE.Vector3> }
  hideLabel: boolean
}

function AnimatedPlanet({ planet, isActive, onClick, children, planetPositionsRef, hideLabel }: AnimatedPlanetProps) {
  const color = new THREE.Color(planet.color)
  const orbitRef = useRef<THREE.Group>(null)
  const selfRef = useRef<THREE.Group>(null)
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    if (planet.orbitRadius && planet.orbitSpeed && orbitRef.current) {
      angleRef.current += delta * planet.orbitSpeed
      orbitRef.current.position.x = Math.cos(angleRef.current) * planet.orbitRadius
      orbitRef.current.position.z = Math.sin(angleRef.current) * planet.orbitRadius
    }
    if (selfRef.current && planet.rotationSpeed) {
      selfRef.current.rotation.y += delta * planet.rotationSpeed
    }
    if (orbitRef.current) {
      if (!planetPositionsRef.current[planet.id]) {
        planetPositionsRef.current[planet.id] = new THREE.Vector3()
      }
      orbitRef.current.getWorldPosition(planetPositionsRef.current[planet.id])
    }
  })

  const initPos: [number, number, number] = planet.orbitRadius
    ? [planet.orbitRadius, 0, 0]
    : planet.position

  return (
    <group ref={orbitRef} position={initPos}>
      <group ref={selfRef}>
        {planet.texturePath ? (
          planet.id === 'earth' ? (
            <EarthDayNightSphere
              size={planet.size}
              isActive={isActive}
              onClick={onClick}
            />
          ) : (
            <TexturedSphere
              texturePath={planet.texturePath}
              size={planet.size}
              isSun={planet.id === 'sun'}
              planetColor={color}
              isActive={isActive}
              onClick={onClick}
            />
          )
        ) : planet.gradientColors ? (
          <GradientSphere
            size={planet.size}
            gradientColors={planet.gradientColors}
            color={color}
            isActive={isActive}
            onClick={onClick}
          />
        ) : (
          <PlanetInteractive size={planet.size} color={color} isActive={isActive} onClick={onClick}>
            <mesh>
              <sphereGeometry args={[planet.size, 64, 64]} />
              <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
            </mesh>
          </PlanetInteractive>
        )}
      </group>
      <Html position={planet.labelOffset} center distanceFactor={10}>
        {!hideLabel && (
          <div className="font-orbitron select-none whitespace-nowrap text-[10px] uppercase tracking-[0.15em] text-white/75 md:text-xs">
            {planet.name}
          </div>
        )}
      </Html>
      {children}
    </group>
  )
}

type AnimatedMoonProps = {
  moon: PlanetData
  isActive: boolean
  onClick: () => void
  planetPositionsRef: { current: Record<string, THREE.Vector3> }
  hideLabel: boolean
}

function AnimatedMoon({ moon, isActive, onClick, planetPositionsRef, hideLabel }: AnimatedMoonProps) {
  const color = new THREE.Color(moon.color)
  const groupRef = useRef<THREE.Group>(null)
  const selfRef = useRef<THREE.Group>(null)
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    if (groupRef.current) {
      angleRef.current += delta * 0.42
      groupRef.current.position.x = Math.cos(angleRef.current) * MOON_ORBIT_RADIUS
      groupRef.current.position.z = Math.sin(angleRef.current) * MOON_ORBIT_RADIUS
    }
    if (selfRef.current) {
      selfRef.current.rotation.y += delta * 0.025
    }
    if (groupRef.current) {
      if (!planetPositionsRef.current['moon']) {
        planetPositionsRef.current['moon'] = new THREE.Vector3()
      }
      groupRef.current.getWorldPosition(planetPositionsRef.current['moon'])
    }
  })

  return (
    <group ref={groupRef} position={[MOON_ORBIT_RADIUS, 0, 0]}>
      <group ref={selfRef}>
        {moon.texturePath ? (
          <TexturedSphere
            texturePath={moon.texturePath}
            size={moon.size}
            isSun={false}
            planetColor={color}
            isActive={isActive}
            onClick={onClick}
          />
        ) : (
          <PlanetInteractive size={moon.size} color={color} isActive={isActive} onClick={onClick}>
            <mesh>
              <sphereGeometry args={[moon.size, 32, 32]} />
              <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
            </mesh>
          </PlanetInteractive>
        )}
      </group>
      <Html position={moon.labelOffset} center distanceFactor={10}>
        {!hideLabel && (
          <div className="font-orbitron select-none whitespace-nowrap text-[10px] uppercase tracking-[0.15em] text-white/75 md:text-xs">
            {moon.name}
          </div>
        )}
      </Html>
    </group>
  )
}

// ─── Planet Interactive Hover Wrapper ───────────────────────────────────────────────────

function PlanetInteractive({
  size,
  color,
  isActive,
  noGlow = false,
  onClick,
  children,
}: {
  size: number
  color: THREE.Color
  isActive: boolean
  noGlow?: boolean
  onClick: () => void
  children: ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-14 * delta)
    if (groupRef.current) {
      const target = isActive ? 1.12 : hovered ? 1.07 : 1
      const curr = groupRef.current.scale.x
      groupRef.current.scale.setScalar(curr + (target - curr) * k)
    }
    if (glowMatRef.current) {
      const targetOpacity = hovered && !isActive ? 0.13 : 0
      glowMatRef.current.opacity += (targetOpacity - glowMatRef.current.opacity) * k
    }
  })

  return (
    <group
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
    >
      {children}
      {!noGlow && (
        <mesh scale={1.38}>
          <sphereGeometry args={[size, 24, 24]} />
          <meshBasicMaterial
            ref={glowMatRef}
            color={color}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  )
}

type TexturedSphereProps = {
  texturePath: string
  size: number
  isSun: boolean
  planetColor: THREE.Color
  isActive: boolean
  onClick: () => void
}

function TexturedSphere({
  texturePath,
  size,
  isSun,
  planetColor,
  isActive,
  onClick,
}: TexturedSphereProps) {
  const texture = useTexture(texturePath)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  return (
    <PlanetInteractive size={size} color={planetColor} isActive={isActive} noGlow={isSun} onClick={onClick}>
      <mesh>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissive={isSun ? planetColor : new THREE.Color('#000000')}
          emissiveMap={isSun ? texture : undefined}
          emissiveIntensity={isSun ? 1.5 : 0}
          roughness={isSun ? 0.4 : 0.85}
          metalness={0.02}
        />
      </mesh>
    </PlanetInteractive>
  )
}

function EarthDayNightSphere({
  size,
  isActive,
  onClick,
}: {
  size: number
  isActive: boolean
  onClick: () => void
}) {
  const dayTex = useTexture('/textures/earth.png')
  const nightTex = useTexture(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/The_earth_at_night.jpg/1280px-The_earth_at_night.jpg',
  )
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)

  dayTex.colorSpace = THREE.SRGBColorSpace
  nightTex.colorSpace = THREE.SRGBColorSpace
  dayTex.wrapS = dayTex.wrapT = THREE.RepeatWrapping
  nightTex.wrapS = nightTex.wrapT = THREE.RepeatWrapping

  const uniforms = useMemo(
    () => ({
      dayMap: { value: dayTex },
      nightMap: { value: nightTex },
      sunDir: { value: new THREE.Vector3(1, 0, 0) },
    }),
    [dayTex, nightTex],
  )

  useFrame(() => {
    if (!meshRef.current || !matRef.current) return
    const earthPos = new THREE.Vector3()
    meshRef.current.getWorldPosition(earthPos)
    matRef.current.uniforms.sunDir.value
      .copy(earthPos)
      .negate()
      .normalize()
  })

  return (
    <PlanetInteractive size={size} color={new THREE.Color('#3b82f6')} isActive={isActive} onClick={onClick}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vWorldNormal;
          void main() {
            vUv = uv;
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D dayMap;
          uniform sampler2D nightMap;
          uniform vec3 sunDir;
          varying vec2 vUv;
          varying vec3 vWorldNormal;
          void main() {
            float d = dot(vWorldNormal, sunDir);
            float blend = smoothstep(-0.18, 0.28, d);
            vec4 day = texture2D(dayMap, vUv);
            vec4 night = texture2D(nightMap, vUv);
            vec4 nightLit = vec4(night.rgb * 1.3, night.a);
            gl_FragColor = mix(nightLit, day, blend);
          }
        `}
      />
      </mesh>
    </PlanetInteractive>
  )
}

function GradientSphere({
  size,
  gradientColors,
  color,
  isActive,
  onClick,
}: {
  size: number
  gradientColors: string[]
  color: THREE.Color
  isActive: boolean
  onClick: () => void
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, 0, 256)
    gradientColors.forEach((c, i) => {
      grad.addColorStop(i / (gradientColors.length - 1), c)
    })
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 256)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradientColors.join(',')])

  return (
    <PlanetInteractive size={size} color={color} isActive={isActive} onClick={onClick}>
      <mesh>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.8} metalness={0.02} />
      </mesh>
    </PlanetInteractive>
  )
}

function SaturnRing({ planetSize }: { planetSize: number }) {
  const texture = useTexture('/textures/saturn-ring.png')
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping

  const innerR = planetSize * 1.28
  const outerR = planetSize * 2.4

  return (
    <mesh rotation={[-Math.PI / 2 + 0.44, 0, 0.22]}>
      <ringGeometry args={[innerR, outerR, 128, 4]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
        transparent
        opacity={0.92}
        depthWrite={false}
      />
    </mesh>
  )
}

function MilkyWayBackground() {
  const texture = useTexture('/textures/milkyway.png')
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = true
  texture.anisotropy = 16
  texture.needsUpdate = true
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.position.copy(camera.position)
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[190, 128, 128]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}

function ParallaxStars() {
  const groupRef = useRef<THREE.Group>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(1500 * 3)
    for (let i = 0; i < 1500; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 50 + Math.random() * 35
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.006
      groupRef.current.rotation.x += delta * 0.002
    }
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          sizeAttenuation
          transparent
          opacity={0.7}
          color="#fff8e8"
          depthWrite={false}
        />
      </points>
    </group>
  )
}

function SunGlow() {
  const spriteRef = useRef<THREE.Sprite>(null)

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0,    'rgba(255, 240, 140, 0.95)')
    g.addColorStop(0.12, 'rgba(255, 190, 60, 0.6)')
    g.addColorStop(0.35, 'rgba(255, 130, 20, 0.18)')
    g.addColorStop(0.65, 'rgba(255, 90, 0, 0.05)')
    g.addColorStop(1,    'rgba(0, 0, 0, 0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame(({ clock }) => {
    if (spriteRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 0.65) * 0.055
      spriteRef.current.scale.setScalar(8.5 * pulse)
    }
  })

  return (
    <sprite ref={spriteRef} scale={[8.5, 8.5, 8.5]}>
      <spriteMaterial
        map={texture}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </sprite>
  )
}

function PlanetPreviewSphere({ planet }: { planet: PlanetData }) {
  if (planet.texturePath) return <TexturedPreviewSphere planet={planet} />
  return <GradientPreviewSphere planet={planet} />
}

function TexturedPreviewSphere({ planet }: { planet: PlanetData }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const color = new THREE.Color(planet.color)
  const texture = useTexture(planet.texturePath!)
  texture.colorSpace = THREE.SRGBColorSpace

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        emissive={planet.id === 'sun' ? color : new THREE.Color('#000000')}
        emissiveMap={planet.id === 'sun' ? texture : undefined}
        emissiveIntensity={planet.id === 'sun' ? 1.2 : 0}
        roughness={planet.id === 'sun' ? 0.4 : 0.85}
        metalness={0.02}
      />
    </mesh>
  )
}

function GradientPreviewSphere({ planet }: { planet: PlanetData }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useMemo(() => {
    const colors = planet.gradientColors ?? [planet.color, planet.color]
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, 0, 256)
    colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c))
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 256)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planet.id])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={0.85} metalness={0.02} />
    </mesh>
  )
}

function PlanetPreview({ planet }: { planet: PlanetData }) {
  const size = planet.id === 'sun' ? 140 : 120

  return (
    <div
      className="self-start overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 40px ${planet.color}55`,
      }}
    >
      <Canvas
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 2.6], fov: 45 }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={20} color="#ffffff" />
        {planet.id === 'sun' && (
          <pointLight position={[0, 0, 0]} intensity={10} color="#f59e0b" />
        )}
        <PlanetPreviewSphere planet={planet} />
      </Canvas>
    </div>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <p className="text-[10px] uppercase tracking-[0.45em] text-white/35">{label}</p>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  )
}

const RATING_CLASS: Record<HabitabilityRating, string> = {
  good: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  ok: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  bad: 'text-red-400 border-red-500/30 bg-red-500/10',
}

function PlanetStoryOverlay({
  planet,
  onClose,
}: {
  planet: PlanetData
  onClose: () => void
}) {
  return (
    <motion.div
      key={planet.id + '-story'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#02050b]/95 backdrop-blur-xl"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed right-5 top-5 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/6 text-white/60 transition hover:bg-white/10 hover:text-white"
      >
        ✕
      </button>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-4 pt-20 text-center"
      >
        <div
          className="mb-6 overflow-hidden rounded-full"
          style={{
            width: 160,
            height: 160,
            boxShadow: `0 0 80px ${planet.color}44`,
          }}
        >
          <Canvas
            style={{ width: '100%', height: '100%' }}
            camera={{ position: [0, 0, 2.6], fov: 45 }}
            gl={{ alpha: true }}
          >
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={20} />
            {planet.id === 'sun' && (
              <pointLight position={[0, 0, 0]} intensity={10} color="#f59e0b" />
            )}
            <PlanetPreviewSphere planet={planet} />
          </Canvas>
        </div>
        <p className="text-[10px] uppercase tracking-[0.45em] text-white/35">
          Historia i parametry
        </p>
        <h1 className="font-orbitron mt-2 text-4xl font-bold uppercase tracking-[0.06em]">
          {planet.name}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-white/55">
          {planet.subtitle}
        </p>
      </motion.div>

      <div className="mx-auto max-w-3xl space-y-16 px-6 pb-24 pt-10">

        {/* Discovery timeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionHeader label="Historia odkrycia" />
          <div className="mt-6">
            {planet.story.discovery.map((item, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: planet.color }}
                  />
                  {i < planet.story.discovery.length - 1 && (
                    <div className="w-px flex-1 bg-white/10" />
                  )}
                </div>
                <div className="pb-8">
                  <p
                    className="text-[11px] font-medium uppercase tracking-[0.3em]"
                    style={{ color: planet.color }}
                  >
                    {item.year}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/65">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Habitability */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionHeader label="Możliwość zamieszkania" />
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                  Indeks zamieszkiwalności
                </p>
                <p className="mt-1 text-5xl font-semibold tabular-nums">
                  {planet.story.habitability.score}
                  <span className="ml-1 text-2xl text-white/35">/ 100</span>
                </p>
                <p className="mt-1 text-sm text-white/55">
                  {planet.story.habitability.label}
                </p>
              </div>
              <div className="relative h-4 w-44 overflow-hidden rounded-full bg-white/6">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${planet.color}88, ${planet.color})`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${planet.story.habitability.score}%` }}
                  transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {planet.story.habitability.factors.map((f) => (
                <div
                  key={f.name}
                  className={`rounded-xl border p-3 ${RATING_CLASS[f.rating]}`}
                >
                  <p className="text-[9px] uppercase tracking-[0.28em] opacity-60">
                    {f.name}
                  </p>
                  <p className="mt-1 text-xs font-medium">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Gallery */}
        {planet.story.images.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SectionHeader label="Galeria" />
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {planet.story.images.map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-white/10"
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="h-52 w-full object-cover"
                  />
                  <p className="px-4 py-2.5 text-[11px] text-white/40">
                    {img.caption}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

      </div>
    </motion.div>
  )
}