/**
 * Add curated open data & research resources from Bhuvan's priority list
 * node scripts/generate-open-data.mjs [--dry]
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

function make(entry) {
  const L = ['---']
  L.push(`name: ${q(entry.name)}`, `url: ${q(entry.url)}`, `blurb: ${q(entry.blurb)}`, `kind: ${entry.kind}`)
  if (entry.orgType) L.push(`orgType: ${entry.orgType}`)
  L.push(`topics: ${list(entry.topics)}`, `geography: ${list(entry.geography)}`)
  if (entry.licensing) L.push(`licensing: ${entry.licensing}`)
  if (entry.access) L.push(`access: ${entry.access}`)
  if (entry.license) L.push(`license: ${q(entry.license)}`)
  if (entry.links?.length) { L.push('links:'); for (const l of entry.links) L.push(`  - label: ${q(l.label)}`, `    url: ${q(l.url)}`) }
  if (entry.retrieval) {
    L.push('retrieval:')
    if (entry.retrieval.api) L.push(`  api: true`)
    if (entry.retrieval.apiUrl) L.push(`  apiUrl: ${q(entry.retrieval.apiUrl)}`)
    if (entry.retrieval.bulkDownload !== undefined) L.push(`  bulkDownload: ${entry.retrieval.bulkDownload}`)
    if (entry.retrieval.formats?.length) L.push(`  formats: ${list(entry.retrieval.formats)}`)
  }
  if (entry.coverage) {
    L.push('coverage:')
    if (entry.coverage.from) L.push(`  from: ${entry.coverage.from}`)
    if (entry.coverage.to) L.push(`  to: ${entry.coverage.to}`)
    if (entry.coverage.updated) L.push(`  updated: ${entry.coverage.updated}`)
  }
  L.push(`added: "2026-08-07"`)
  L.push('status: live', '---')
  if (entry.note) L.push('', entry.note, '')
  return L.join('\n')
}

const entries = [
  {
    name: "Smart Cities Mission Data Portal",
    url: "https://smartcities.data.gov.in/",
    blurb: "Thousands of datasets contributed by participating Indian cities covering urban infrastructure, services, mobility, environment, and governance",
    kind: "dataset",
    orgType: "government",
    topics: ["cities", "governance", "transport", "technology"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, bulkDownload: true, formats: ["csv", "json", "xlsx"] },
    coverage: { from: 2015, updated: "irregular" },
    note: "A surprisingly obscure portal — 100 Indian cities contribute datasets on air quality, water supply, solid waste, mobility, housing, safety, and urban finance. The platform uses the same CKAN-based infrastructure as data.gov.in, meaning datasets are API-accessible. Particularly valuable for cross-city comparisons and for finding data from tier-2 cities that rarely publish structured open data. The Smart Cities Mission has a separate dashboard at smartcities.gov.in for project-level progress tracking."
  },
  {
    name: "Landsat Data Access (USGS)",
    url: "https://www.usgs.gov/landsat-missions/landsat-data-access",
    blurb: "Decades of free satellite imagery from the Landsat programme — the longest continuous Earth observation record, essential for studying change over time",
    kind: "dataset",
    orgType: "government",
    topics: ["land", "environment", "agriculture", "water"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, apiUrl: "https://m2m.cr.usgs.gov/", bulkDownload: true, formats: ["geotiff"] },
    coverage: { from: 1972, updated: "daily" },
    note: "Landsat provides the longest continuous space-based record of Earth's land surface — from 1972 to present at 30 m resolution (15 m panchromatic). For India, this is the go-to source for studying urban expansion, deforestation, water body change, agricultural land conversion, coastal erosion, and glacial retreat over five decades. Accessible through USGS EarthExplorer, the M2M API, and Google Earth Engine. Landsat 8 and 9 (currently operational) provide 8-day revisit. Landsat Next will bring 10 m resolution and 6-day revisit starting around 2031."
  },
  {
    name: "NASA Earthdata",
    url: "https://www.earthdata.nasa.gov/",
    blurb: "NASA's gateway to Earth observation data — fires, vegetation, rainfall, temperature, oceans, ice, and 1,000+ imagery layers through Worldview",
    kind: "dataset",
    orgType: "government",
    topics: ["climate", "environment", "land", "disasters"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, apiUrl: "https://www.earthdata.nasa.gov/engage/apps", bulkDownload: true, formats: ["netcdf", "geotiff", "hdf"] },
    coverage: { from: 1970, updated: "daily" },
    note: "An enormous umbrella covering MODIS, VIIRS, SRTM, GPM, GRACE, and dozens of other instruments. The NASA Worldview browser exposes 1,000+ global imagery layers — daily snapshots of fires, floods, aerosols, vegetation health, sea surface temperature, and much more. For India-specific research: MODIS burned area (fire tracking), SRTM elevation data, GPM IMERG rainfall, and MODIS NDVI for vegetation health. The Earthdata API and Common Metadata Repository provide programmatic access. Free NASA Earthdata login required."
  },
  {
    name: "Global Human Settlement Layer (GHSL)",
    url: "https://human-settlement.emergency.copernicus.eu/",
    blurb: "Maps built-up areas, settlement types, and population density over four decades — essential for studying how cities expand through time",
    kind: "dataset",
    orgType: "multilateral",
    topics: ["cities", "housing", "demography", "land"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: false, bulkDownload: true, formats: ["geotiff"] },
    coverage: { from: 1975, updated: "irregular" },
    note: "GHSL is produced by the European Commission's Joint Research Centre and is one of the most useful datasets for civic researchers studying urbanisation. It provides gridded data on built-up areas, settlement typologies (from rural hamlets to megacities), and population distribution at 100 m to 1 km resolution, with time series from 1975 to 2030 (projected). For India, GHSL lets you trace the expansion of every city, quantify peri-urban growth, and map where people live in relation to infrastructure — all in a consistent global framework. The GHSL Data Package 2023 covers 1975-2030 in 5-year steps."
  },
  {
    name: "WorldPop",
    url: "https://www.worldpop.org/",
    blurb: "High-resolution gridded population estimates — 100 m resolution maps of how many people live where, updated yearly, essential for accessibility and service-delivery research",
    kind: "dataset",
    orgType: "academic",
    topics: ["demography", "health", "cities"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    license: "CC BY 4.0",
    retrieval: { api: false, bulkDownload: true, formats: ["geotiff", "csv"] },
    coverage: { from: 2000, updated: "annually" },
    note: "WorldPop produces 100 m resolution gridded population estimates for every country, including India. Unlike census data (which gives you district-level totals), WorldPop maps where people actually live within those districts — essential for calculating how many people live within 5 km of a health facility, in a flood zone, or beyond a road network. For India, the constrained and unconstrained datasets use different methods for allocating population to grid cells. The WorldPop Open Population Repository also hosts gridded age/sex structures, births, pregnancies, and poverty maps."
  },
  {
    name: "ERA5-Land",
    url: "https://cds.climate.copernicus.eu/datasets/reanalysis-era5-land",
    blurb: "Enhanced-resolution land-surface reanalysis — temperature, rainfall, soil moisture, and evaporation at 9 km, from 1950 to near-present, complementary to ERA5",
    kind: "dataset",
    orgType: "multilateral",
    topics: ["climate", "land", "agriculture", "water"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    license: "Copernicus Licence",
    retrieval: { api: true, apiUrl: "https://cds.climate.copernicus.eu/api-how-to", bulkDownload: true, formats: ["netcdf", "grib"] },
    coverage: { from: 1950, updated: "monthly" },
    note: "ERA5-Land is the land-focused, higher-resolution sibling of ERA5. At 9 km (versus ERA5's 31 km), it provides finer detail for temperature, precipitation, soil moisture, evaporation, runoff, and other land-surface variables from 1950 onwards. For India, the resolution improvement is significant: ERA5-Land better captures the Western Ghats orographic rainfall gradient, local temperature variations, and soil moisture patterns that coarser reanalysis smooths out. It uses the same underlying atmospheric forcing as ERA5 but runs a dedicated land-surface model at higher resolution. Accessible through the same CDS API."
  },
  {
    name: "CHIRPS Rainfall Data",
    url: "https://www.chc.ucsb.edu/data/chirps",
    blurb: "High-resolution rainfall estimates combining satellite observations and rain gauge data — 40+ years of quasi-global precipitation at 0.05° resolution, updated daily",
    kind: "dataset",
    orgType: "academic",
    topics: ["climate", "agriculture", "water", "disasters"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, apiUrl: "https://data.chc.ucsb.edu/products/CHIRPS-2.0/", bulkDownload: true, formats: ["geotiff", "netcdf"] },
    coverage: { from: 1981, updated: "daily" },
    note: "CHIRPS (Climate Hazards Group InfraRed Precipitation with Station data) is one of the most widely used datasets in development research. At 0.05° (~5.5 km) resolution with daily data from 1981, it is ideal for drought monitoring, crop yield analysis, flood early warning, and food security research. CHIRPS3 (released 2025) extends coverage to 1983-present with improved algorithms and global coverage beyond 50° latitude. For India, CHIRPS matches well with IMD station data and is the standard rainfall input for FEWS NET famine early warning. Combine with AGMARKNET mandi prices or MGNREGA wage data for powerful rural distress analysis."
  },
  {
    name: "NASA FIRMS",
    url: "https://firms.modaps.eosdis.nasa.gov/",
    blurb: "Satellite-detected fires and thermal anomalies in near-real-time — the standard source for tracking forest fires, crop burning, and industrial hotspots",
    kind: "dashboard",
    orgType: "government",
    topics: ["environment", "climate", "agriculture", "disasters"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, apiUrl: "https://firms.modaps.eosdis.nasa.gov/api/", bulkDownload: true, formats: ["csv", "json", "geojson"] },
    coverage: { from: 2000, updated: "daily" },
    note: "FIRMS (Fire Information for Resource Management System) distributes near-real-time active fire data from the MODIS and VIIRS satellite instruments. For India, FIRMS is the primary data source for tracking crop residue burning in Punjab and Haryana (the annual stubble-burning crisis), forest fires in the Western Ghats and Central India, and industrial thermal anomalies. The 3-hourly VIIRS data detects fires as small as a few hundred square metres. The Fire Map and API provide data within 3 hours of satellite overpass. Essential for environmental journalism and air pollution research."
  },
  {
    name: "OpenAQ",
    url: "https://openaq.org/",
    blurb: "Aggregated ground-level air quality measurements from 150+ countries — harmonised, API-accessible, and far easier to work with than individual government portals",
    kind: "dataset",
    orgType: "nonprofit",
    topics: ["environment", "health", "cities"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, apiUrl: "https://docs.openaq.org/", bulkDownload: true, formats: ["csv", "json"] },
    coverage: { from: 2015, updated: "live" },
    note: "OpenAQ is the single best starting point for anyone doing air pollution research in India. It aggregates PM2.5, PM10, NO₂, SO₂, CO, O₃, and BC data from government monitoring networks (CPCB in India), low-cost sensors, and reference-grade instruments worldwide — all harmonised to a common format with a fast REST API. For India, this means you query data from Delhi, Kanpur, Bengaluru, and Mumbai in the same API call with the same units and quality flags, instead of wrangling separate state PCB portals. The platform is free, community-governed, and powers most air quality apps and research papers."
  },
  {
    name: "Copernicus Atmosphere Monitoring Service (CAMS)",
    url: "https://atmosphere.copernicus.eu/",
    blurb: "Global atmospheric composition — aerosols, reactive gases, greenhouse gases, wildfire emissions, and air quality forecasts, from the EU's Copernicus programme",
    kind: "dataset",
    orgType: "multilateral",
    topics: ["climate", "environment", "health"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    license: "Copernicus Licence",
    retrieval: { api: true, apiUrl: "https://ads.atmosphere.copernicus.eu/api-how-to", bulkDownload: true, formats: ["netcdf", "grib"] },
    coverage: { from: 2003, updated: "daily" },
    note: "CAMS provides global and regional atmospheric composition data — including PM2.5, PM10, NO₂, O₃, SO₂, CO, methane, and aerosol optical depth — from satellite instruments, ground observations, and model reanalysis. For India, CAMS global forecasts (at ~40 km) and regional European forecasts are the main relevant products. The CAMS reanalysis (EAC4) goes back to 2003. Companion to Sentinel-5P satellite data on atmospheric constituents. Particularly useful when you need consistent atmospheric data across a region where ground monitors are sparse."
  },
  {
    name: "Ember Energy Data Explorer",
    url: "https://ember-energy.org/data/",
    blurb: "Open electricity data for 200+ geographies — generation by source, capacity, emissions, and imports, with monthly data for key countries including India",
    kind: "dataset",
    orgType: "nonprofit",
    topics: ["energy", "climate", "economy"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    license: "CC BY 4.0",
    retrieval: { api: false, bulkDownload: true, formats: ["csv", "xlsx"] },
    coverage: { from: 2000, updated: "annually" },
    note: "Ember is the premier open-data think tank for electricity transitions. Its Electricity Data Explorer provides yearly generation by source (coal, gas, nuclear, hydro, solar, wind, bioenergy, other renewables), installed capacity, demand, emissions intensity, and per-capita generation for 200+ geographies. For India, monthly data is available from 2018. Ember's Global Electricity Review and India-specific reports are the most-cited open-source references on power-sector decarbonisation. Particularly valuable because Indian power data is fragmented across CEA, POSOCO, NPP, and state utilities — Ember does the integration."
  },
  {
    name: "Global Energy Monitor",
    url: "https://globalenergymonitor.org/",
    blurb: "Open datasets mapping energy infrastructure — power plants, coal mines, solar farms, wind projects, oil and gas facilities, and steel plants at the facility level",
    kind: "dataset",
    orgType: "nonprofit",
    topics: ["energy", "climate", "environment"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    license: "CC BY 4.0",
    retrieval: { bulkDownload: true, formats: ["csv", "xlsx"] },
    coverage: { updated: "quarterly" },
    note: "GEM maintains facility-level open datasets of real-world energy infrastructure, and this is genuinely transformative for environmental journalism. The Global Integrated Power Tracker covers 35,000+ power plants globally; the Global Coal Mine Tracker maps 4,300+ mines; the Global Solar and Wind Power Trackers cover utility-scale renewable projects. For India, every coal plant (including planned, under construction, operating, and retired), coal mine, solar park, wind farm, and steel plant is individually identified with location, capacity, ownership, and status. Researchers can work at the facility level rather than merely the country level."
  },
  {
    name: "CEDA Agri Market Data",
    url: "https://agmarknet.ceda.ashoka.edu.in/",
    blurb: "A friendlier interface over AGMARKNET data — explore prices, arrivals, and trends across thousands of Indian agricultural markets",
    kind: "dataset",
    orgType: "academic",
    topics: ["agriculture", "economy"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["csv"] },
    coverage: { from: 2005, updated: "daily" },
    note: "Ashoka University's Centre for Economic Data and Analysis (CEDA) provides a cleaned, searchable interface on top of the AGMARKNET mandi-price database. It lets researchers explore price trends for 300+ commodities across 3,400+ markets, download bulk data, and create simple visualisations — without learning the AGMARKNET portal's quirks. Particularly useful for journalists and students who need mandi price data but find the government portal difficult to navigate. CEDA also publishes analysis briefs using this data."
  },
  {
    name: "Gram Manchitra",
    url: "https://grammanchitra.gov.in/",
    blurb: "Spatial planning for Panchayati Raj — maps existing infrastructure, plans new facilities, and links to eGramSwaraj financial data at the Gram Panchayat level",
    kind: "dashboard",
    orgType: "government",
    topics: ["governance", "cities", "land"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: false },
    coverage: { updated: "irregular" },
    note: "Gram Manchitra is the geographic complement to eGramSwaraj's financial data. It enables Gram Panchayats to map existing assets (schools, anganwadis, health centres, roads, water sources), plan new infrastructure, and visualise development works spatially. For researchers, it provides a window into how local infrastructure is distributed and planned at the most granular governance level. The spatial data layers include administrative boundaries, infrastructure points, and natural features at Panchayat scale. Combine with eGramSwaraj financial data for a complete picture of local governance."
  },
  {
    name: "PMGSY Rural Roads Portal",
    url: "https://omms.nic.in/",
    blurb: "Pradhan Mantri Gram Sadak Yojana — road-level data on rural road construction, connectivity status, and expenditure across India's rural road network",
    kind: "dashboard",
    orgType: "government",
    topics: ["transport", "welfare", "governance"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["pdf", "xlsx"] },
    coverage: { from: 2000, updated: "live" },
    note: "PMGSY is India's programme to provide all-weather road connectivity to unconnected rural habitations. The OMMS (Online Management, Monitoring and Accounting System) portal provides habitation-level connectivity status, road-wise construction progress, expenditure tracking, and GIS maps of the rural road network. For researchers, this is the definitive source for studying rural connectivity, infrastructure access, and the relationship between road construction and economic outcomes. The public dashboard provides state, district, and block-level summaries. Combine with Census habitation data for connectivity gap analysis."
  },
  {
    name: "Global Health Data Exchange (GHDx)",
    url: "https://ghdx.healthdata.org/",
    blurb: "IHME's catalogue of health datasets — surveys, disease registries, geospatial data, and Global Burden of Disease results, searchable by country and topic",
    kind: "directory",
    orgType: "academic",
    topics: ["health", "demography"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: false, bulkDownload: true, formats: ["csv", "pdf"] },
    coverage: { updated: "irregular" },
    note: "The GHDx is the data catalogue of the Institute for Health Metrics and Evaluation (IHME) at the University of Washington. It is the best starting point for discovering health data for any country — search by geography (India), topic, or data type and find microdata, survey results, disease estimates, and administrative records. For India, the GHDx indexes hundreds of datasets including state-level disease burden studies, NFHS, SRS, civil registration, and cause-of-death data from multiple sources. The Global Burden of Disease results are accessible through a companion tool (vizhub.healthdata.org/gbd-results)."
  },
  {
    name: "Global Burden of Disease Results",
    url: "https://vizhub.healthdata.org/gbd-results/",
    blurb: "Comparable estimates of mortality, disability, and causes of disease across 200+ countries and over time — the standard reference for global health comparisons",
    kind: "dataset",
    orgType: "academic",
    topics: ["health", "demography"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: false, bulkDownload: true, formats: ["csv"] },
    coverage: { from: 1990, updated: "annually" },
    note: "The Global Burden of Disease (GBD) study, coordinated by IHME, is the world's largest systematic effort to quantify health loss. For India, GBD provides state-level estimates of mortality, cause of death, disease prevalence, disability-adjusted life years (DALYs), and risk factor attribution — comparable across states and over time from 1990. This is the dataset behind headlines about India's disease burden shifting from communicable to non-communicable diseases. The India State-Level Disease Burden Initiative publishes dedicated reports, but the global GBD Results Tool gives you the underlying data to make your own comparisons."
  },
  {
    name: "World Bank Microdata Library",
    url: "https://microdata.worldbank.org/",
    blurb: "Thousands of survey microdatasets — household, business, and administrative surveys from the World Bank and partner organisations, many with India content",
    kind: "directory",
    orgType: "multilateral",
    topics: ["economy", "demography", "health", "labour"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, apiUrl: "https://microdata.worldbank.org/index.php/api/", bulkDownload: true, formats: ["csv", "dta", "sav"] },
    coverage: { updated: "irregular" },
    note: "The Microdata Library catalogues thousands of surveys from the World Bank, national statistical offices, and international organisations. For India, it contains NFHS rounds, Enterprise Surveys, Global Findex data, and various impact evaluations and living standards surveys. The key value proposition: many of these datasets are available as anonymised microdata for researchers who register. This is where you find the raw survey responses, not just the published tables. The API provides metadata; actual microdata access requires registration and sometimes additional approval from the data owner."
  },
  {
    name: "World Bank Enterprise Surveys",
    url: "https://www.enterprisesurveys.org/",
    blurb: "Firm-level survey data from 150+ countries on constraints, infrastructure, corruption, finance, labour, trade, and productivity — India data from 2014 and 2022",
    kind: "dataset",
    orgType: "multilateral",
    topics: ["economy", "labour", "technology"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, apiUrl: "https://www.enterprisesurveys.org/en/developers", bulkDownload: true, formats: ["csv", "dta"] },
    coverage: { updated: "irregular" },
    note: "Enterprise Surveys collect firm-level data on a wide range of topics: access to finance, infrastructure quality, corruption experience, competition, workforce skills, regulatory burden, trade, innovation, and firm performance. India is surveyed regularly (2014, 2022) with samples of 9,000+ firms covering manufacturing and services. The microdata is freely downloadable after registration. Particularly useful for comparing India's business environment with other countries at similar income levels, or for studying how firms of different sizes and sectors experience constraints differently."
  },
  {
    name: "Global Findex Database",
    url: "https://www.worldbank.org/en/publication/globalfindex",
    blurb: "Household-level data on financial inclusion — bank accounts, savings, credit, digital payments, and financial resilience — for 140+ countries including India",
    kind: "dataset",
    orgType: "multilateral",
    topics: ["economy", "technology", "gender"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["csv", "dta"] },
    coverage: { from: 2011, updated: "irregular" },
    note: "Global Findex is the world's most comprehensive dataset on how people save, borrow, make payments, and manage risk. The 2025 edition adds modules on digital connectivity, mobile money, and financial resilience. For India, it captures the dramatic expansion of bank account ownership through Jan Dhan, the UPI revolution in digital payments, and persistent gender gaps in financial access. The microdata (individual respondent level) is available through the World Bank Microdata Library. Combine with NFHS or PLFS microdata to study the intersection of financial inclusion with health, education, or labour outcomes."
  },
  {
    name: "UNCTADstat",
    url: "https://unctadstat.unctad.org/",
    blurb: "UNCTAD's data centre — trade, foreign direct investment, maritime transport, commodities, creative economy, and development indicators for 200+ economies",
    kind: "dataset",
    orgType: "multilateral",
    topics: ["economy", "transport"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, apiUrl: "https://unctadstat.unctad.org/apidocs/", bulkDownload: true, formats: ["csv", "xlsx"] },
    coverage: { updated: "annually" },
    note: "UNCTADstat is the statistical arm of the UN Conference on Trade and Development. It covers merchandise and services trade, FDI flows and stocks, maritime transport (fleet, port calls, container traffic), commodity prices, and the creative economy. For India, it provides FDI data complementing RBI's, trade data that can be cross-checked against DGFT and Comtrade, and shipping data relevant to understanding India's port sector. The API and bulk download options make it easy to integrate into dashboards."
  },
  {
    name: "UN World Population Prospects",
    url: "https://population.un.org/wpp/",
    blurb: "The UN's official population estimates and projections for every country — age structures, fertility, mortality, migration, and urbanisation through 2100",
    kind: "dataset",
    orgType: "multilateral",
    topics: ["demography", "cities", "health"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: false, bulkDownload: true, formats: ["csv", "xlsx"] },
    coverage: { from: 1950, updated: "annually" },
    note: "The World Population Prospects is the UN's biennial population reference. The 2024 revision provides estimates (1950-2023) and projections (2024-2100) for 237 countries, including India. Data includes total population, age and sex structure, fertility rates, life expectancy, international migration, and urban/rural population shares. For India, the 2023 estimate of 1.43 billion people surpassing China made global headlines — but WPP data supports far more granular questions about India's demographic dividend, ageing curve, urbanisation trajectory, and state-level population projections."
  },
  {
    name: "UNHCR Refugee Data",
    url: "https://www.unhcr.org/refugee-statistics/",
    blurb: "UNHCR statistics on forcibly displaced populations — refugees, asylum-seekers, internally displaced, and stateless people, by country of origin and asylum",
    kind: "dataset",
    orgType: "multilateral",
    topics: ["migration", "rights", "welfare"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, apiUrl: "https://api.unhcr.org/docs/", bulkDownload: true, formats: ["csv", "json"] },
    coverage: { from: 1951, updated: "annually" },
    note: "UNHCR's Refugee Data Finder provides official statistics on the world's forcibly displaced people. For India, it covers the ~250,000 refugees and asylum-seekers registered with UNHCR India (primarily from Myanmar, Afghanistan, and Sri Lanka), as well as Indians seeking asylum abroad. The data includes demographics (age, sex), location, and legal status. The API provides programmatic access to the full dataset. An essential complement to India's Census migration data, which only captures internal and voluntary international migration — not forced displacement."
  },
  {
    name: "IPUMS International",
    url: "https://international.ipums.org/",
    blurb: "Harmonised census microdata from 100+ countries — individual records spanning decades, making long-run comparative demographic research possible",
    kind: "dataset",
    orgType: "academic",
    topics: ["demography", "labour", "education"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, apiUrl: "https://developer.ipums.org/", bulkDownload: true, formats: ["csv", "dta", "r"] },
    coverage: { from: 1960, updated: "irregular" },
    note: "IPUMS (Integrated Public Use Microdata Series) at the University of Minnesota harmonises census microdata across countries and time periods — so a variable like 'educational attainment' means the same thing in India 2001, India 2011, Brazil 2010, and Kenya 2009. For India, IPUMS International hosts harmonised samples from the 1983, 1987, 1993, 1999, 2004, and 2011 censuses (the 2011 sample covers ~23 million person records). Researchers can build cross-country or inter-temporal comparisons — for example, comparing female labour force participation in India vs. Bangladesh over three decades — using a single, consistently coded dataset. Free registration required."
  },
]

let created = 0, skipped = 0
for (const e of entries) {
  const slug = slugify(e.name)
  const file = `${entriesDir}/${slug}.md`
  if (existsSync(file) && !dryRun) {
    console.log(`SKIP (exists): ${slug}`)
    skipped++
    continue
  }
  const md = make(e)
  if (dryRun) {
    console.log(`WOULD CREATE: ${e.name} → ${slug}.md (${e.blurb.length} char blurb)`)
  } else {
    writeFileSync(file, md, 'utf-8')
    console.log(`CREATED: ${e.name}`)
  }
  created++
}
console.log(`\nCreated: ${created}, Skipped: ${skipped}`)
