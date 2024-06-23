const fs = require("fs");
const path = require("path");

function generateRSSFeed(reports) {
  let items = "";
  reports.forEach((report) => {
    const {
      id,
      user_id,
      status,
      gender,
      name,
      species,
      danger_level,
      dateLastSeen,
      addressLastSeen,
      city,
      phone_number,
      user_email,
      violence,
      rabies,
      trained,
      vaccinated,
      additional_info,
      image,
      created_at,
    } = report;

    const title = name ? `<![CDATA[${name}]]>` : "";
    const link = id ? `http://localhost:3000/animal-details.html?id=${id}` : "";
    const newCreated_at = formatDate(created_at);
    const newDateLastSeen = formatDate(dateLastSeen);
    const guid = link;
    const description = `
      <![CDATA[
        Status: ${status}
        Gender: ${gender}<br>
        Species: ${species}<br>
        Danger Level: ${danger_level}<br>
        Date Last Seen: ${newDateLastSeen}<br>
        Address Last Seen: ${addressLastSeen}<br>
        City: ${city}<br>
        Phone Number: ${phone_number}<br>
        User Email: ${user_email}<br>
        Violence: ${violence}<br>
        Rabies: ${rabies}<br>
        Trained: ${trained}<br>
        Vaccinated: ${vaccinated}<br>
        Additional Info: ${additional_info}
      ]]>
    `;
    const pubDate = newCreated_at;
    const imageUrl = image ? `http://localhost:3000/uploads/${image}` : "";

    items += `
      <item>
        <title>${title}</title>
        <link>${link}</link>
        <guid>${guid}</guid>
        <description>${description}</description>
        <pubDate>${pubDate}</pubDate>
        ${imageUrl ? `<enclosure url="${imageUrl}" type="image/jpeg" />` : ""}
      </item>
    `;
  });

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Animal Reports</title>
        <link>http://localhost:3000/rss</link>
        <description>Latest animal reports</description>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <language>en</language>
        ${items}
      </channel>
    </rss>`;

  return feed;
}
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

module.exports = { generateRSSFeed };
