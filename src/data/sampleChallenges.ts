import { ChallengeTemplate } from '../types';

export const SAMPLE_CHALLENGES: ChallengeTemplate[] = [
  {
    id: 'bridge-challenge',
    title: 'The Super Strong Bridge Challenge',
    grade: 'Grades 2–4',
    icon: '🌉',
    tagline: 'Design a bridge spanning 25 cm that holds at least 20 coins!',
    problem: 'Our toy cars and school supplies need to cross a 25 cm wide river canyon. We need to construct a lightweight bridge that stays sturdy without sagging in the middle.',
    targetUser: 'School toy cars and travelers crossing the classroom canyon',
    starterConstraints: [
      'Bridge must span at least 25 cm wide',
      'Can only use paper, cardboard strips, and craft sticks',
      'No tape on the table surface (free standing)',
      'Time limit: 45 minutes of building'
    ],
    starterCriteria: [
      'Must support 20 or more coins in the middle without collapsing',
      'Must stay standing for at least 15 seconds',
      'A toy car can roll smoothly from one side to the other'
    ],
    starterMaterials: [
      { name: 'Cardboard strips', quantity: '4 pieces' },
      { name: 'Craft sticks (popsicle sticks)', quantity: '15 sticks' },
      { name: 'Masking tape', quantity: '50 cm' },
      { name: 'Paper cups (for piers)', quantity: '2 cups' }
    ]
  },
  {
    id: 'wind-rover',
    title: 'Wind-Powered Land Rover',
    grade: 'Grades 3–5',
    icon: '🚗',
    tagline: 'Build a wheeled vehicle powered only by wind energy from a fan!',
    problem: 'An explorer robot must travel across a windy desert on Mars without fuel or batteries, using only wind trapped by a sail.',
    targetUser: 'Mars exploration team in windy canyon territory',
    starterConstraints: [
      'Must have 3 or 4 rolling wheels',
      'No batteries, motors, or pushing with hands allowed',
      'Maximum width: 20 cm, Maximum length: 25 cm'
    ],
    starterCriteria: [
      'Travels at least 1.5 meters when blown by a desktop fan',
      'Rolls in a straight line without flipping over',
      'Stops safely without wheels falling off'
    ],
    starterMaterials: [
      { name: 'Cardboard chassis base', quantity: '1 piece (15x10 cm)' },
      { name: 'Plastic bottle caps (wheels)', quantity: '4 caps' },
      { name: 'Wooden skewers (axles)', quantity: '2 skewers' },
      { name: 'Plastic drinking straws', quantity: '2 straws' },
      { name: 'Paper or craft foam (sail)', quantity: '1 sheet' }
    ]
  },
  {
    id: 'earthquake-tower',
    title: 'Earthquake-Safe Tall Tower',
    grade: 'Grades 3–5',
    icon: '🏢',
    tagline: 'Construct a tower at least 35 cm tall that survives 10 seconds of shaking!',
    problem: 'People living in earthquake zones need tall buildings that do not crack or tumble when the ground shakes vigorously beneath them.',
    targetUser: 'Residents in earthquake-prone city centers',
    starterConstraints: [
      'Must be at least 35 cm tall',
      'Base footprint cannot be wider than 15 cm x 15 cm',
      'Must be built only from dry spaghetti/straws and tape or clay'
    ],
    starterCriteria: [
      'Must survive 10 seconds of shake table vibration',
      'Must remain upright without leaning more than 15 degrees',
      'Can support a ping pong ball safely at the top floor'
    ],
    starterMaterials: [
      { name: 'Straws or dry spaghetti', quantity: '30 pieces' },
      { name: 'Clay or mini marshmallows', quantity: '20 connectors' },
      { name: 'Masking tape', quantity: '1 roll' },
      { name: 'Cardboard base plate', quantity: '1 square (15x15 cm)' }
    ]
  },
  {
    id: 'egg-lander',
    title: 'Lunar Egg Drop Lander',
    grade: 'Grades 2–5',
    icon: '🚀',
    tagline: 'Create a capsule that keeps an egg safe when dropped from 2 meters!',
    problem: 'Astronauts need a soft-landing space capsule that absorbs impact energy so fragile scientific cargo does not break when landing on rocky terrain.',
    targetUser: 'Space agency scientists returning precious moon crystals',
    starterConstraints: [
      'Total capsule weight must be under 150 grams',
      'Must fit inside a standard shoebox before launch',
      'No bubble wrap longer than 30 cm'
    ],
    starterCriteria: [
      'Egg (or cargo test sphere) remains completely intact after 2m drop',
      'Lander stays upright on its landing pads upon touchdown',
      'Egg can be easily placed inside and retrieved within 30 seconds'
    ],
    starterMaterials: [
      { name: 'Paper cups', quantity: '2 cups' },
      { name: 'Rubber bands', quantity: '6 bands' },
      { name: 'Cotton balls', quantity: '10 balls' },
      { name: 'String or yarn', quantity: '1 meter' },
      { name: 'Plastic bag or coffee filter (parachute)', quantity: '1 piece' }
    ]
  },
  {
    id: 'custom-challenge',
    title: 'Design Your Own Invention!',
    grade: 'All Grades',
    icon: '💡',
    tagline: 'Choose your own problem, set your criteria, and invent something new!',
    problem: '',
    targetUser: '',
    starterConstraints: [],
    starterCriteria: [],
    starterMaterials: []
  }
];
