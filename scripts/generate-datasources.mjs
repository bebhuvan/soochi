/**
 * Generate Soochi entries for Indian official data sources + climate/Earth science data
 * node scripts/generate-datasources.mjs [--dry]
 */

import { writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const entriesDir = resolve(__dirname, '..', 'src', 'content', 'entries')
const dryRun = process.argv.includes('--dry')

const q = (s) => JSON.stringify(s)
const list = (a) => `[${a.map(q).join(', ')}]`

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

function writeEntry(entry) {
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
  if (entry.license) L.push(`license: ${q(entry.license)}`)
  if (entry.links?.length) {
    L.push('links:')
    for (const l of entry.links) L.push(`  - label: ${q(l.label)}`, `    url: ${q(l.url)}`)
  }
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
  L.push('status: live')
  L.push('---')
  if (entry.note) L.push('', entry.note, '')
  return L.join('\n')
}

const entries = [
  // ================================================================
  // INDIAN OFFICIAL DATA SOURCES
  // ================================================================

  {
    name: "Road Accident Statistics (MoRTH)",
    url: "https://morth.gov.in/en/road-accident-in-india",
    blurb: "Annual national road crash deaths, injuries, causes, vehicle types, and state-wise data from the Ministry of Road Transport and Highways",
    kind: "dataset",
    orgType: "government",
    topics: ["transport", "health", "governance"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["pdf", "csv"] },
    coverage: { from: 1970, updated: "annually" },
    note: "India has the highest number of road crash deaths globally, and this is the authoritative dataset for transport safety research, infrastructure planning, and public health analysis. Annual reports include granular breakdowns by state, vehicle type, cause, age group, and road classification. The 2023 edition covers ~4.8 lakh road accidents."
  },
  {
    name: "NPCI UPI Ecosystem Statistics",
    url: "https://www.npci.org.in/what-we-do/upi/upi-ecosystem-statistics",
    blurb: "Monthly UPI transaction volumes, values, bank-wise performance, and digital payment adoption across India's real-time payments rail",
    kind: "dataset",
    orgType: "government",
    topics: ["economy", "technology", "governance"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["csv", "xlsx"] },
    coverage: { from: 2016, updated: "monthly" },
    note: "UPI now processes over 15 billion transactions a month — this is the single best high-frequency indicator of digital adoption and informal economic activity in India. NPCI publishes bank-wise and product-wise breakdowns monthly. The broader Retail Payment Statistics page covers IMPS, NACH, AePS, and NETC (FASTag) as well."
  },
  {
    name: "GST Revenue Statistics",
    url: "https://gstcouncil.gov.in/all-gst-revenue",
    blurb: "Monthly GST revenue collections — gross, state-wise, category-wise, and return filing compliance — from the GST Council",
    kind: "dataset",
    orgType: "government",
    topics: ["economy", "public-finance", "governance"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["pdf", "csv"] },
    coverage: { from: 2017, updated: "monthly" },
    note: "The government's own high-frequency pulse of formal economic activity. Monthly releases include total GST revenue, CGST, SGST, IGST, cess, state-wise breakup, and return filing counts. The GSTN portal (gst.gov.in) also publishes detailed registration and filing statistics. Arguably the single most-watched monthly economic release in India after CPI."
  },
  {
    name: "Ayushman Bharat PMJAY Dashboard",
    url: "https://dashboard.nha.gov.in/public/",
    blurb: "Public dashboard for the world's largest health insurance scheme — hospital admissions, claims, empaneled hospitals, and state-wise coverage for 500M+ beneficiaries",
    kind: "dashboard",
    orgType: "government",
    topics: ["health", "welfare", "governance"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { api: false, bulkDownload: false, formats: [] },
    coverage: { from: 2018, updated: "live" },
    note: "The Pradhan Mantri Jan Arogya Yojana (PMJAY) dashboard shows real-time hospital admission counts, claim amounts, pre-authorizations, empaneled hospital networks, and beneficiary demographic breakdowns. The related PMJAY Insights portal (insights.pmjay.gov.in) adds treatment speciality analysis, gender-disaggregated data, and district-level drill-downs."
  },
  {
    name: "Udyam MSME Registration",
    url: "https://udyamregistration.gov.in/",
    blurb: "Official MSME registration portal with public statistics on registered enterprises by state, sector, social category, gender, and enterprise size",
    kind: "dataset",
    orgType: "government",
    topics: ["economy", "labour", "governance"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: false },
    coverage: { from: 2020, updated: "live" },
    note: "The post-2020 replacement for the old Udyog Aadhaar classification — now the canonical reference for MSME statistics. The public dashboard reports cumulative and daily registrations broken down by state, district, industry, gender, social category (SC/ST/OBC), and enterprise size (micro/small/medium). Government schemes and RBI lending data depend on Udyam for MSME classification."
  },
  {
    name: "PM-KISAN",
    url: "https://pmkisan.gov.in/",
    blurb: "Pradhan Mantri Kisan Samman Nidhi — farmer income support dashboard tracking beneficiaries, instalments, payments, and state-wise coverage for 110M+ farmer families",
    kind: "dashboard",
    orgType: "government",
    topics: ["agriculture", "welfare", "governance"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: false },
    coverage: { from: 2019, updated: "live" },
    note: "India's flagship direct income support scheme for farmers — ₹6,000 per year per eligible farmer family. The dashboard tracks fund transfers, beneficiary counts, eKYC completion rates, and state-wise implementation progress. An essential welfare-outlay tracker with unparalleled coverage of India's agricultural households."
  },
  {
    name: "Income Tax Time Series Data",
    url: "https://www.incometaxindia.gov.in/",
    blurb: "CBDT's annual time series on taxpayer counts by income slab, returns filed, direct tax collections, cost of collection, and state-wise distributions from FY 2000-01",
    kind: "dataset",
    orgType: "government",
    topics: ["economy", "public-finance", "governance"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["pdf"] },
    coverage: { from: 2000, updated: "annually" },
    note: "The best public window into India's formal income distribution and tax base. The Time Series Data PDF covers direct tax collections (corporate, personal), taxpayer counts by income bracket, return filing by type, PAN allocations, and state-wise direct tax contributions. Essential for understanding the scale and limits of India's tax base."
  },
  {
    name: "NHB Residex",
    url: "https://residex.nhbonline.org.in/",
    blurb: "India's official housing price index — quarterly residential price movements for 50 cities, tracking price, completion, and unsold inventory since 2010",
    kind: "dataset",
    orgType: "government",
    topics: ["housing", "economy", "cities"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["xlsx", "pdf"] },
    coverage: { from: 2010, updated: "quarterly" },
    note: "The only systematic housing price dataset for Indian cities. NHB RESIDEX tracks price indices for 50 cities (26 from 2010, 24 added later), separately reporting under-construction and completed property prices. Also publishes the HPI@AssessmentPrice — a valuation-based index using actual bank lending data. Essential for urban economics, housing policy, and real estate research."
  },
  {
    name: "Startup India (DPIIT)",
    url: "https://www.startupindia.gov.in/",
    blurb: "DPIIT-recognised startups database — 100K+ entities registered with state, sector, gender, and eligibility details, published under the Startup India initiative",
    kind: "dataset",
    orgType: "government",
    topics: ["economy", "technology", "labour"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: false },
    coverage: { from: 2016, updated: "live" },
    note: "The official registry of startups recognised by DPIIT under the Startup India Action Plan. The public dashboard provides registration statistics by state, sector, and year, with filters for women-led startups and patent/trademark holders. Recognition enables startups to access tax exemptions, IPR fast-tracking, and public procurement benefits."
  },
  {
    name: "India Tourism Statistics",
    url: "https://tourism.gov.in/",
    blurb: "Ministry of Tourism's annual statistics — foreign tourist arrivals, foreign exchange earnings, domestic tourism visits, and state-wise tourism infrastructure",
    kind: "dataset",
    orgType: "government",
    topics: ["economy", "culture"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["pdf"] },
    coverage: { updated: "annually" },
    note: "India Tourism Statistics provides the official count of foreign tourist arrivals (by country, port of entry, month), foreign exchange earnings from tourism, domestic tourist visits by state, hotel and accommodation inventory, and human resource development in the tourism sector. The India Tourism Data Portal adds interactive dashboards with state and district drill-downs."
  },
  {
    name: "Swachh Bharat Mission Dashboard",
    url: "https://sbm.gov.in/",
    blurb: "Sanitation progress across urban and rural India — toilet construction, ODF status, solid waste management, and swachhata rankings at city and district level",
    kind: "dashboard",
    orgType: "government",
    topics: ["health", "cities", "welfare"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: false },
    coverage: { from: 2014, updated: "live" },
    note: "The SBM dashboard tracks urban sanitation infrastructure: individual and community toilets built, public urinals, solid waste processing plants, ODF/ODF+/ODF++/Water+ city certifications, and the annual Swachh Survekshan rankings. The rural counterpart (SBM-G) separately tracks village-level sanitation coverage and behaviour-change indicators."
  },
  {
    name: "PM Awas Yojana (Urban) MIS",
    url: "https://pmaymis.gov.in/",
    blurb: "Pradhan Mantri Awas Yojana — houses sanctioned, grounded, and completed across urban and rural verticals, with beneficiary details and state-wise progress",
    kind: "dashboard",
    orgType: "government",
    topics: ["housing", "welfare", "cities"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["pdf"] },
    coverage: { from: 2015, updated: "live" },
    note: "The PMAY-U dashboard (PMAY Urban MIS) provides city, district, and state-level progress on India's flagship housing scheme — central assistance released, houses sanctioned, grounded, completed, and beneficiary details by social category. The rural vertical PMAY-G is tracked separately through the AwaasSoft platform. Together they cover India's largest housing welfare programme."
  },
  {
    name: "Coal Controller's Organisation",
    url: "https://coal.nic.in/",
    blurb: "Monthly coal production, dispatch, pithead stock, and royalty statistics by company, state, and grade — the primary source on India's largest energy commodity",
    kind: "dataset",
    orgType: "government",
    topics: ["energy", "economy", "environment"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["pdf"] },
    coverage: { updated: "monthly" },
    note: "Coal generates ~70% of India's electricity and is the single largest source of government mineral revenue. The CCO publishes monthly output and dispatch data for Coal India, SCCL, and captive mines, with grade-wise and state-wise breakdowns. The Ministry of Coal's broader statistics suite adds import, export, and washery data."
  },
  {
    name: "Labour Bureau Wage Rate Index",
    url: "https://labourbureau.gov.in/",
    blurb: "Rural and urban wage rates for 46 agricultural and non-agricultural occupations, collected monthly from 600 villages and published as wage rate indices",
    kind: "dataset",
    orgType: "government",
    topics: ["labour", "agriculture", "economy"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["pdf", "xlsx"] },
    coverage: { from: 1999, updated: "monthly" },
    note: "The Labour Bureau collects retail wage rates across 46 occupations (12 agricultural, 7 plantation, 19 non-agricultural rural, and 8 urban) from 600 sample villages and urban centres. This is the most granular, high-frequency wage data available for rural India — essential for tracking agricultural distress, MGNREGA wage comparisons, and real purchasing power at the bottom of the income distribution."
  },
  {
    name: "FSSAI Food Safety Data",
    url: "https://fssai.gov.in/",
    blurb: "Food sample testing, adulteration rates, enforcement actions, and state-wise food safety compliance data from the Food Safety and Standards Authority of India",
    kind: "dataset",
    orgType: "government",
    topics: ["health", "nutrition", "governance"],
    geography: ["india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["pdf"] },
    coverage: { updated: "annually" },
    note: "FSSAI publishes annual reports with state-wise data on food samples collected, tested, found non-conforming, and adulterated; civil and criminal enforcement actions; licensing and registration statistics; and foodborne illness outbreak data. The FoSCoS portal adds real-time food business operator licensing data."
  },

  // ================================================================
  // CLIMATE & EARTH SCIENCE DATA
  // ================================================================

  {
    name: "Copernicus Climate Data Store",
    url: "https://cds.climate.copernicus.eu/",
    blurb: "The EU's climate data warehouse — ERA5 reanalysis, seasonal forecasts, climate projections, satellite observations, and sectoral climate indicators, all with documented APIs",
    kind: "dataset",
    orgType: "multilateral",
    topics: ["climate", "environment", "water", "energy"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    license: "Copernicus Licence",
    retrieval: { api: true, apiUrl: "https://cds.climate.copernicus.eu/api-how-to", bulkDownload: true, formats: ["netcdf", "grib", "csv"] },
    coverage: { from: 1940, updated: "monthly" },
    note: "The CDS is the single most important open climate data platform globally. ERA5 provides hourly climate and weather reanalysis from 1940 to near-present at ~31 km resolution, covering the atmosphere, land surface, and ocean. Also hosts C3S seasonal forecasts, CMIP6 climate projections, and sectoral applications (energy, water, agriculture, health). Free registration required for API access."
  },
  {
    name: "ECMWF ERA5",
    url: "https://www.ecmwf.int/en/forecasts/dataset/ecmwf-reanalysis-v5",
    blurb: "Fifth-generation global climate reanalysis from ECMWF — hourly atmospheric, land, and ocean variables from 1940 to within 5 days of real time, at 0.25° resolution",
    kind: "dataset",
    orgType: "multilateral",
    topics: ["climate", "environment", "water"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    license: "Copernicus Licence",
    retrieval: { api: true, apiUrl: "https://cds.climate.copernicus.eu/api-how-to", bulkDownload: true, formats: ["netcdf", "grib"] },
    coverage: { from: 1940, updated: "daily" },
    note: "ERA5 is the de facto standard for global climate data in research and industry. It provides hourly estimates for hundreds of atmospheric, land-surface, and ocean-wave parameters at 0.25° (~31 km) resolution, from 1940 to within 5 days of real time. The ERA5-Land subset gives finer land-surface detail at 9 km. Undisputed as the most widely used gridded climate dataset for any region that lacks dense station networks — which includes most of India."
  },
  {
    name: "Berkeley Earth",
    url: "https://berkeleyearth.org/data/",
    blurb: "High-resolution global land and ocean temperature datasets with full uncertainty quantification, assembled from more temperature stations than any other global product",
    kind: "dataset",
    orgType: "nonprofit",
    topics: ["climate", "environment"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    license: "CC BY 4.0",
    retrieval: { bulkDownload: true, formats: ["csv", "netcdf"] },
    coverage: { from: 1850, updated: "monthly" },
    note: "Berkeley Earth was founded to address concerns about bias in the main global temperature records. It incorporates more station data than any other group (over 50,000 stations), uses a transparent and fully reproducible methodology, and publishes uncertainty ranges with every estimate. Produces global and country-level temperature series, gridded fields, and city-level warming attribution. Widely cited in climate-litigation and climate-attribution work."
  },
  {
    name: "NASA GISS Surface Temperature Analysis",
    url: "https://data.giss.nasa.gov/gistemp/",
    blurb: "NASA Goddard Institute's global surface temperature record — one of the four canonical datasets used to measure global warming, with monthly updates since 1880",
    kind: "dataset",
    orgType: "government",
    topics: ["climate", "environment"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["csv", "netcdf"] },
    coverage: { from: 1880, updated: "monthly" },
    note: "GISTEMP is one of the four primary global temperature records (alongside HadCRUT, NOAA, and Berkeley Earth) that the IPCC and every climate assessment rely on. NASA GISS also publishes sectoral climate datasets: aerosols, clouds, radiation balance, and climate model outputs (NCCS). The GISTEMP station data maps are particularly useful for checking regional coverage quality."
  },
  {
    name: "NOAA Climate Data Online",
    url: "https://www.ncei.noaa.gov/cdo-web/",
    blurb: "NOAA's archive of historical weather and climate observations — station-level daily summaries, global hourly data, and normals for tens of thousands of stations worldwide",
    kind: "dataset",
    orgType: "government",
    topics: ["climate", "environment", "disasters"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, apiUrl: "https://www.ncei.noaa.gov/cdo-web/webservices/v2", bulkDownload: true, formats: ["csv", "json"] },
    coverage: { from: 1763, updated: "daily" },
    note: "CDO is the primary access point for NOAA's vast historical weather archive. For India, it offers daily summaries (temperature, precipitation, wind) from ~200 stations with records stretching back decades — an essential complement to IMD data, particularly for cross-border analysis and for Indian regions where IMD data is hard to obtain. Also publishes the US 1991-2020 Climate Normals and the Global Historical Climatology Network (GHCN-D)."
  },
  {
    name: "Climate TRACE",
    url: "https://climatetrace.org/",
    blurb: "Independent, AI-powered inventory of greenhouse gas emissions from 745 million individual assets worldwide — power plants, ships, factories, farms, forests, and more",
    kind: "dataset",
    orgType: "nonprofit",
    topics: ["climate", "environment", "energy"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: false, bulkDownload: true, formats: ["csv"] },
    coverage: { from: 2015, updated: "annually" },
    note: "Climate TRACE (Tracking Real-time Atmospheric Carbon Emissions) uses satellite imagery, remote sensing, and machine learning to estimate emissions from every significant source on Earth. Unlike national inventories that rely on self-reporting, TRACE independently observes emissions from 745M+ assets. For India, it provides facility-level estimates for power plants, steel mills, cement plants, ships, and landfills — making it a powerful accountability complement to official BUR submissions."
  },
  {
    name: "Global Carbon Budget",
    url: "https://www.globalcarbonproject.org/",
    blurb: "The authoritative annual budget of CO₂ sources and sinks — fossil fuel emissions, land-use change, and ocean/land carbon uptake, published by the Global Carbon Project",
    kind: "dataset",
    orgType: "academic",
    topics: ["climate", "environment", "energy"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["csv", "xlsx"] },
    coverage: { from: 1750, updated: "annually" },
    note: "The GCB is the reference dataset cited in every IPCC report and UNFCCC Global Stocktake. It reconciles emissions from fossil fuel combustion, cement production, and land-use change against the measured growth rate of atmospheric CO₂ and estimates of ocean and land carbon sinks. Country-level fossil CO₂ data for India goes back to 1959. Companion products include the Global Methane Budget and Global Nitrous Oxide Budget."
  },
  {
    name: "Google Earth Engine Data Catalog",
    url: "https://developers.google.com/earth-engine/datasets/catalog/",
    blurb: "Google's multi-petabyte catalog of geospatial datasets — satellite imagery, climate, terrain, land cover, and population data — all queryable through a planetary-scale compute platform",
    kind: "dataset",
    orgType: "commercial",
    topics: ["climate", "environment", "land", "agriculture"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, apiUrl: "https://developers.google.com/earth-engine/apidocs", bulkDownload: true, formats: ["geotiff", "csv"] },
    coverage: { updated: "live" },
    note: "Earth Engine hosts over 1,000 public datasets: full Landsat and Sentinel archives, MODIS, ERA5, CHIRPS rainfall, WorldPop, Global Forest Change, Dynamic World land cover, and dozens more. What makes it unique is that the data lives alongside a planetary-scale compute service — you don't download petabytes; you query it in place. Free for research, education, and non-commercial use. The de facto platform for geospatial analysis at scale."
  },
  {
    name: "WorldClim",
    url: "https://worldclim.org/",
    blurb: "Global gridded climate data for past, present, and future conditions — monthly temperature, precipitation, and 19 bioclimatic variables used in ecological and agricultural modelling worldwide",
    kind: "dataset",
    orgType: "academic",
    topics: ["climate", "environment", "agriculture"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["geotiff"] },
    coverage: { from: 1970, updated: "static" },
    note: "WorldClim provides high-resolution (1 km²) monthly climate surfaces — min/mean/max temperature, precipitation, solar radiation, wind speed, water vapour pressure — plus 19 derived bioclimatic variables that capture seasonality, extremes, and growing conditions. Also publishes downscaled CMIP6 future climate projections. The standard input for species distribution models, crop suitability studies, and conservation planning. Version 2.1 covers 1970-2000 normals."
  },
  {
    name: "IPCC Data Distribution Centre",
    url: "https://www.ipcc-data.org/",
    blurb: "The official archive for all IPCC assessment datasets — observed climate, future projections, socioeconomic scenarios, and impacts data — with consistent metadata and citation",
    kind: "archive",
    orgType: "multilateral",
    topics: ["climate", "environment", "economy"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["netcdf", "csv"] },
    coverage: { from: 1850, updated: "irregular" },
    note: "The DDC is the reference point for every dataset cited in IPCC Assessment Reports. It archives observed climate records, CMIP5/CMIP6 global climate model output, downscaled regional projections, and the SSP (Shared Socioeconomic Pathway) scenario database. For India-specific analysis, the DDC's regional data pages provide pre-extracted South Asia time series and maps from each generation of climate models."
  },
  {
    name: "Carbon Monitor",
    url: "https://carbonmonitor.org/",
    blurb: "Near-real-time daily CO₂ emissions estimates for countries and sectors, updated within weeks — the closest thing to a live global emissions pulse",
    kind: "dataset",
    orgType: "academic",
    topics: ["climate", "energy", "economy"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    license: "CC BY 4.0",
    retrieval: { bulkDownload: true, formats: ["csv"] },
    coverage: { from: 2019, updated: "daily" },
    note: "Carbon Monitor fills the gap between the annual Global Carbon Budget (released ~6 months after year-end) and the need for real-time emissions tracking. It uses machine learning on power generation data, mobility indicators, industrial activity, and satellite observations to estimate daily country-level CO₂ emissions from fossil fuel combustion and cement. Updated every 1-3 weeks. Particularly valuable during the COVID-19 lockdowns and energy crises when annual data was too slow."
  },
  {
    name: "NASA POWER",
    url: "https://power.larc.nasa.gov/",
    blurb: "NASA's solar and meteorological data — daily temperature, precipitation, solar radiation, wind, and humidity from 1981 onwards, designed for renewable energy and agricultural applications",
    kind: "dataset",
    orgType: "government",
    topics: ["climate", "energy", "agriculture", "water"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, apiUrl: "https://power.larc.nasa.gov/api/pages/", bulkDownload: true, formats: ["csv", "json", "netcdf"] },
    coverage: { from: 1981, updated: "daily" },
    note: "NASA POWER (Prediction of Worldwide Energy Resources) provides global gridded meteorological data at 0.5° resolution from 1981 to near-real-time (2-3 day delay). Parameters include temperature, precipitation, relative humidity, solar radiation (GHI, DNI, DIF), and wind speed — the exact variables needed for solar panel sizing, crop modelling, and water balance calculations. It has a straightforward REST API, an interactive Data Access Viewer, and is widely used in regions without dense ground instrumentation."
  },
  {
    name: "Copernicus Browser",
    url: "https://browser.dataspace.copernicus.eu/",
    blurb: "ESA's visual browser for Sentinel satellite imagery — optical, radar, and atmospheric data from the Copernicus constellation, with on-the-fly visualisation and download",
    kind: "dataset",
    orgType: "multilateral",
    topics: ["land", "environment", "agriculture", "water"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    license: "Copernicus Licence",
    retrieval: { api: true, apiUrl: "https://dataspace.copernicus.eu/analyse/apis", bulkDownload: true, formats: ["geotiff"] },
    coverage: { from: 2015, updated: "daily" },
    note: "Copernicus Browser is the visual gateway to the full Sentinel satellite constellation: Sentinel-1 (radar), Sentinel-2 (optical, 10 m), Sentinel-3 (ocean/land), Sentinel-5P (atmospheric chemistry), and Sentinel-6 (sea level). Unlike Google Earth Engine, it requires no coding — you can visualise, composite, and download scenes in the browser. The underlying Copernicus Data Space Ecosystem provides API access and cloud processing. All data is free and open for any use."
  },
  {
    name: "EM-DAT International Disaster Database",
    url: "https://www.emdat.be/",
    blurb: "The global reference for disaster impact data — 27,000+ records of natural and technological disasters with deaths, affected populations, and economic damage since 1900",
    kind: "dataset",
    orgType: "academic",
    topics: ["disasters", "climate", "health"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["csv", "xlsx"] },
    coverage: { from: 1900, updated: "monthly" },
    note: "EM-DAT (Emergency Events Database), maintained by the Centre for Research on the Epidemiology of Disasters (CRED) in Brussels, is the authoritative source for disaster frequency and impact statistics worldwide. For India, it records floods, cyclones, heatwaves, droughts, earthquakes, industrial accidents, and epidemics — with counts of deaths, affected people, and estimated economic damage. Used by the WHO, World Bank, and national disaster management agencies. Free registration required for full access."
  },
  {
    name: "Open-Meteo",
    url: "https://open-meteo.com/",
    blurb: "Free open-source weather API — forecasts and historical weather from 1940 using the best available global models, with no API key and no registration required",
    kind: "dataset",
    orgType: "commercial",
    topics: ["climate", "disasters", "agriculture", "energy"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    license: "CC BY 4.0",
    retrieval: { api: true, apiUrl: "https://open-meteo.com/en/docs", bulkDownload: true, formats: ["json", "csv"] },
    coverage: { from: 1940, updated: "daily" },
    note: "Open-Meteo aggregates the best open forecast models (GFS, ECMWF IFS, DWD ICON, MeteoFrance, JMA, GEM) and historical reanalysis (ERA5, ERA5-Land, CERRA) behind a clean REST API — no API key, no registration, no rate limits. For any coordinate in India, you can get 7-day to 16-day forecasts or 80+ years of hourly historical weather. Air quality forecasts from CAMS are also available. Increasingly used as a drop-in replacement for commercial weather APIs in research and civic tech."
  },
  {
    name: "Climate Watch",
    url: "https://www.climatewatchdata.org/",
    blurb: "WRI's open climate data platform — country-level greenhouse gas emissions, NDCs, climate policies, and linkages across development indicators, all in one searchable interface",
    kind: "dataset",
    orgType: "nonprofit",
    topics: ["climate", "environment", "energy", "governance"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { api: true, apiUrl: "https://www.climatewatchdata.org/api/v1/", bulkDownload: true, formats: ["csv"] },
    coverage: { from: 1990, updated: "annually" },
    note: "Climate Watch integrates emissions data from CAIT (Climate Analysis Indicators Tool), NDC content from the UNFCCC registry, climate finance flows, and World Bank development indicators. For India, it provides year-wise GHG emissions by sector and gas through 2022, full text of India's NDC submissions and Long-Term Low-Carbon Development Strategy, and country-level adaptation and mitigation profiles. The API makes it easy to embed these figures in dashboards."
  },
  {
    name: "Global Drought Observatory",
    url: "https://edo.jrc.ec.europa.eu/gdo/",
    blurb: "The EU's global drought monitoring system — precipitation, soil moisture, vegetation stress, and drought risk indices updated every 10 days with 0.1° resolution",
    kind: "dashboard",
    orgType: "multilateral",
    topics: ["climate", "disasters", "agriculture", "water"],
    geography: ["global", "india"],
    licensing: "open",
    access: "free",
    retrieval: { bulkDownload: true, formats: ["geotiff", "png"] },
    coverage: { from: 1981, updated: "daily" },
    note: "The GDO provides near-real-time drought monitoring and early warning globally. Its Combined Drought Indicator integrates precipitation anomalies, soil moisture deficit, and satellite-measured vegetation stress into a single drought severity map updated every 10 days. For India, it provides continuous drought risk monitoring at 0.1° resolution — particularly useful for tracking monsoon deficits, groundwater stress, and agricultural drought onset before official declarations. The risk of drought impact layer adds sectoral exposure for agriculture and population."
  },
]

let created = 0, skipped = 0
for (const e of entries) {
  const slug = slugify(e.name)
  const file = `${entriesDir}/${slug}.md`
  if (existsSync(file) && !dryRun) {
    console.log(`SKIP (exists): ${e.name}`)
    skipped++
    continue
  }
  const md = writeEntry(e)
  if (dryRun) {
    console.log(`WOULD CREATE: ${e.name} → ${slug}.md`)
  } else {
    writeFileSync(file, md, 'utf-8')
    console.log(`CREATED: ${e.name}`)
  }
  created++
}
console.log(`\nCreated: ${created}, Skipped: ${skipped}`)
