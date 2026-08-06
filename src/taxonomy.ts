/**
 * The controlled vocabulary.
 *
 * Everything here is a closed list. An open `tags` field is how
 * directories rot: within fifty entries you have "open-data", "opendata"
 * and "Open Data" and the filters stop meaning anything. Adding a term is
 * a conscious edit to this file, reviewed like any other change.
 *
 * Order matters — it is the order facets appear in the index rail, and
 * for KINDS it also fixes the colour each one gets.
 */

/**
 * What kind of thing an entry is. Mutually exclusive by design.
 *
 * `dataset` and `directory` are separated by one question: does the data
 * live here, or does this only point at it? A national statistics service
 * and a single survey are both `dataset` — the size of the holding is a
 * fact for the blurb, not a facet anyone filters on. `directory` is for
 * things whose entire payload is links.
 *
 * This replaced a `portal` kind that meant both at once, and had grown to
 * over half the index — a kind that large is a kind that has stopped
 * telling you anything.
 */
export const KINDS = {
  organisation: 'Organisation',
  dataset: 'Data source',
  directory: 'Directory',
  tool: 'Tool',
  publication: 'Publication',
  dashboard: 'Dashboard',
  archive: 'Archive',
  community: 'Community',
} as const

/**
 * One line per kind, in the second person, saying what you would do with
 * it. Shown on the about page and in the contribution form so a
 * submitter picks the right one without guessing.
 */
export const KIND_NOTES: Record<keyof typeof KINDS, string> = {
  organisation: 'A body doing the work — research, advocacy, service delivery',
  dataset: 'Data you can download or query here — one survey or a whole statistical service',
  directory: 'A curated list that sends you elsewhere — it holds links, not data',
  tool: 'Software you run to do a job',
  publication: 'Writing and reporting you read',
  dashboard: 'A live view of data someone else keeps current',
  archive: 'A record kept so it is not lost',
  community: 'People to ask, and a place to ask them',
}

/** Who runs it. Optional — it does not apply cleanly to every kind. */
export const ORG_TYPES = {
  nonprofit: 'Non-profit',
  government: 'Government',
  academic: 'Academic',
  multilateral: 'Multilateral',
  commercial: 'Commercial',
  individual: 'Individual',
  collective: 'Collective',
} as const

/**
 * Subject matter.
 *
 * Thirty terms is more than a person can hold in their head as a flat
 * list, so the UI groups them (see TOPIC_GROUPS). The grouping is
 * presentational only — there is no parent field on an entry. That keeps
 * the door open to real hierarchical filtering later without re-tagging
 * a single file.
 */
export const TOPICS = {
  // People
  'health': 'Health',
  'nutrition': 'Nutrition',
  'education': 'Education',
  'gender': 'Gender',
  'caste': 'Caste',
  'disability': 'Disability',
  'migration': 'Migration',
  'welfare': 'Welfare',
  // Work & money
  'labour': 'Labour',
  'economy': 'Economy',
  'public-finance': 'Public finance',
  'philanthropy': 'Philanthropy',
  // Land & nature
  'agriculture': 'Agriculture',
  'land': 'Land',
  'environment': 'Environment',
  'climate': 'Climate',
  'energy': 'Energy',
  'water': 'Water',
  'disasters': 'Disasters',
  // Cities
  'cities': 'Cities',
  'housing': 'Housing',
  'transport': 'Transport',
  // Governance
  'governance': 'Governance',
  'transparency': 'Transparency',
  'elections': 'Elections',
  'justice': 'Law & policing',
  'rights': 'Rights',
  // Information
  'media': 'Media',
  'technology': 'Technology',
  'demography': 'Demography',
  'culture': 'Culture & heritage',
} as const

/**
 * Presentational grouping for the rail and the contribution form. Not a
 * field on any entry — purely how the thirty terms are laid out so a
 * contributor can find the right one.
 */
export const TOPIC_GROUPS: { label: string; topics: (keyof typeof TOPICS)[] }[] = [
  { label: 'People & society', topics: ['health', 'nutrition', 'education', 'gender', 'caste', 'disability', 'migration', 'welfare'] },
  { label: 'Work & money', topics: ['labour', 'economy', 'public-finance', 'philanthropy'] },
  { label: 'Land & nature', topics: ['agriculture', 'land', 'environment', 'climate', 'energy', 'water', 'disasters'] },
  { label: 'Cities', topics: ['cities', 'housing', 'transport'] },
  { label: 'Governance', topics: ['governance', 'transparency', 'elections', 'justice', 'rights'] },
  { label: 'Information', topics: ['media', 'technology', 'demography', 'culture'] },
]

/**
 * Where the work applies — not where the organisation sits.
 *
 * Indian entries carry states, because states are what the country
 * actually administers, funds and publishes data for. The directional
 * regions this replaced ("South India") are not units anyone reports
 * against, and left a Karnataka-wide organisation unable to say so.
 * Sub-national work should carry its state *and* `india`.
 *
 * `global` and a country are not mutually exclusive. `global` states the
 * scope; adding `india` says "has usable India-level detail" — a World
 * Bank series with an India breakout genuinely applies to India, and
 * someone filtering for India wants to find it. Add the country only
 * where the country-level data is actually there and worth using, not to
 * everything that happens to include India in a worldwide total.
 */
export const GEOGRAPHIES = {
  'india': 'India',

  'andhra-pradesh': 'Andhra Pradesh',
  'arunachal-pradesh': 'Arunachal Pradesh',
  'assam': 'Assam',
  'bihar': 'Bihar',
  'chhattisgarh': 'Chhattisgarh',
  'goa': 'Goa',
  'gujarat': 'Gujarat',
  'haryana': 'Haryana',
  'himachal-pradesh': 'Himachal Pradesh',
  'jharkhand': 'Jharkhand',
  'karnataka': 'Karnataka',
  'kerala': 'Kerala',
  'madhya-pradesh': 'Madhya Pradesh',
  'maharashtra': 'Maharashtra',
  'manipur': 'Manipur',
  'meghalaya': 'Meghalaya',
  'mizoram': 'Mizoram',
  'nagaland': 'Nagaland',
  'odisha': 'Odisha',
  'punjab': 'Punjab',
  'rajasthan': 'Rajasthan',
  'sikkim': 'Sikkim',
  'tamil-nadu': 'Tamil Nadu',
  'telangana': 'Telangana',
  'tripura': 'Tripura',
  'uttar-pradesh': 'Uttar Pradesh',
  'uttarakhand': 'Uttarakhand',
  'west-bengal': 'West Bengal',

  'andaman-nicobar': 'Andaman & Nicobar Islands',
  'chandigarh': 'Chandigarh',
  'dadra-nagar-haveli-daman-diu': 'Dadra & Nagar Haveli and Daman & Diu',
  'delhi': 'Delhi',
  'jammu-kashmir': 'Jammu & Kashmir',
  'ladakh': 'Ladakh',
  'lakshadweep': 'Lakshadweep',
  'puducherry': 'Puducherry',

  'global': 'Global',
  'asia': 'Asia',
  'africa': 'Africa',
  'europe': 'Europe',
  'north-america': 'North America',
  'south-america': 'South America',
  'oceania': 'Oceania',
} as const

/** Presentational grouping for the geography facet. */
export const GEOGRAPHY_GROUPS: { label: string; test: (k: keyof typeof GEOGRAPHIES) => boolean }[] = [
  { label: 'India', test: (k) => k === 'india' },
  {
    label: 'States & union territories',
    test: (k) => !['india', 'global', 'asia', 'africa', 'europe', 'north-america', 'south-america', 'oceania'].includes(k),
  },
  { label: 'Elsewhere', test: (k) => ['global', 'asia', 'africa', 'europe', 'north-america', 'south-america', 'oceania'].includes(k) },
]

/**
 * How the thing is licensed. Split from ACCESS because they are
 * independent: most free tools are proprietary, and an open-licensed
 * archive can still sit behind a login. Muddling them into one list made
 * "free" an unreliable filter.
 */
export const LICENSING = {
  open: 'Open licence',
  'partly-open': 'Partly open',
  proprietary: 'Proprietary',
  unknown: 'Licence unclear',
} as const

/** What it costs you to get in. */
export const ACCESS = {
  free: 'Free',
  registration: 'Registration required',
  paid: 'Paid',
} as const

/** Whether the thing is still alive. Dead entries stay in the repo. */
export const STATUSES = {
  live: 'Live',
  dormant: 'Dormant',
  dead: 'Dead',
} as const

export type Kind = keyof typeof KINDS
export type OrgType = keyof typeof ORG_TYPES
export type Topic = keyof typeof TOPICS
export type Geography = keyof typeof GEOGRAPHIES
export type Licensing = keyof typeof LICENSING
export type Access = keyof typeof ACCESS
export type Status = keyof typeof STATUSES

export const keysOf = <T extends object>(o: T) =>
  Object.keys(o) as [keyof T, ...(keyof T)[]]
