const axios = require("axios");

async function fetchPubMed(query) {
  try {
    const searchRes = await axios.get(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
      {
        params: {
          db: "pubmed",
          term: query,
          retmode: "json",
          retmax: 5
        }
      }
    );

    const ids = searchRes.data.esearchresult.idlist.join(",");

    const detailsRes = await axios.get(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi",
      {
        params: {
          db: "pubmed",
          id: ids,
          retmode: "json"
        }
      }
    );

    return Object.values(detailsRes.data.result)
      .filter(item => item.uid)
      .map(item => ({
        title: item.title,
        authors: item.authors?.map(a => a.name).join(", "),
        year: item.pubdate
      }));

  } catch (err) {
    console.error("PubMed Error:", err.message);
    return [];
  }
}

module.exports = { fetchPubMed };