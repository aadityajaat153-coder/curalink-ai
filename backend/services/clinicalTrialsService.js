const axios = require("axios");

async function fetchClinicalTrials(query) {
  try {
    const res = await axios.get(
      "https://clinicaltrials.gov/api/v2/studies",
      {
        params: {
          "query.term": query,
          pageSize: 5
        }
      }
    );

    const studies = res.data.studies || [];

    return studies.map(study => ({
      id: study.protocolSection?.identificationModule?.nctId || "N/A",
      title: study.protocolSection?.identificationModule?.briefTitle || "N/A",
      condition:
        study.protocolSection?.conditionsModule?.conditions?.[0] || "N/A",
      phase:
        study.protocolSection?.designModule?.phases?.[0] || "N/A",
      location:
        study.protocolSection?.contactsLocationsModule?.locations?.[0]?.city ||
        "N/A"
    }));

  } catch (err) {
    console.error("❌ Clinical Trials Error:", err.message);
    return [];
  }
}

module.exports = { fetchClinicalTrials };