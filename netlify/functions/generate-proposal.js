// Netlify Function: generate-proposal.js
// Receives the cost estimator's selections, builds a complete 13-page
// proposal document server-side, sends it to APITemplate.io's
// create-pdf-from-html endpoint, and returns the resulting PDF download URL.
//
// The APITemplate.io key lives ONLY in Netlify's environment variables
// (server-side), never in the browser bundle. Set APITEMPLATE_API_KEY in
// Netlify site settings.

const { buildProposalHTML } = require("./proposal-builder.js");

exports.handler = async function (event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.APITEMPLATE_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Server is missing APITEMPLATE_API_KEY. Set it in Netlify site environment variables.",
      }),
    };
  }

  let input;
  try {
    input = JSON.parse(event.body || "{}");
  } catch (e) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }

  // Basic sanity check — we need at least a category and a total to build a
  // meaningful proposal. Everything else has sensible fallbacks.
  if (!input || typeof input !== "object") {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Missing proposal data" }),
    };
  }

  let proposalHTML;
  try {
    proposalHTML = buildProposalHTML(input);
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Could not build the proposal document: " + (err.message || "unknown error"),
      }),
    };
  }

  try {
    const res = await fetch("https://rest.apitemplate.io/v2/create-pdf-from-html", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: proposalHTML,
        settings: {
          paper_size: "A4",
          orientation: "Portrait",
          margin_top: "0",
          margin_bottom: "0",
          margin_left: "0",
          margin_right: "0",
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers,
        body: JSON.stringify({
          error: (data && (data.message || data.error)) || "PDF generation service returned an error",
        }),
      };
    }

    // APITemplate.io's create-pdf-from-html response includes the hosted
    // download URL under `download_url` in normal operation.
    const downloadUrl = data.download_url || data.pdf_url || data.url;
    if (!downloadUrl) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "PDF was generated but no download URL was returned" }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ downloadUrl }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        error: "Could not reach the PDF generation service. Please try again.",
      }),
    };
  }
};
