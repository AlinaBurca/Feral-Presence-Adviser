function generateRSSFeed(reports) {
    let items = '';
    reports.forEach(report => {
        items += `
        <item>
          <title><![CDATA[${report.name}]]></title>
          <link>http://localhost:3000/animal-details?id=${report.id}</link>
          <guid>http://localhost:3000/animal-details?id=${report.id}</guid>
          <description><![CDATA[${report.species} last seen on ${report.dateLastSeen} at ${report.addressLastSeen}]]></description>
          <pubDate>${new Date(report.created_at).toUTCString()}</pubDate>
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

module.exports = { generateRSSFeed };
