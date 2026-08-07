/**
 * Generate Soochi entry files from Rainmatter partner map data.
 * Dry-run first: node scripts/generate-rf-partners.mjs --dry
 * Actually write: node scripts/generate-rf-partners.mjs
 */

import { writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const entriesDir = resolve(__dirname, '..', 'src', 'content', 'entries')
const dryRun = process.argv.includes('--dry')

// Map partner.js categories to Soochi topics
function mapTopics(cat, desc) {
  const d = (desc || '').toLowerCase()
  const topics = new Set()

  // By category
  const catMap = {
    'Rural': ['agriculture', 'labour', 'welfare'],
    'Urban': ['cities', 'governance'],
    'CnR': ['environment', 'climate', 'water'],
    'Buildings': ['housing', 'cities'],
    'Data': ['technology', 'governance'],
    'Messaging': ['media', 'technology'],
  }
  for (const t of (catMap[cat] || [])) topics.add(t)

  // Keyword-based
  if (d.includes('conservation') || d.includes('biodiversity') || d.includes('wildlife') || d.includes('species')) topics.add('environment')
  if (d.includes('water') || d.includes('watershed') || d.includes('groundwater') || d.includes('rainwater')) topics.add('water')
  if (d.includes('climate') || d.includes('carbon') || d.includes('emission')) topics.add('climate')
  if (d.includes('energy') || d.includes('solar') || d.includes('renewable') || d.includes('electri')) topics.add('energy')
  if (d.includes('farmer') || d.includes('agriculture') || d.includes('farming') || d.includes('agro')) topics.add('agriculture')
  if (d.includes('health') || d.includes('disease') || d.includes('sanitation') || d.includes('hygiene')) topics.add('health')
  if (d.includes('education') || d.includes('school') || d.includes('learning') || d.includes('literacy')) topics.add('education')
  if (d.includes('livelihood') || d.includes('income') || d.includes('employment') || d.includes('entrepreneur')) topics.add('labour')
  if (d.includes('women') || d.includes('gender')) topics.add('gender')
  if (d.includes('housing') || d.includes('slum') || d.includes('habitat')) topics.add('housing')
  if (d.includes('governance') || d.includes('policy') || d.includes('civic') || d.includes('municipal')) topics.add('governance')
  if (d.includes('waste') || d.includes('circular')) topics.add('environment')
  if (d.includes('forest') || d.includes('ecological') || d.includes('restoration') || d.includes('regeneration')) topics.add('environment')
  if (d.includes('rural') || d.includes('tribal') || d.includes('village')) topics.add('welfare')
  if (d.includes('technology') || d.includes('digital') || d.includes('platform') || d.includes('data ') || d.includes('tech')) topics.add('technology')
  if (d.includes('media') || d.includes('journalism') || d.includes('film') || d.includes('storytell')) topics.add('media')
  if (d.includes('justice') || d.includes('rights') || d.includes('legal') || d.includes('law')) topics.add('justice')
  if (d.includes('philanthrop') || d.includes('grant') || d.includes('funding')) topics.add('philanthropy')
  if (d.includes('econom') || d.includes('msme') || d.includes('enterprise') || d.includes('market')) topics.add('economy')
  if (d.includes('democra') || d.includes('election')) topics.add('elections')
  if (d.includes('transport') || d.includes('mobility') || d.includes('transit')) topics.add('transport')
  if (d.includes('land') || d.includes('property')) topics.add('land')
  if (d.includes('culture') || d.includes('dance') || d.includes('music') || d.includes('heritage') || d.includes('art')) topics.add('culture')

  // Ensure at least 2, at most 4
  const arr = [...topics]
  if (arr.length < 2) arr.push('environment')
  return arr.slice(0, 4)
}

function mapOrgType(cat, desc) {
  const d = (desc || '').toLowerCase()
  if (cat === 'Data' || cat === 'Messaging') return 'nonprofit'
  if (d.includes('philanthrop') || d.includes('grant-mak') || d.includes('foundation')) return 'nonprofit'
  return 'nonprofit'
}

function mapGeography(states) {
  const geo = ['india']
  if (!states || states.length === 0) return geo

  const stateMap = {
    'Karnataka': 'karnataka', 'Tamil Nadu': 'tamil-nadu', 'Kerala': 'kerala',
    'Maharashtra': 'maharashtra', 'Gujarat': 'gujarat', 'Rajasthan': 'rajasthan',
    'Madhya Pradesh': 'madhya-pradesh', 'Uttar Pradesh': 'uttar-pradesh',
    'Bihar': 'bihar', 'West Bengal': 'west-bengal', 'Odisha': 'odisha',
    'Jharkhand': 'jharkhand', 'Chhattisgarh': 'chhattisgarh',
    'Andhra Pradesh': 'andhra-pradesh', 'Telangana': 'telangana',
    'Assam': 'assam', 'Arunachal Pradesh': 'arunachal-pradesh',
    'Meghalaya': 'meghalaya', 'Nagaland': 'nagaland', 'Manipur': 'manipur',
    'Mizoram': 'mizoram', 'Tripura': 'tripura', 'Sikkim': 'sikkim',
    'Goa': 'goa', 'Haryana': 'haryana', 'Punjab': 'punjab',
    'Himachal Pradesh': 'himachal-pradesh', 'Uttarakhand': 'uttarakhand',
    'Jammu and Kashmir': 'jammu-kashmir', 'Delhi': 'delhi',
    'NCT of Delhi': 'delhi', 'Pan India': 'india',
    'Andaman and Nicobar Islands': 'andaman-nicobar',
    'Lakshadweep': 'lakshadweep',
  }

  for (const state of states) {
    if (state === 'Pan India') continue // already have 'india'
    const mapped = stateMap[state]
    if (mapped && !geo.includes(mapped)) geo.push(mapped)
  }
  return geo
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['']/g, '')
    .replace(/[\/\.]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

// Helper to serialize values
const q = (s) => JSON.stringify(s)
const list = (a) => `[${a.map(q).join(', ')}]`

function toMarkdown(entry) {
  const L = ['---']
  L.push(`name: ${q(entry.name)}`)
  L.push(`url: ${q(entry.url)}`)
  L.push(`blurb: ${q(entry.blurb)}`)
  L.push(`kind: ${entry.kind}`)
  if (entry.orgType) L.push(`orgType: ${entry.orgType}`)
  L.push(`topics: ${list(entry.topics)}`)
  L.push(`geography: ${list(entry.geography)}`)
  if (entry.licensing) L.push(`licensing: ${entry.licensing}`)
  if (entry.access) L.push(`access: ${entry.access}`)
  if (entry.links?.length) {
    L.push('links:')
    for (const l of entry.links) {
      L.push(`  - label: ${q(l.label)}`)
      L.push(`    url: ${q(l.url)}`)
    }
  }
  if (entry.location) {
    L.push('location:')
    if (entry.location.city) L.push(`  city: ${q(entry.location.city)}`)
    if (entry.location.region) L.push(`  region: ${q(entry.location.region)}`)
    if (entry.location.lat) L.push(`  lat: ${entry.location.lat}`)
    if (entry.location.lng) L.push(`  lng: ${entry.location.lng}`)
  }
  L.push(`added: "2026-08-07"`)
  L.push('status: live')
  L.push('---')
  if (entry.note) L.push('', entry.note, '')
  return L.join('\n')
}

// ALL PARTNERS DATA
const partners = [
  // === Already in Soochi (skipped): Rainmatter, Samagata, Tech4Good, Vidhi Centre, PARI ===
  
  // URBAN
  { name: "ALT EFF", cat: "Urban", desc: "Climate action and awareness through the emotive power of cinema.", states: ["Maharashtra"], geo: "Mumbai, Maharashtra", lat: 19.0176, lon: 72.8562, url: "https://alteff.in/", note: "ALT EFF (All Living Things Environmental Film Festival) is India's dedicated environmental film festival. It screens climate and nature films across venues in India, using cinema to make environmental issues emotionally resonant and publicly accessible. The festival has grown into a year-round programme of screenings, workshops, and community events." },
  { name: "ACT Capital Foundation", cat: "Urban", desc: "Venture philanthropy providing early-stage funding to social entrepreneurs.", states: ["Karnataka"], geo: "Bengaluru, Karnataka", lat: 12.9749, lon: 77.6193, url: "https://actgrants.in/", note: "ACT Capital Foundation provides early-stage grants and capacity support to social entrepreneurs working on systemic change. Its venture philanthropy model combines grant capital with mentorship and strategic support, treating social enterprises as investable vehicles for impact rather than charity recipients." },
  { name: "Aga Khan Rural Support Programme India", cat: "Urban", desc: "Participatory development programmes for rural livelihoods and ecological regeneration.", states: ["Gujarat", "Madhya Pradesh", "Bihar"], geo: "Ahmedabad, Gujarat", lat: 23.0385, lon: 72.5698, url: "https://www.akrspindia.org.in/", note: "AKRSPI delivers participatory rural development through village-level institutions, watershed development, water harvesting, and soil conservation. Part of the Aga Khan Development Network, it builds community federations that sustain local governance and natural resource management long after projects end." },
  { name: "Arthan Foundation", cat: "Urban", desc: "Systems change initiatives to achieve the SDGs, with a focus on connecting talent to social impact.", states: ["Pan India"], geo: "New Delhi, Delhi", lat: 28.5423, lon: 77.2154, url: "https://arthan.in/", note: "Arthan Foundation aligns programme design with specific SDG targets and runs Arthan Careers, a talent marketplace connecting professionals with social sector organisations. It treats human capital as a leverage point for systems change." },
  { name: "B.PAC", cat: "Urban", desc: "Non-partisan citizen action to improve governance and civic participation in Bengaluru.", states: ["Karnataka"], geo: "Bengaluru, Karnataka", lat: 12.9887, lon: 77.5918, url: "https://bpac.in/", note: "B.PAC (Bangalore Political Action Committee) runs civic-governance campaigns, leadership programmes (B.CLIP), safety audits (B.SAFE), and a Participatory Democracy Fellowship. Its Agenda for Bangalore framework operates as a durable civic reform platform." },
  { name: "Bharat Design Labs", cat: "Urban", desc: "Bridging capability gaps in government, civil society, and the private sector through human-centred design.", states: ["Pan India"], geo: "New Delhi, Delhi", lat: 28.5601, lon: 77.216, url: "https://www.bharatdesignlab.com/", note: "Bharat Design Labs applies design thinking to governance and public services, running workshops and projects that help government agencies and civil society organisations solve implementation challenges through user-centred methods." },
  { name: "Bharathiya Vikas Trust", cat: "Urban", desc: "Capacity building and knowledge sharing for vulnerable rural communities.", states: ["Karnataka", "Tamil Nadu", "Andhra Pradesh"], geo: "Manipal, Karnataka", lat: 13.3635, lon: 74.7805, url: "https://bvtrust.org/", note: "Bharathiya Vikas Trust runs training and knowledge-sharing initiatives for rural and tribal communities in southern India. Its peer-learning approach strengthens local institutions for sustainable development." },
  { name: "Biodiversity Collaborative", cat: "CnR", desc: "Interdisciplinary biodiversity knowledge, dialogue, and public learning across ecological systems.", states: ["Pan India"], geo: "Bengaluru, Karnataka", lat: 13.0643, lon: 77.6202, url: "https://biodiversitycollaborative.org/", note: "The Biodiversity Collaborative is a multi-institutional research network generating interdisciplinary biodiversity knowledge. Its public-facing outputs include the Biodiversity Atlas India and fellowship programmes that bridge conservation science with public learning and policy engagement." },
  { name: "Biome Environmental Trust", cat: "Urban", desc: "Ecological architecture, rainwater harvesting, and responsible land use.", states: ["Karnataka"], geo: "Bengaluru, Karnataka", lat: 13.0846, lon: 77.5639, url: "https://biometrust.org/", note: "Biome Environmental Trust describes itself as a thoughtful do-tank and practice-to-policy bridge. Known for the Million Wells for Bengaluru campaign, school rainwater harvesting installations, and open-source water knowledge, it works through communities, well-diggers, plumbers, schools, and state systems." },
  { name: "Bridgespan India", cat: "Urban", desc: "Advisory, research, and capacity building for philanthropies, NGOs, and social sector systems change.", states: ["Pan India"], geo: "Mumbai, Maharashtra", lat: 19.0596, lon: 72.8656, url: "https://www.bridgespan.org/", note: "Bridgespan India is the dedicated regional practice of the global Bridgespan Group, serving philanthropists, nonprofits, and impact leaders. It converts strategic planning, research, and operating frameworks into reusable infrastructure for donors and social-impact organisations." },
  { name: "Buzz Women", cat: "Rural", desc: "Empowering underserved women through knowledge, skills, and livelihood tools.", states: ["Karnataka"], geo: "Bengaluru, Karnataka", lat: 13.0055, lon: 77.5622, url: "https://buzzwomen.org/", note: "Buzz Women runs a mobile-first platform delivering financial literacy and livelihood content to rural women, combined with structured micro-enterprise training. Its model combines digital tools with community networks for sustainable women-led enterprises." },
  { name: "CEEW", cat: "Urban", desc: "Policy research on energy, climate, air, water, and resource use, with a strong public tools portfolio.", states: ["Pan India"], geo: "New Delhi, Delhi", lat: 28.5433, lon: 77.1478, url: "https://www.ceew.in/", note: "The Council on Energy, Environment and Water (CEEW) is one of Asia's leading policy research institutes. Its public dashboards and tools — including the Electric Mobility Dashboard, India Renewables Dashboard, ValueSTAC solar calculator, and Industrial Energy Emissions Dashboard — convert sectoral research into operational public infrastructure." },
  { name: "CSTEP", cat: "Buildings", desc: "Bridging the gap between science, technology, and policy through modelling, tools, and digital platforms.", states: ["Karnataka", "Rajasthan", "Assam"], geo: "Bengaluru, Karnataka", lat: 13.0485, lon: 77.5796, url: "https://cstep.in/", note: "The Center for Study of Science, Technology and Policy (CSTEP) has one of the most explicit public tool stacks in Indian policy research: SAFARI (systems model), PAVITRA (air-quality modelling), E-DEPOT (e-bus planning), EI 76 (emissions portal), DEFT (climate adaptation), and DARPAN (decision analysis platform)." },
  { name: "Centre for Wildlife Studies", cat: "Urban", desc: "Conserving India's wildlife through research and community engagement, with flagship coexistence programmes.", states: ["Karnataka", "Tamil Nadu", "Kerala", "Madhya Pradesh", "Rajasthan"], geo: "Bengaluru, Karnataka", lat: 12.9748, lon: 77.6163, url: "https://cwsindia.org/", note: "CWS turns coexistence research into applied programmes: Wild Seve (conflict-response toll-free system), Wild Shaale (wildlife curriculum for schools near reserves), and Wild Surakshe (zoonotic disease and safety workshops). It pairs field programmes with doctoral and incubator pathways to grow conservation capacity." },
  { name: "Civis", cat: "Urban", desc: "Civic-tech platform enabling citizens to participate in public consultations and lawmaking.", states: ["Pan India"], geo: "Mumbai, Maharashtra", lat: 18.9292, lon: 72.8324, url: "https://www.civis.vote/", note: "Civis provides a public digital interface for tracking government consultations and submitting citizen feedback on policy and legal changes. It makes regulatory participation legible, repeatable, and actionable for ordinary citizens." },
  { name: "Climate RISE Alliance", cat: "Urban", desc: "Climate resilience alliance connecting vulnerable communities with adaptation knowledge, finance, and action.", states: ["Pan India"], geo: "Mumbai, Maharashtra", lat: 18.9765, lon: 72.8258, url: "https://climaterise.in/", note: "Climate RISE Alliance operates as a coalition platform gathering collaborators working on resilience, inclusion, and climate adaptation. Its public framing emphasises climate resilience through cross-sector collaboration around people and places most exposed to risk." },
  { name: "CoRE Stack (CommonsTech Foundation)", cat: "Urban", desc: "Community-based digital public infrastructure for natural-resource planning, resilience, and landscape stewardship.", states: ["Bihar", "Gujarat", "Jharkhand", "Odisha", "Rajasthan"], geo: "New Delhi, Delhi", lat: 28.4938, lon: 77.1459, url: "https://core-stack.org/", note: "CoRE Stack bundles geospatial tools (Commons Connect, Know Your Landscape), commons-oriented datasets, and a monthly Community of Practice. It treats data, workflows, and stewardship infrastructure as shared commons rather than isolated project assets." },
  { name: "Commutiny", cat: "Urban", desc: "Nurturing the leadership potential of young people through ecosystem-building and experiential journeys.", states: ["Pan India"], geo: "New Delhi, Delhi", lat: 28.5433, lon: 77.2626, url: "https://commutiny.in/", note: "ComMutiny has built a youth-development ecosystem around the idea of the Jagrik (jagruk nagrik — aware citizen). Its public products include the Be a Jagrik board game, the Togetherness Table dialogue format, and the vartaLeap cross-sector coalition for youth-centric development." },
  { name: "Deloitte India", cat: "Urban", desc: "Sustainability, climate, and systems-change partnerships spanning business, philanthropy, and public problem-solving.", states: ["Pan India"], geo: "Mumbai, Maharashtra", lat: 19.0596, lon: 72.8656, url: "https://www2.deloitte.com/in/en.html", note: "Deloitte India's social-impact work includes the WorldClimate programme and advisory partnerships with philanthropies and government. It brings professional services capacity to sustainability, climate transitions, and public-interest systems change." },
  { name: "Edelgive Foundation", cat: "Urban", desc: "Grant-making to support grassroots NGOs with funding, capacity building, and sector collaboration.", states: ["Pan India"], geo: "Mumbai, Maharashtra", lat: 19.0702, lon: 72.8633, url: "https://www.edelgive.org/", note: "EdelGive Foundation runs the GROW Fund, a multi-donor pooled funding vehicle for vetted grassroots organisations, and publishes the annual EdelGive Hurun India Philanthropy List. It combines unrestricted grants with organisational development support." },
  { name: "Education For Employability", cat: "Urban", desc: "Support services for disadvantaged youth and rural entrepreneurs.", states: ["Karnataka", "Maharashtra", "Tamil Nadu", "Telangana", "Rajasthan", "Uttar Pradesh"], geo: "New Delhi, Delhi", lat: 28.5192, lon: 77.2073, url: "https://www.e2findia.org/", note: "EFE bridges education, skill-building, and employment for underserved populations. Its programmes connect disadvantaged youth and rural entrepreneurs with the support services needed to access sustainable livelihood pathways." },
  { name: "Efficient Ecosystem Protection", cat: "Urban", desc: "Education-focused organisation in Pune working on environmental awareness.", states: ["Maharashtra"], geo: "Pune, Maharashtra", lat: 18.5318, lon: 73.8973, url: "https://rainmatter.org/partners", note: "Efficient Ecosystem Protection runs structured environmental education and awareness activities in Pune, engaging communities and schools in ecological awareness and action." },
  { name: "Ethos Foundation", cat: "Buildings", desc: "Strengthening design education around architecture and sustainability.", states: ["Maharashtra"], geo: "Bengaluru, Karnataka", lat: 12.9716, lon: 77.5946, url: "https://ethosfoundation.in/", note: "Ethos Foundation runs ACEDGE, an e-learning platform for architecture, construction, engineering, and design professionals in South Asia. Its Arcause initiative galvanises architecture and design professionals towards social responsibility and nation-building." },
  { name: "Farm 2 Food Foundation", cat: "Urban", desc: "Training local communities for productive, change-oriented development in Assam.", states: ["Assam"], geo: "Guwahati, Assam", lat: 26.1292, lon: 91.7919, url: "https://farm2food.org/", note: "Farm2Food Foundation builds cadres of women entrepreneurs — solar sakhi, krishi sakhi, and pashu sakhi — for community-led development in northeast India. Its model combines agricultural training with women's enterprise development for a prosperous and peaceful region." },
  { name: "Farmers for Forests", cat: "Rural", desc: "Carbon-financed agroforestry and biodiversity restoration with smallholder farmers.", states: ["Maharashtra"], geo: "Pune, Maharashtra", lat: 18.5204, lon: 73.8567, url: "https://farmersforforests.org/", note: "Farmers for Forests uses carbon markets to fund tree planting and agroforestry on smallholder farms. Its model channels carbon credit revenue to farmers while restoring biodiversity and soil health." },
  { name: "Forum For the Future India", cat: "Urban", desc: "Accelerating the shift towards a just and regenerative future through systems change.", states: ["Pan India"], geo: "Mumbai, Maharashtra", lat: 18.9659, lon: 72.8194, url: "https://www.forumforthefuture.org/", note: "Forum for the Future runs systems change labs and applies futures thinking to sustainability challenges. Its India practice focuses on climate and sustainability transitions through collaborative scenario planning and multi-stakeholder innovation." },
  { name: "FISE", cat: "Urban", desc: "Supporting social entrepreneurs to develop and scale businesses.", states: ["Telangana", "Andhra Pradesh"], geo: "Bengaluru, Karnataka", lat: 12.9173, lon: 77.6695, url: "https://fise.in/", note: "FISE provides incubation and acceleration support for early-stage social enterprises in Telangana and Andhra Pradesh. Its model combines business mentoring with social mission alignment for scalable impact." },
  { name: "Foundation For MSME Clusters", cat: "Urban", desc: "Promotion and development of MSMEs through clusters.", states: ["Pan India"], geo: "New Delhi, Delhi", lat: 28.5424, lon: 77.1784, url: "https://www.fmc.org.in/", note: "FMC provides technical assistance, capacity building, and policy advocacy for MSME clusters across India. Its cluster-based approach builds competitiveness through geographic and sectoral concentration." },
  { name: "Gram Vikas", cat: "Rural", desc: "Water conservation and afforestation for rural development, with a distinctive all-or-none community model.", states: ["Odisha", "Jharkhand", "Madhya Pradesh"], geo: "Bhubaneswar, Odisha", lat: 20.2571, lon: 85.8279, url: "https://gramvikas.org/", note: "Gram Vikas is known for MANTRA (Movement and Action Network for Transformation of Rural Areas), an all-or-none model for inclusion, equity, and cost-sharing in village water systems. Water and sanitation act as an entry point for wider work on livelihoods, governance, health, and education." },
  { name: "Gramvaani", cat: "Urban", desc: "Participatory media and voice-tech platforms for communities excluded from mainstream information systems.", states: ["Pan India"], geo: "New Delhi, Delhi", lat: 28.5453, lon: 77.1926, url: "https://gramvaani.org/", note: "Gramvaani's Mobile Vaani platform is a participatory media infrastructure that lets underserved communities surface problems, access information, and organise through voice and digital tools. It treats communication as civic infrastructure for collective agency." },
  { name: "Gurukula Botanical Sanctuary", cat: "CnR", desc: "Community-based plant conservation, habitat restoration, and ecological learning in the Western Ghats.", states: ["Kerala"], geo: "Periya, Kerala", lat: 12.2726, lon: 75.8853, url: "https://gbsanctuary.org/", note: "Gurukula Botanical Sanctuary conserves over 1,800 plant species in a restored rainforest setting in the Western Ghats. Its residency-based ecological learning model combines hands-on conservation practice with community living, and its seed bank supports endemic and threatened species restoration." },
  { name: "Habitat for Humanity India", cat: "Urban", desc: "Research on urban green spaces and human-wildlife interactions, plus affordable housing.", states: ["Maharashtra", "Tamil Nadu", "Karnataka", "Andhra Pradesh", "Telangana", "West Bengal", "Odisha"], geo: "Faridabad, Haryana", lat: 28.489, lon: 77.2992, url: "https://habitatindia.org/", note: "Habitat for Humanity India builds and repairs homes for vulnerable families and provides rapid shelter following natural disasters. Its community-driven housing model combines volunteer labour, microfinance, and technical support." },
  { name: "Himalaya Unnati Mission", cat: "CnR", desc: "Himalayan conservation, livelihoods, and ecological stewardship rooted in mountain communities.", states: ["Uttarakhand", "Himachal Pradesh", "Jammu and Kashmir"], geo: "Dehradun, Uttarakhand", lat: 30.3165, lon: 78.0322, url: "https://savehimalayas.org/", note: "HUM packages mountain stewardship into a public mission format, combining a dedicated secretariat structure with regional convenings like Himalaya Day. It frames conservation, livelihoods, and cultural rootedness as inseparable parts of a Himalayan development pathway." },
  { name: "Hume Centre for Ecology and Wildlife Biology", cat: "Urban", desc: "Community-led science-based solutions for climate resilience and ecological stewardship in Kerala.", states: ["Kerala"], geo: "Kalpetta, Kerala", lat: 11.6149, lon: 76.0716, url: "https://humecentre.org/", note: "The Hume Centre runs field research stations in the Wayanad landscape, integrating community knowledge with scientific research for climate adaptation and biodiversity conservation. It focuses on community-led, science-based approaches to ecological stewardship." },
  { name: "Impact Foundation", cat: "Urban", desc: "Catalyst for mass health programmes of national priority.", states: ["Pan India"], geo: "Mumbai, Maharashtra", lat: 18.9887, lon: 72.825, url: "https://impactindia.org/", note: "Impact Foundation India runs national-scale immunisation drives and disease elimination programmes. It bridges government health systems with philanthropic and technical resources to achieve population-level health outcomes." },
  { name: "India Climate Collaborative", cat: "Urban", desc: "Climate philanthropy collaborative unlocking capital, priorities, and connective infrastructure for climate action.", states: ["Pan India"], geo: "Mumbai, Maharashtra", lat: 18.9315, lon: 72.8319, url: "https://indiaclimatecollaborative.org/", note: "ICC frames itself as connective infrastructure for climate philanthropy, helping funders align priorities, partnerships, and public narratives. Its platform aggregates events, ecosystem signals, and coordinates COP-linked programming that surfaces emerging-economy perspectives." },
  { name: "India Development Review", cat: "Urban", desc: "Knowledge platform publishing actionable ideas and lessons for India's social impact sector.", states: ["Pan India"], geo: "Mumbai, Maharashtra", lat: 19.0541, lon: 72.8263, url: "https://idronline.org/", note: "IDR is a public publication platform for essays, explainers, interviews, and insights written for India's social sector. It translates sector experience into accessible public knowledge so practitioners can reuse ideas, lessons, and frameworks. Its Orvador vertical provides digital services for NGOs." },
  { name: "India Resources Trust", cat: "Urban", desc: "Practical proposals for environmentally sound development.", states: ["NCT of Delhi"], geo: "New Delhi, Delhi", lat: 28.5567, lon: 77.2092, url: "https://wri-india.org/", note: "India Resources Trust develops evidence-based proposals on environment, resources, and sustainable development, bridging environmental science with practical policy recommendations." },
  { name: "Jagriti Seva Sansthan", cat: "Rural", desc: "Building India through enterprise in Middle India, running the iconic Jagriti Yatra train journey.", states: ["Uttar Pradesh", "Bihar"], geo: "Araipar, Uttar Pradesh", lat: 26.5981, lon: 83.7395, url: "https://www.jagritiyatra.com/", note: "Jagriti runs the annual 8,000 km Jagriti Yatra rail journey connecting young entrepreneurs with grassroots enterprises across India. Its Jagriti Enterprise Centre in eastern UP provides physical incubation and enterprise support infrastructure, using entrepreneurship as the vehicle for equitable development in underserved regions." },
  { name: "Jana Urban Space", cat: "Urban", desc: "Fixing spatial dimensions of Indian cities via policy, planning, and design.", states: ["Karnataka", "Maharashtra", "Tamil Nadu", "Madhya Pradesh", "Rajasthan"], geo: "Bengaluru, Karnataka", lat: 12.9853, lon: 77.5967, url: "https://janausp.org/", note: "Jana Urban Space applies spatial analytics and planning science to fix dysfunctional urban layouts. Its projects span city-level spatial planning, zoning reform, and public realm design across multiple states." },
  { name: "Kalpavriksh", cat: "Urban", desc: "Non-profit working on environmental and social issues, known for the Vikalp Sangam alternatives platform.", states: ["Maharashtra"], geo: "Pune, Maharashtra", lat: 18.5194, lon: 73.8388, url: "https://kalpavriksh.org/", note: "Kalpavriksh runs Vikalp Sangam, a long-running platform documenting grassroots alternatives through stories, case studies, and exchanges. Its Radical Ecological Democracy framework articulates a broad socio-ecological vision for justice, sustainability, and participatory decision-making. It also produces environment education materials and children's nature books." },
  { name: "Kritia Development Research", cat: "Urban", desc: "Knowledge and networking resources for social change.", states: ["NCT of Delhi"], geo: "New Delhi, Delhi", lat: 28.5247, lon: 77.2558, url: "https://krititeam.blogspot.com/", note: "Kritia facilitates connections and knowledge sharing across social change organisations through development research and networking resources." },
  { name: "MLI Foundation", cat: "Urban", desc: "Animal welfare and environmental awareness.", states: ["Uttar Pradesh"], geo: "Noida, Uttar Pradesh", lat: 28.6022, lon: 77.354, url: "https://rainmatter.org/partners", note: "MLI Foundation runs campaigns and programmes promoting animal welfare and environmental consciousness, linking animal welfare with broader environmental awareness and action." },
  { name: "Narrative Hub / The Climate Narrative Hub", cat: "Urban", desc: "Climate storytelling and narrative-change hub connecting communicators, creators, funders, and civil society.", states: ["Pan India"], geo: "Mumbai, Maharashtra", lat: 19.0607, lon: 72.8671, url: "https://www.theclimatenarrative.org/", note: "The Climate Narrative Hub connects climate communicators, media creators, and civil society organisations to shift public climate narratives through coordinated storytelling. It operates as a practitioner network for strategic narrative change." },
  { name: "Nrityagram", cat: "Urban", desc: "Odissi dance preservation and Food Forest support near Bengaluru.", states: ["Karnataka"], geo: "Bengaluru, Karnataka", lat: 13.1617, lon: 77.4594, url: "https://nrityagram.org/", note: "Nrityagram is a residential dance village dedicated to Odissi and Indian classical dance. It also maintains an on-campus Food Forest integrating native species and sustainable food production, weaving ecological stewardship into the fabric of a living arts institution." },
  { name: "Organic Mandya", cat: "Urban", desc: "Empowering rural communities towards self-sufficiency through organic farming and farmer-consumer networks.", states: ["Karnataka"], geo: "Mandya, Karnataka", lat: 12.6365, lon: 76.9155, url: "https://www.organicmandya.com/", note: "Organic Mandya runs farm-to-fork retail outlets connecting organic farmers directly with urban consumers, eliminating middlemen to ensure fair prices for farmers and fresh organic produce for consumers. Its training programmes support farmers in transition to organic cultivation." },
  { name: "Paadhai Trust", cat: "Urban", desc: "Connecting donors and impoverished groups, focusing on education and community welfare.", states: ["Tamil Nadu"], geo: "Bengaluru, Karnataka", lat: 12.8436, lon: 77.6618, url: "https://paadhai.org/", note: "Paadhai Trust facilitates direct connections between donors and underserved communities, running education support programmes and community welfare interventions in Tamil Nadu." },
  { name: "Padraka Foundation", cat: "Urban", desc: "Systems entrepreneurship in environmental governance.", states: ["Telangana"], geo: "Hyderabad, Telangana", lat: 17.4484, lon: 78.3627, url: "https://livinglandscapes.in/", note: "Padraka Foundation applies entrepreneurial methods to fix systemic gaps in environmental governance, developing tools and systems for improving environmental compliance and stewardship." },
  { name: "Palluyir Trust", cat: "CnR", desc: "Nature-based outdoor education in Chennai schools.", states: ["Tamil Nadu"], geo: "Chennai, Tamil Nadu", lat: 12.9827, lon: 80.2217, url: "https://palluyir.org/", note: "Palluyir Trust runs structured outdoor and nature-based learning programmes for Chennai school students, using outdoor experiences and natural settings to build ecological literacy in children." },
  { name: "Paani Foundation", cat: "Rural", desc: "Community-led water conservation and climate-resilient rural livelihoods focused on drought-prone Maharashtra.", states: ["Maharashtra"], geo: "Mumbai, Maharashtra", lat: 19.076, lon: 72.8777, url: "https://www.paanifoundation.in/", note: "Paani Foundation's flagship Satyamev Jayate Water Cup is a public mobilisation competition for drought-proofing villages through collective watershed action. It frames drought response as a community capability problem, combining local participation, competition, and practical conservation methods." },
  { name: "Praja", cat: "Urban", desc: "Data-driven urban governance research, report cards, and citizen accountability tools.", states: ["Maharashtra", "NCT of Delhi"], geo: "Mumbai, Maharashtra", lat: 19.0178, lon: 72.8551, url: "https://praja.org/", note: "Praja is widely known for public scorecards and performance reports that make civic representation and urban services more legible. Its core contribution is translating municipal complexity into data-backed public accountability and informed citizen action." },
  { name: "Punarchith", cat: "Urban", desc: "Alternative perspectives on education, environment, and democracy.", states: ["Karnataka"], geo: "Chamarajanagar, Karnataka", lat: 11.9354, lon: 77.0261, url: "https://www.punarchith.org/", note: "Punarchith runs community-based education and environmental learning programmes in Chamarajanagar, questioning mainstream development through localised education, ecology, and democratic practice." },
  { name: "RangDe", cat: "Urban", desc: "Peer-to-peer lending platform for unbanked communities.", states: ["Karnataka", "Tamil Nadu", "Maharashtra", "Rajasthan", "Madhya Pradesh", "Odisha", "Jharkhand", "Assam", "Meghalaya"], geo: "Bengaluru, Karnataka", lat: 12.8682, lon: 77.5928, url: "https://rangde.in/", note: "Rang De runs an RBI-regulated NBFC-P2P social investing platform where individuals invest in borrowers from underserved communities. Its impact partner model identifies borrowers and supports their credit access, and it organises Social Impact Trips so investors can see businesses enabled through their investments." },
  { name: "ReapBenefit", cat: "Urban", desc: "Young citizens solving civic and environmental problems through hyper-local action.", states: ["Karnataka", "Maharashtra", "Tamil Nadu"], geo: "Bengaluru, Karnataka", lat: 12.9231, lon: 77.5904, url: "https://www.reapbenefit.org/", note: "Reap Benefit has a remarkably productised portfolio: Solve Ninja Bot (WhatsApp problem-solving tool), SamaajData (crowdsourced civic data), Samaaja (open-source engagement software), and the DISS framework (Discover-Investigate-Solve-Share). It is building a nationwide movement of first-mile changemakers through hyper-local civic and climate action." },
  { name: "Saahas", cat: "Urban", desc: "Waste management based on circular economy principles.", states: ["Karnataka", "Tamil Nadu", "Telangana", "Maharashtra"], geo: "Bengaluru, Karnataka", lat: 12.9112, lon: 77.612, url: "https://saahas.org/", note: "Saahas runs a source-segregation knowledge centre and the Alag Karo behaviour-change campaign for households. Its circular economy framework emphasises keeping materials in circulation while highlighting dignity and better working conditions for waste workers." },
  { name: "Saath Charitable Trust", cat: "Urban", desc: "Empowering marginalised communities in thriving cities.", states: ["Gujarat", "Rajasthan", "Madhya Pradesh", "Maharashtra"], geo: "Ahmedabad, Gujarat", lat: 23.0201, lon: 72.5178, url: "https://saath.org/", note: "Saath runs in-situ slum rehabilitation and affordable housing programmes alongside urban livelihood training centres. Its inclusive urbanisation model integrates housing, livelihoods, and governance for marginalised urban populations." },
  { name: "SayTrees", cat: "Urban", desc: "Tree plantations, forest creation, and water rejuvenation across Indian cities.", states: ["Karnataka"], geo: "Bengaluru, Karnataka", lat: 12.8665, lon: 77.6513, url: "https://www.saytrees.org/", note: "SayTrees builds dense Miyawaki urban forests, restores lakes, runs agroforestry programmes, and installs biogas infrastructure. Its model combines ecological restoration with volunteer and corporate participation formats that convert citizen engagement into restoration labour and stewardship." },
  { name: "Shakti Sustainable Energy Foundation", cat: "Urban", desc: "Clean energy and climate transitions that are affordable, inclusive, and scalable.", states: ["Pan India"], geo: "New Delhi, Delhi", lat: 28.5555, lon: 77.1755, url: "https://shaktifoundation.in/", note: "Shakti Sustainable Energy Foundation structures work across cooling, mobility, air quality, freight, climate finance, and city action. Its catalytic philanthropy model builds coalitions, evidence, and partner capacity so major public-policy shifts become possible. It helped build the analytical base for the India Cooling Action Plan." },
  { name: "Slam Out Loud", cat: "Urban", desc: "Arts education and socio-emotional learning for children from underserved communities.", states: ["NCT of Delhi", "Maharashtra", "Punjab", "Bihar", "Karnataka"], geo: "New Delhi, Delhi", lat: 28.5356, lon: 77.2588, url: "https://slamoutloud.com/", note: "Slam Out Loud brings structured poetry, storytelling, and visual arts curriculum to underserved schools. It uses creative expression to build confidence, voice, and emotional resilience in children, with a digital library of arts-based learning resources for educators." },
  { name: "Slowform Media", cat: "Urban", desc: "Independent climate and environment journalism.", states: ["Pan India"], geo: "Mumbai, Maharashtra", lat: 19.0409, lon: 72.8684, url: "https://www.slowform.media/", note: "Slowform Media produces independent climate and environment journalism, covering environmental stories, climate policy, and ecological issues across India." },
  { name: "Socratus", cat: "Urban", desc: "Collective wisdom through participatory methods, dialogue, and community process design.", states: ["Karnataka", "Tamil Nadu", "Rajasthan", "Madhya Pradesh"], geo: "Bengaluru, Karnataka", lat: 12.978, lon: 77.6397, url: "https://socratus.in/", note: "Socratus uses participatory methods and dialogue to facilitate collective wisdom for community problem-solving. Its approach centres on designing community processes that bring diverse voices into decision-making." },
  { name: "Sustainable Futures Collective", cat: "Urban", desc: "Climate strategy, energy transition, and public-interest systems change for a just future.", states: ["Pan India"], geo: "New Delhi, Delhi", lat: 28.6636, lon: 77.1545, url: "https://www.sustainablefutures.in/", note: "Sustainable Futures Collective works on climate strategy, energy transition, and public-interest systems change. It brings a systems lens to building a just and sustainable future." },
  { name: "SWMRT", cat: "Urban", desc: "Sustainable waste management for public health.", states: ["Karnataka"], geo: "Bengaluru, Karnataka", lat: 13.005, lon: 77.5669, url: "https://swmrt.com/", note: "SWMRT (Solid Waste Management Round Table) runs ward-level decentralised waste processing systems in Bengaluru. Its citizen-led waste governance model combines community participation with technical solutions for public health." },
  { name: "SSRDP", cat: "Urban", desc: "Benchmark sustainable development models across 14 states.", states: ["Karnataka", "Tamil Nadu", "Kerala", "Andhra Pradesh", "Telangana", "Maharashtra", "Odisha", "Jharkhand", "Bihar", "Assam", "West Bengal", "Madhya Pradesh", "Rajasthan", "Uttar Pradesh"], geo: "Bengaluru, Karnataka", lat: 12.8286, lon: 77.5121, url: "https://ssrdp.in/", note: "SSRDP (Sri Sri Rural Development Programme) creates benchmark sustainable development models across 14 states, spanning livelihoods, health, and environment. Its approach designs replicable models that can be adopted across diverse state contexts." },
  { name: "Technology for Wildlife Foundation", cat: "Urban", desc: "Conservation impact through appropriate technology.", states: ["Pan India"], geo: "Bengaluru, Karnataka", lat: 12.8853, lon: 77.4664, url: "https://tech4wildlife.org/", note: "Technology for Wildlife Foundation applies appropriate technology solutions to conservation challenges — using tools like drones, GIS, camera traps, and data systems to support wildlife protection and habitat management across India." },
  { name: "The Local Food Project (Locavore)", cat: "Urban", desc: "Food-systems storytelling, local producer networks, and community-led action for regional food cultures.", states: ["Pan India"], geo: "Mumbai, Maharashtra", lat: 19.076, lon: 72.8777, url: "https://thelocavore.in/", note: "Locavore (The Local Food Project) documents regional food cultures, connects local producers, and mobilises community-led action around food systems. It uses storytelling and producer networks to strengthen the visibility and viability of local food economies." },
  { name: "Trust for Environmental Education", cat: "Urban", desc: "Experiential learning and environmental education for children and communities.", states: ["Pan India"], geo: "Pudukkottai, Tamil Nadu", lat: 10.3763, lon: 78.8206, url: "https://rainmatter.org/partners", note: "Trust for Environmental Education runs experiential environmental learning programmes for children and communities, building ecological awareness through hands-on engagement with natural systems." },
  { name: "Udhyam Learning", cat: "Urban", desc: "Entrepreneurial mindset in young learners through large-scale school and nano-entrepreneurship programmes.", states: ["Karnataka", "Rajasthan", "Jharkhand", "Uttar Pradesh"], geo: "Bengaluru, Karnataka", lat: 12.9786, lon: 77.6174, url: "https://udhyam.org/", note: "Udhyam runs two large programmes: Udhyam Shiksha (entrepreneurial mindset curriculum for government school students) and Udhyam Vyapaar (nano-entrepreneurship support). Its Bet On Yourself philosophy centres on building grit, self-awareness, and practical problem-solving. The Istri Project helped ironing vendors switch from coal to LPG." },
  { name: "Uttarayan", cat: "Urban", desc: "Ecological restoration and wildlife corridors in South Bengal and the eastern Himalayas.", states: ["West Bengal", "Assam", "Arunachal Pradesh", "Meghalaya"], geo: "Kolkata, West Bengal", lat: 22.577, lon: 88.433, url: "https://rainmatter.org/partners", note: "Uttarayan works on ecological restoration and wildlife corridor connectivity in South Bengal and the eastern Himalayan region, combining habitat restoration with community engagement for long-term conservation outcomes." },
  { name: "Wetlands International", cat: "Urban", desc: "Conservation and management of wetlands in South Asia.", states: ["Pan India"], geo: "New Delhi, Delhi", lat: 28.5514, lon: 77.2653, url: "https://south-asia.wetlands.org/", note: "Wetlands International South Asia coordinates the Asian Waterbird Census, publishes wetland management planning manuals, and developed the WIAMS framework (Inventory, Assessment and Monitoring framework for Indian Wetlands). Its wise-use framework centres the Ramsar concept as a guiding philosophy for wetland conservation and livelihood compatibility." },
  { name: "WRI India", cat: "Urban", desc: "Urban planning, climate resilience, nature-based solutions, and urban water.", states: ["Pan India"], geo: "Bengaluru, Karnataka", lat: 12.937, lon: 77.5786, url: "https://wri-india.org/", note: "WRI India runs The Hub (a free-access portal for urban development resources), the Nurturing Neighbourhoods Challenge (child-friendly public space), and Connect Karo (annual knowledge convening). Its programmes span urban water, climate resilience, transport, and nature-based solutions." },

  // RURAL
  { name: "Akshayakalpa / Akshayakalpa Foundation", cat: "Rural", desc: "Farmer-entrepreneurship, regenerative farming, and rural livelihoods rooted in organic dairy systems.", states: ["Karnataka", "Tamil Nadu", "Telangana"], geo: "Bengaluru, Karnataka", lat: 12.8888, lon: 77.5982, url: "https://akshayakalpa.org/", note: "Akshayakalpa turns organic dairy into a farmer-entrepreneurship system spanning farm training, closed-loop production, processing infrastructure, and direct-to-consumer products. Its co-existence farming system centres on self-sustaining farms, methane generation from dung, and closed-loop soil-fodder systems." },
  { name: "Centre for Environment Concerns", cat: "Rural", desc: "Water-soil-climate innovations and resilient farming systems for drought-prone regions.", states: ["Telangana", "Andhra Pradesh"], geo: "Hyderabad, Telangana", lat: 17.399, lon: 78.4925, url: "https://cecenvis.nic.in/", note: "CEC works on tank and watershed restoration for agricultural resilience in drought-prone Telangana and Andhra Pradesh. Its dryland farming systems approach integrates water conservation, soil health, and climate-resilient cropping for semi-arid regions." },
  { name: "GOONJ", cat: "Rural", desc: "Turning underused urban material into a rural development resource with dignity.", states: ["Pan India"], geo: "New Delhi, Delhi", lat: 28.5352, lon: 77.2979, url: "https://goonj.org/", note: "GOONJ's signature Cloth for Work model rewards locally led development work with dignified material support instead of treating money as the only development input. Key initiatives include MY Pad (cloth-based sanitary pad system), School to School (education material transfer), Rahat (disaster response), and Not Just a Piece of Cloth (menstrual health)." },
  { name: "IndusTree", cat: "Rural", desc: "Sustainable livelihoods in creative manufacturing and regenerative value chains.", states: ["Karnataka", "Tamil Nadu", "Andhra Pradesh", "Madhya Pradesh", "Rajasthan", "West Bengal"], geo: "Bengaluru, Karnataka", lat: 12.9816, lon: 77.6444, url: "https://www.industree.org.in/", note: "Industree has translated women-led creative manufacturing into producer companies (GreenKraft, Ektha), market brands, and value-chain systems across bamboo, sal leaves, and banana fibre. Its 6C framework (Capacity, Capital, Create, Construct, Channels, Connect) is a named model for building producer enterprise ecosystems." },
  { name: "Lipok Social Foundation", cat: "Rural", desc: "Improving farmer livelihoods in Marathwada and Vidarbha.", states: ["Maharashtra"], geo: "Bidkin, Maharashtra", lat: 19.7187, lon: 75.2998, url: "https://lipok.org/", note: "Lipok Social Foundation provides targeted training and support for smallholder farmers in Maharashtra's most climate-stressed regions — Marathwada and Vidarbha — focusing on livelihood resilience in drought-prone areas." },
  { name: "PRADAN", cat: "Urban", desc: "Women-led livelihoods, producer collectives, and rural development systems change.", states: ["Jharkhand", "Chhattisgarh", "Madhya Pradesh", "Odisha", "Rajasthan", "West Bengal", "Bihar"], geo: "New Delhi, Delhi", lat: 28.559, lon: 77.2154, url: "https://www.pradan.net/", note: "PRADAN's named programmes — LEAP, PROWFIT, START, SAFALTA — support women farmers through market access, FPO strengthening, and socio-technical value-chain models. Its women-led producer organisation strategy combines livelihoods with gender, governance, health, climate, and skilling." },
  { name: "RCRC", cat: "Rural", desc: "Rights-based natural resource governance, climate justice, and resilient rural livelihoods.", states: ["Odisha", "Andhra Pradesh"], geo: "Bhubaneswar, Odisha", lat: 20.2571, lon: 85.8279, url: "https://rcdcindia.org/", note: "RCRC (Regional Centre for Development Cooperation) links natural-resource work with community rights, local institutions, and long-horizon resilience. Its programme stack integrates agriculture, water, tribal rights, disaster response, and environmental governance." },
  { name: "Sarjapura Curries", cat: "Rural", desc: "Food biodiversity, local greens, and community storytelling rooted in regional food systems.", states: ["Karnataka"], geo: "Sarjapura, Karnataka", lat: 12.8606, lon: 77.7872, url: "https://www.sarjapuracurries.com/", note: "Sarjapura Curries documents food biodiversity, local greens, and traditional recipes in peri-urban Karnataka. It uses food as a lens for community identity, ecology, and local knowledge systems." },
  { name: "Sauramandala Foundation", cat: "Rural", desc: "Social and economic change for remote and inaccessible communities through collaborative action.", states: ["Meghalaya"], geo: "Shillong, Meghalaya", lat: 25.5788, lon: 91.8933, url: "https://www.sauramandala.org/", note: "Sauramandala Foundation runs livelihood and social development interventions in remote Meghalaya communities. Its collaborative approach reaches geographically isolated communities that mainstream development often misses." },
  { name: "Shivganga Gram Vikas", cat: "Rural", desc: "Rural development in tribal areas through water conservation.", states: ["Madhya Pradesh"], geo: "Indore, Madhya Pradesh", lat: 22.7046, lon: 75.858, url: "https://shivganga.org/", note: "Shivganga builds check dams, ponds, and watershed structures for tribal area water security in Madhya Pradesh. Its community-managed water conservation model integrates traditional knowledge with modern techniques." },
  { name: "The Timbaktu Collective", cat: "Rural", desc: "Grassroots regeneration of drought-prone landscapes through cooperatives, organic farming, and local economies.", states: ["Andhra Pradesh"], geo: "Chennekothapalli, Andhra Pradesh", lat: 14.126, lon: 77.603, url: "https://timbaktu.org/", note: "The Timbaktu Collective combines place-based institutions, producer-facing systems, and commons restoration into a long-lived rural transformation ecosystem. Its work ties dryland regeneration, livelihoods, local democracy, and ecological restoration into a single place-based development logic." },
  { name: "Transform Rural India Foundation", cat: "Rural", desc: "Community-first rural development spanning health, nutrition, education, farm prosperity, and local governance across eight states.", states: ["Rajasthan", "Jharkhand", "Gujarat", "Madhya Pradesh", "Bihar", "Odisha", "Maharashtra", "Uttar Pradesh"], geo: "New Delhi, Delhi", lat: 28.5567, lon: 77.2423, url: "https://trif.in/", note: "Transform Rural India Foundation takes a community-first approach to rural development across health, nutrition, education, farm prosperity, and local governance. Its multi-state presence and integrated programme design make it a significant systems-change actor in rural India." },
  { name: "Vaagdhara", cat: "Rural", desc: "Farming sovereignty, child protection, and democracy in tribal regions.", states: ["Rajasthan", "Madhya Pradesh", "Gujarat"], geo: "Banswara, Rajasthan", lat: 23.5506, lon: 74.4454, url: "https://vaagdhara.org/", note: "Vaagdhara works on farming sovereignty, child protection, and grassroots democracy in tribal regions of Rajasthan, Madhya Pradesh, and Gujarat. Its approach links agricultural autonomy with broader democratic participation and child rights." },
  { name: "WASSAN", cat: "Rural", desc: "Ecological security for rainfed areas and poorer communities.", states: ["Telangana", "Andhra Pradesh", "Odisha", "Jharkhand", "Bihar", "Madhya Pradesh", "Rajasthan"], geo: "Hyderabad, Telangana", lat: 17.385, lon: 78.5686, url: "https://wassan.org/", note: "WASSAN anchors the Odisha Millet Mission as programme secretariat, serves as national hub for the Revitalising Rainfed Agriculture Network, and anchors the National Coalition on Natural Farming. Its Practice-Research-Policy approach links rainfed landscapes to public systems." },
  { name: "SwaYYam", cat: "Rural", desc: "Permaculture and agroecology collective regenerating degraded farmland through farmer collectives, tree-planting, and food sovereignty.", states: ["Karnataka"], geo: "Bandipur, Karnataka", lat: 11.67, lon: 76.63, url: "https://rainmatter.org/partners", note: "SwaYYam is a permaculture and agroecology collective regenerating degraded farmland through farmer collectives, tree-planting, and food sovereignty approaches in the Bandipur region of Karnataka." },

  // CONSERVATION
  { name: "A Rocha India", cat: "CnR", desc: "Conservation of nature and wildlife through research, education, and sustainability.", states: ["Karnataka", "Tamil Nadu"], geo: "Bengaluru, Karnataka", lat: 12.8169, lon: 77.5667, url: "https://www.arocha.in/", note: "A Rocha India's Primary Response Team is a structured first-response arrangement with forest authorities to reduce human-elephant conflict. It runs environmental education programmes, health and hygiene camps for conflict-prone communities, and builds conservation support through community-based stewardship." },
  { name: "ATREE", cat: "CnR", desc: "Environmental research, conservation, and socially just development across key landscapes.", states: ["Karnataka", "Kerala", "Tamil Nadu", "West Bengal", "Sikkim", "Arunachal Pradesh", "Jharkhand", "Odisha", "Chhattisgarh", "Madhya Pradesh", "Maharashtra", "Telangana"], geo: "Bengaluru, Karnataka", lat: 13.0643, lon: 77.6202, url: "https://www.atree.org/", note: "ATREE (Ashoka Trust for Research in Ecology and the Environment) publishes the India Biodiversity Portal, runs Community Conservation Centres, the Ecoinformatics Lab, and the Lantana Craft Centre. Its Academy for Conservation Science offers PhD, MSc, and certificate programmes, and its knowledge commons approach translates ecological research into usable planning frameworks." },
  { name: "Dakshin Foundation", cat: "CnR", desc: "Marine and coastal conservation linked to livelihoods, wellbeing, and environmental justice.", states: ["Karnataka", "Odisha", "Maharashtra", "Andaman and Nicobar Islands", "Lakshadweep"], geo: "Bengaluru, Karnataka", lat: 13.0601, lon: 77.5857, url: "https://www.dakshin.org/", note: "Dakshin Foundation runs the Andaman Nicobar Environment Team (ANET), ReefLog and LTEO monitoring, Lagoon Fest, and the SeaChange intersectoral model for coastal socio-ecological change. Its #KhaneKeLiyeBachao philosophy ties food, livelihoods, and ecological sustainability into a rights-based conservation approach." },
  { name: "Ecological Restoration Alliance", cat: "CnR", desc: "Collaborative network for ecological restoration practice, learning, and open knowledge across Indian ecoregions.", states: ["Pan India"], geo: "Valparai, Tamil Nadu", lat: 10.3278, lon: 76.9558, url: "https://era-india.org/", note: "ERA connects restoration practitioners across India for knowledge exchange and shared protocols. It builds shared learning and practice standards for ecological restoration across diverse Indian landscapes." },
  { name: "Keystone Foundation", cat: "Urban", desc: "Socio-ecological resilience for indigenous and local communities in the Nilgiri Biosphere.", states: ["Tamil Nadu", "Kerala", "Karnataka"], geo: "Kotagiri, Tamil Nadu", lat: 11.4307, lon: 76.8591, url: "https://keystonefoundation.org/", note: "Keystone Foundation has built a cluster of sister enterprises: Aadhimalai (indigenous producer company), Last Forest (social enterprise for wild honey), Nilgiri Field Learning Centre, Radio Kotagiri, and the Honey Portal. Its model incubates producer companies and enterprises rather than limiting itself to short-cycle projects." },
  { name: "Malabar Wildlife Rescue", cat: "CnR", desc: "Wildlife education, rescue, and rehabilitation.", states: ["Kerala"], geo: "Kannur, Kerala", lat: 11.8872, lon: 75.372, url: "https://www.facebook.com/marcforwildlife/", note: "Malabar Wildlife Rescue provides active rescue, treatment, and rehabilitation of injured and orphaned wildlife in Kerala. Its public education programmes build awareness and coexistence with local wildlife." },
  { name: "Munnarakkunnu Trust", cat: "Urban", desc: "Plant conservation, rainforest regeneration, and nature education.", states: ["Karnataka"], geo: "Bengaluru, Karnataka", lat: 12.9267, lon: 77.5598, url: "https://gbsanctuary.org/munnarakkunnu/", note: "Munnarakkunnu Trust works on rainforest regeneration and native plant conservation in Karnataka, combining hands-on conservation with ecological learning programmes." },
  { name: "Nature Conservation Foundation", cat: "CnR", desc: "Research-driven conservation across wildlife, habitats, and human-nature relationships.", states: ["Karnataka", "Kerala", "Tamil Nadu", "Goa", "Maharashtra", "Arunachal Pradesh", "Assam", "Himachal Pradesh", "Jammu and Kashmir"], geo: "Mysuru, Karnataka", lat: 12.3312, lon: 76.6112, url: "https://www.ncf-india.org/", note: "NCF's public artefacts include Hornbill Watch (citizen-science initiative), Biodiversity Basics (online natural history course), and EcoQuest (nature discovery centre). Its CEROS platform brings together community ecology and restoration work across multiple biodiversity hotspots, and its Nature Guide Training Course creates livelihood pathways through conservation." },
  { name: "Palar Guttahalli Eco-restoration Program", cat: "CnR", desc: "Eco-restoration of the upper Palar River basin through riverine afforestation, groundwater recharge, and community-led landscape recovery.", states: ["Karnataka"], geo: "Kaiwara, Karnataka", lat: 13.4, lon: 77.8, url: "https://rainmatter.org/partners", note: "Palar Guttahalli Eco-restoration Program works on eco-restoration of the upper Palar River basin through riverine afforestation, groundwater recharge, and community-led landscape recovery in Karnataka." },
  { name: "Sahjeevan", cat: "CnR", desc: "Empowering self-sustaining communities with grassroots leadership.", states: ["Gujarat"], geo: "Bhuj, Gujarat", lat: 23.243, lon: 69.674, url: "https://sahjeevan.org/", note: "Sahjeevan's work spans milk and dairy value-chain interventions across cow, buffalo, camel, sheep, and goat products; community institutions and producer organisations; and Biological Management Committees with People's Biodiversity Registers. Its Communities-Institutions-Advocacy framework centres on commons governance and pastoral livelihoods." },
  { name: "School of Ecological Nurturance (SEN)", cat: "CnR", desc: "Apprenticeship-based ecological learning emerging from Gurukula and allied landscape organisations.", states: ["Kerala", "Tamil Nadu", "Karnataka"], geo: "Periya, Kerala", lat: 12.2726, lon: 75.8853, url: "https://gbsanctuary.org/", note: "SEN offers hands-on apprenticeships in conservation, restoration, and ecological practice, emerging from the Gurukula Botanical Sanctuary and allied organisations in the Western Ghats. Its place-based pedagogy centres on learning through direct participation in landscape stewardship." },
  { name: "The Shola Trust", cat: "CnR", desc: "Nature conservation in the Nilgiri region, focused on shola-grassland ecosystems.", states: ["Tamil Nadu", "Kerala", "Karnataka"], geo: "Gudalur, Tamil Nadu", lat: 11.4974, lon: 76.4941, url: "https://thesholatrust.org/", note: "The Shola Trust works on conservation of the unique shola-grassland ecosystems of the Nilgiri Biosphere Reserve, combining ecological research, community engagement, and habitat restoration." },
  { name: "Wildlife Conservation Society India", cat: "CnR", desc: "Conservation science, communities, and biodiversity protection across key landscapes.", states: ["Gujarat", "Maharashtra", "Goa", "Karnataka", "Kerala", "Tamil Nadu", "Nagaland"], geo: "Bengaluru, Karnataka", lat: 13.0697, lon: 77.5823, url: "https://india.wcs.org/", note: "WCS-India anchors the Western Ghats landscape programme, Counter Wildlife Trafficking training modules, the Dhole conservation roadmap, and rights-and-communities work in the Central Western Ghats. It turns field science into landscape programmes, training modules, outreach resources, and species-focused conservation roadmaps." },
  { name: "Youth Conservation Action Network (YouCAN)", cat: "CnR", desc: "Fellowships and nature education to build a new generation of community-rooted environmental educators.", states: ["Pan India"], geo: "Coonoor, Tamil Nadu", lat: 11.353, lon: 76.7959, url: "https://youcan.in/", note: "YouCAN runs fellowships and nature education programmes to build a new generation of community-rooted environmental educators. Its approach centres on experiential learning and mentorship to grow conservation leadership." },

  // RESEARCH / OTHER
  { name: "Fields of View", cat: "Urban", desc: "Tools and simulations to understand complexity in policy landscapes.", states: ["Karnataka"], geo: "Bengaluru, Karnataka", lat: 12.9126, lon: 77.5902, url: "https://fieldsofview.in/", note: "Fields of View is unusually explicit about its artefact stack: E-QLT (household-vulnerability simulation), Jee-van (data-collection game), Weather Wane (climate-risk game), and The Waymaker (storytelling game). Its PolicyLab researches and designs games at the intersection of art, social sciences, and technology, while School of Policy trains practitioners to use these tools." },
  { name: "IIHS", cat: "Buildings", desc: "Indian Institute of Human Settlements — interdisciplinary urban research, teaching, and practice.", states: ["Karnataka", "Tamil Nadu", "Maharashtra"], geo: "Bengaluru, Karnataka", lat: 12.9976, lon: 77.5676, url: "https://iihs.co.in/", note: "IIHS produces the Urban Atlas for India (comparative land-use dataset for 100 cities), Knowledge Gateway (open research repository), Media Lab (audio-visual archive), and Geospatial Lab. Its Urban Fellows Programme, Word Lab, and Kengeri campus as living lab make it a comprehensive urban knowledge institution." },
  { name: "M.S.Swaminathan Research", cat: "Urban", desc: "Science-driven research for sustainable rural development.", states: ["Tamil Nadu", "Kerala", "Odisha", "Andhra Pradesh", "Jharkhand", "Maharashtra"], geo: "Chennai, Tamil Nadu", lat: 12.9973, lon: 80.2469, url: "https://www.mssrf.org/", note: "MSSRF's infrastructure includes Village Resource Centres and Village Knowledge Centres, Fish for All Research and Training Centre, the Community Agrobiodiversity Centre and MSSBG in Wayanad, and the Biju Patnaik Tribal Agrobiodiversity Centre in Jeypore. Its approach positions science as a grassroots capability for resilient ecosystems, food security, and climate adaptation." },
  { name: "WELL Labs", cat: "Urban", desc: "Interdisciplinary knowledge and applied research for water, environment, and social systems.", states: ["Tamil Nadu", "Odisha", "Andhra Pradesh", "Telangana"], geo: "Bengaluru, Karnataka", lat: 12.9452, lon: 77.5763, url: "https://welllabs.org/", note: "WELL Labs generates interdisciplinary knowledge and applied research for water, environment, and social systems. Its work bridges science, communities, and policy for evidence-based environmental decision-making." },
  { name: "Veditum India", cat: "Urban", desc: "River ecosystems, freshwater resources, and biodiversity documentation through walking expeditions.", states: ["Pan India"], geo: "Kolkata, West Bengal", lat: 22.5803, lon: 88.3545, url: "https://veditum.org/", note: "Veditum's flagship Moving Upstream series walks along rivers to build public records, documentaries, data archives, and field-based evidence. Other artefacts include India Sand Watch, the Moving Upstream Fellowship, and the Life along River Ken colouring series. It works at the intersection of environment, culture, society, and media." },
  { name: "Waste Warriors", cat: "Urban", desc: "Waste management in the Indian Himalayan Region.", states: ["Uttarakhand", "Himachal Pradesh", "Goa"], geo: "Dehradun, Uttarakhand", lat: 30.3613, lon: 78.0671, url: "https://wastewarriors.org/", note: "Waste Warriors runs a structured Zero Waste Program helping governments build collection systems, processing infrastructure, and MRFs; Aviral (river-plastic initiative in the Ganga corridor); Create to Inspire (school education programme); and Dignified Livelihoods through SHGs and upcycling. It complements operations with community activation and an advocacy wing for the eco-sensitive Himalayan region." },
  { name: "Oorvani Foundation", cat: "Urban", desc: "Connecting people with civic information for better cities through media, data, and learning.", states: ["Karnataka"], geo: "Bengaluru, Karnataka", lat: 12.9946, lon: 77.5889, url: "https://oorvani.org/", note: "Oorvani Foundation runs Citizen Matters (civic media platform), Open City (urban data commons), and the Civic Learning Hub (workshops, datajams, hackathons). Its three-step changemaking process — sensemaking, strengthening agency, problem solving — links information, data, resources, and networks so citizens can move from understanding to action." },

  // SPECIAL: Platform Commons
  { name: "Platform for Commons", cat: "Urban", desc: "Systemic digital and organisational infrastructure for commoning and social change.", states: ["Pan India"], geo: "Bengaluru, Karnataka", lat: 13.0564, lon: 77.5938, url: "https://platformcommons.org/", note: "Platform Commons has built The Commons Platform (multi-tenant, multilingual, offline-first digital infrastructure), Better Together (volunteer management), Commons Shiksha (ed-tech), and Commons Academy (practice-based learning). Its Platform Commons License articulates equitability, community ownership, and self-determination as platform principles." },
]

// SKIP: organizations already in Soochi
const skip = new Set([
  'Rainmatter Foundation',
  'Samagata Foundation', 
  'Tech4Good Community',
  'Vidhi Centre for Legal Policy',
  'People\'s Archive of Rural India',
  'Vidhi Centre'
])

let created = 0
let skipped = 0

for (const p of partners) {
  const name = p.name
  // Skip duplicates / existing
  const existingNames = [
    'Samagata Foundation', 'Rainmatter Foundation', 'Tech4Good Community',
    'Vidhi Centre for Legal Policy', 'People\'s Archive of Rural India',
    'Vidhi Centre (Delhi)', 'Vidhi Centre (Bengaluru)'
  ]
  if (existingNames.some(en => name.includes(en) || en.includes(name?.split('/')[0]?.trim()))) {
    if (name === 'Oorvani Foundation') {
      // Oorvani is NOT in Soochi (Ooru is different), so DO create it
    } else {
      console.log(`SKIP (already in Soochi): ${name}`)
      skipped++
      continue
    }
  }

  const slug = slugify(name)
  const file = `${entriesDir}/${slug}.md`
  
  if (existsSync(file) && !dryRun) {
    console.log(`SKIP (file exists): ${name} → ${slug}.md`)
    skipped++
    continue
  }

  const entry = {
    name,
    url: p.url,
    blurb: p.desc?.length > 160 ? p.desc.slice(0, 157) + '...' : p.desc,
    kind: 'organisation',
    orgType: 'nonprofit',
    topics: mapTopics(p.cat, p.desc),
    geography: mapGeography(p.states),
    licensing: 'unknown',
    access: 'free',
    location: {
      city: p.geo?.split(',')[0]?.trim(),
      region: p.geo?.split(',')[1]?.trim(),
      lat: p.lat,
      lng: p.lon,
    },
    links: p.url && p.url !== 'https://rainmatter.org/partners' ? [
      { label: 'Website', url: p.url }
    ] : [],
    note: p.note || p.desc,
  }

  const md = toMarkdown(entry)
  
  if (dryRun) {
    console.log(`WOULD CREATE: ${name} → ${slug}.md`)
    console.log(`  url: ${p.url}`)
    console.log(`  topics: ${entry.topics}`)
  } else {
    writeFileSync(file, md, 'utf-8')
    console.log(`CREATED: ${name} → ${slug}.md`)
  }
  created++
}

console.log(`\n---`)
console.log(`Created: ${created}, Skipped: ${skipped}`)
