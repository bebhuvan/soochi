/**
 * Add Samagata Foundation project partners to Soochi
 * node scripts/generate-samagata.mjs [--dry]
 */

import { writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const entriesDir = resolve(__dirname, '..', 'src', 'content', 'entries')
const dryRun = process.argv.includes('--dry')

const q = (s) => JSON.stringify(s)
const list = (a) => `[${a.map(q).join(', ')}]`
const slugify = n => n.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/['']/g,'').replace(/[\/\.]/g,'-').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)

function make(e) {
  const L = ['---']
  L.push(`name: ${q(e.name)}`, `url: ${q(e.url)}`, `blurb: ${q(e.blurb)}`, `kind: ${e.kind}`)
  if (e.orgType) L.push(`orgType: ${e.orgType}`)
  L.push(`topics: ${list(e.topics)}`, `geography: ${list(e.geography)}`)
  if (e.licensing) L.push(`licensing: ${e.licensing}`)
  if (e.access) L.push(`access: ${e.access}`)
  if (e.links?.length) { L.push('links:'); for (const l of e.links) L.push(`  - label: ${q(l.label)}`, `    url: ${q(l.url)}`) }
  L.push(`added: "2026-08-07"`, 'status: live', '---')
  if (e.note) L.push('', e.note, '')
  return L.join('\n')
}

const entries = [
  {
    name: "Bharat Digital",
    url: "https://www.bharatdigital.io/",
    blurb: "Cultivating public technologists who bring design, UX, and systems thinking to technology inside government, through the Build for Bharat Fellowship",
    kind: "organisation",
    orgType: "nonprofit",
    topics: ["technology", "governance"],
    geography: ["india"],
    note: "Bharat Digital aims to define an archetype of a 'public technologist' — someone who instills citizen-centricity, design, and systems thinking when building technology inside government. Its flagship Build for Bharat Fellowship is a six-month programme training early-career technologists in applying technical expertise, design, and UX toward the public good within government systems. Backed by Samagata Foundation."
  },
  {
    name: "Aikyam Fund",
    url: "https://aikyamhq.com/",
    blurb: "Strengthening early-stage social impact organisations by making fundraising, team-building, and capacity development more accessible to changemakers",
    kind: "organisation",
    orgType: "nonprofit",
    topics: ["philanthropy", "governance"],
    geography: ["india"],
    note: "Aikyam works with early-stage organisations working on urgent challenges faced by the planet and underserved communities. Through its Aikyam Fellows programme, it makes fundraising, team and board building, and capacity development more accessible to changemakers. Samagata Foundation backs Aikyam to strengthen the front line of social change from the ground up."
  },
  {
    name: "Indic Digital Archive Foundation",
    url: "https://indicarchive.org/",
    blurb: "Digital archival and preservation of Indic language cultural artefacts — books, publications, and documents — available for free and open access",
    kind: "organisation",
    orgType: "nonprofit",
    topics: ["culture", "media", "technology"],
    geography: ["india", "kerala"],
    note: "IDAF works on digital archival and preservation of Indic language cultural artefacts. Its flagship projects include Granthappura — a large and growing collection of books and documents related to Kerala and Malayalam — and Olam, an open-source Malayalam dictionary used by ~2.5 million people monthly. Samagata Foundation backs IDAF's operations including the procurement of book scanners and archival technology."
  },
  {
    name: "FOSS United",
    url: "https://fossunited.org/",
    blurb: "Promoting and strengthening the Free and Open Source Software ecosystem in India through community building, events, conferences, and project nurturing",
    kind: "community",
    orgType: "nonprofit",
    topics: ["technology"],
    geography: ["india"],
    note: "FOSS United Foundation promotes and strengthens the Free and Open Source Software ecosystem in India. It organises events, conferences, and nurtures open-source software projects coming out of India. Samagata Foundation is a patron organisation supporting FOSS United with a long-term commitment. FOSS United is also a member of the OASIS alliance."
  },
  {
    name: "OASIS",
    url: "https://oasishq.org/",
    blurb: "Open-Source Alliance for Social Innovation and Sustainability — a network united by the vision that FOSS can empower citizen sector organisations at scale",
    kind: "community",
    orgType: "nonprofit",
    topics: ["technology", "governance"],
    geography: ["india"],
    note: "OASIS (Open-Source Alliance for Social Innovation & Sustainability) is a network of organisations united by the vision that Free and Open-Source Software can empower citizen sector organisations to create positive impact at scale. It addresses the large gap between the social sector and the availability of high-quality FOSS technology. Samagata Foundation is a founding member and patron organisation."
  },
  {
    name: "Archival and Research Project (ARPO)",
    url: "https://www.arpo.in/",
    blurb: "Preserving and promoting Kerala's local culture and heritage through digital archiving, multimedia storytelling, research, and community engagement",
    kind: "organisation",
    orgType: "nonprofit",
    topics: ["culture", "media"],
    geography: ["india", "kerala"],
    note: "ARPO (Archival and Research Project) is based in Kerala and works to preserve and promote local culture and heritage through digital archiving, multimedia storytelling, research, and community engagement. Its Earthlore project promotes fading tribal traditions and culture using music, videos, events, and informational content. Backed by Samagata Foundation."
  },
  {
    name: "Institute of Palliative Medicine, Calicut",
    url: "https://www.instituteofpalliativemedicine.org/",
    blurb: "WHO-accredited palliative care centre that pioneered the Kerala palliative model — community-driven, volunteer-powered, and centred on humanism and empathy",
    kind: "organisation",
    orgType: "nonprofit",
    topics: ["health", "welfare"],
    geography: ["india", "kerala"],
    note: "Started in 1993, IPM pioneered the unique Kerala palliative care model. A WHO-accredited institute, it operates from a campus in Calicut that functions as a thriving community and cultural meetup space. Its decentralised, volunteer-powered model attracts college students who participate in home-based palliative care, art events, and fundraising. Samagata Foundation backed a major campus upgradation project enhancing the community/meetup spaces."
  },
  {
    name: "Science Gallery Bengaluru",
    url: "https://bengaluru.sciencegallery.com/",
    blurb: "Research-based public engagement at the intersection of sciences, engineering, art, and design — part of the global Science Gallery Network, the only one in Asia",
    kind: "organisation",
    orgType: "nonprofit",
    topics: ["education", "culture", "technology"],
    geography: ["india", "karnataka"],
    note: "Science Gallery Bengaluru (SGB) is a not-for-profit institution for research-based engagement targeted at young adults, working at the intersection of human, natural, and social sciences, engineering, art, and design. It runs exhibitions, fellowships, residencies, and labs. Samagata Foundation backed the Theory Lab at SGB — a 20-seater meetup space bringing together anti-disciplinary thinkers. Part of the global Science Gallery Network."
  },
  {
    name: "Regional Science Centre and Planetarium, Calicut",
    url: "https://rscpcalicut.org.in/",
    blurb: "Government science centre in Calicut hosting lakhs of visitors annually with interactive exhibits, 3D space shows, and children's science programmes",
    kind: "organisation",
    orgType: "government",
    topics: ["education", "technology"],
    geography: ["india", "kerala"],
    note: "Opened in 1997, RSCP hosts lakhs of visitors annually who interact with science and technology exhibits and watch space shows in its large 3D domed projection theatre. It runs exhibitions, activities, and programmes especially for children. Samagata Foundation co-funded a major revamp and modernisation of RSCP's infrastructure through an MoU with the government."
  },
  {
    name: "Jawaharlal Nehru Planetarium, Bangalore",
    url: "https://taralaya.org/",
    blurb: "Premier science centre in Bengaluru visited by lakhs yearly, running astronomy education, telescope lending, and an undergraduate research programme",
    kind: "organisation",
    orgType: "government",
    topics: ["education", "technology"],
    geography: ["india", "karnataka"],
    note: "Opened in 1989, JNP is a premier science centre in Bengaluru. Samagata Foundation supports three key initiatives: Taralaya (fully funded day trips for rural government school children), REAP (a rigorous three-year weekend science programme where 135+ alumni have earned PhDs), and the Telescope Borrowing Program for amateur astronomers. Samagata set up an endowment providing REAP scholarships for 20 years."
  },
  {
    name: "Courtyard Koota",
    url: "https://courtyardkoota.com/",
    blurb: "Community and event space in Bengaluru — art, music, science, learning, and culture, plus Makkala Masti outreach for rural government school children",
    kind: "organisation",
    orgType: "nonprofit",
    topics: ["education", "culture"],
    geography: ["india", "karnataka"],
    note: "Courtyard Koota in Kengeri, Bengaluru, is a community and event space that knits together art, music, science, and culture. Samagata Foundation supports Makkala Masti, its outreach programme combining education, arts, and theatre for government school children in surrounding villages. The programme employs dedicated teachers and provides children access to the space's varied activities."
  },
  {
    name: "Paper Crane Lab",
    url: "https://pclprojects.wordpress.com/",
    blurb: "Maker space in Bangalore focusing on experiential STEM education through the intersection of art and science — from 3D printing to carpentry and papercraft",
    kind: "organisation",
    orgType: "nonprofit",
    topics: ["education", "technology"],
    geography: ["india", "karnataka"],
    note: "Paper Crane Lab (PCL) is a not-for-profit focusing on experiential STEM education through the intersection of art and science. Operating a small maker space in Indiranagar, Bangalore, children gather to tinker with technologies and crafts — from 3D printing to carpentry to papercraft. Samagata Foundation backed the expansion of PCL's existing space."
  },
  {
    name: "Kota Heritage Society",
    url: "http://www.kotaheritagesociety.in/",
    blurb: "Preserving tangible and intangible heritage in Rajasthan — documenting and reviving 400 traditional hand block prints through the Marwar Block Print Project",
    kind: "organisation",
    orgType: "nonprofit",
    topics: ["culture"],
    geography: ["india", "rajasthan"],
    note: "Kota Heritage Society works for heritage preservation in Rajasthan and surrounding areas. Samagata Foundation backs its Marwar Block Print Project, which aims to document, revive, and publish approximately 400 culture-specific hand block prints from Western Rajasthan. The project recreates old designs using unique natural dye recipes, indigenous printing techniques, and artisan exchanges, with knowledge shared with academic institutions, museums, and printer communities."
  },
  {
    name: "Goya Media",
    url: "https://www.goya.in/",
    blurb: "Award-winning food publication celebrating regional cuisines and home cooks — building an open-source archive of India's heirloom recipes through the 1000 Kitchens project",
    kind: "publication",
    orgType: "commercial",
    topics: ["culture", "media"],
    geography: ["india"],
    note: "Goya is a dynamic media company focused on celebrating food, culture, and the stories that shape them. Its award-winning publication, The Goya Journal, champions regional cuisines and home cooks through photo essays, podcasts, videos, and long-form narratives. The 1000 Kitchens project documents heirloom recipes from across India as an open-source digital archive of intangible culinary heritage. Samagata Foundation supports 1000 Kitchens to scale its impact."
  },
  {
    name: "Mental Health Action Trust (MHAT)",
    url: "https://mhatkerala.org/",
    blurb: "Decentralised, low-cost community mental health support using volunteer-powered, task-sharing models — free care through clinics in Kerala and Bengaluru",
    kind: "organisation",
    orgType: "nonprofit",
    topics: ["health", "welfare"],
    geography: ["india", "kerala", "karnataka"],
    note: "Established in 2008, MHAT provides mental health support to communities through a decentralised, low-cost model relying on volunteer support and task-sharing among professionals and trained non-professionals. It performs economic screening and provides services free of charge, with patient tracking, outreach, and regular training. Samagata Foundation supports MHAT's Community Mental Health Clinics in Bengaluru."
  },
  {
    name: "iLAB Society",
    url: "https://ilabindia.org/",
    blurb: "Uplifting marginalised coastal communities in Kozhikode through education — runs learning hubs and life-skills programmes for fishing community children",
    kind: "organisation",
    orgType: "nonprofit",
    topics: ["education", "welfare"],
    geography: ["india", "kerala"],
    note: "iLAB Society focuses on uplifting marginalised coastal communities in Kozhikode through education and leadership development. Its Coastal Education Enhancement Mission (CEEM) addresses high dropout rates and literacy gaps in fishing communities by providing quality primary education and life skills in students' mother tongue. Samagata Foundation supports CEEM to expand its reach. Programmes include MissionTEN, MILES, and Lifeskill Camps."
  },
  {
    name: "Judicial Data Collaborative",
    url: "https://judicialdatacollaborative.in/",
    blurb: "Promoting transparency and accountability in governance through open judicial data — building a reliable open-source knowledge hub for the justice system",
    kind: "organisation",
    orgType: "nonprofit",
    topics: ["justice", "governance", "technology"],
    geography: ["india"],
    note: "Anchored by Daksh Society, the Judicial Data Collaborative drives advocacy around the accessibility, quality, and reliability of judicial data through collective action. Samagata Foundation backs its Judicial Data Wiki / Justice Definitions Project, which creates a reliable open-source knowledge hub for terms and concepts related to the justice system. A key resource for legal researchers, journalists, and civic technologists working on judicial reform."
  }
]

let created = 0, skipped = 0
for (const e of entries) {
  const slug = slugify(e.name)
  const file = `${entriesDir}/${slug}.md`
  if (existsSync(file) && !dryRun) {
    console.log(`SKIP: ${slug}`)
    skipped++
    continue
  }
  const md = make(e)
  if (dryRun) {
    console.log(`WOULD CREATE: ${e.name} (${e.blurb.length} chars)`)
  } else {
    writeFileSync(file, md, 'utf-8')
    console.log(`CREATED: ${e.name}`)
  }
  created++
}
console.log(`\nCreated: ${created}, Skipped: ${skipped}`)
