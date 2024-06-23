function showUsers() {
  fetch("/get-users")
    .then((response) => response.json())
    .then((data) => {
      const usersCount = document.getElementById("users-count");
      usersCount.innerText = `Total Users: ${data.count}`;
      const usersTable = document.getElementById("users-table");
      usersTable.innerHTML = generateTable(data.data);
      togglePanels("users-panel", "reports-panel");
    })
    .catch((error) => console.error("Error fetching users:", error));
}

function showReports() {
  fetch("/get-reports")
    .then((response) => response.json())
    .then((data) => {
      const reportsCount = document.getElementById("reports-count");
      reportsCount.innerText = `Total Reports: ${data.count}`;
      const reportsTable = document.getElementById("reports-table");
      reportsTable.innerHTML = generateTable(data.data);
      togglePanels("reports-panel", "users-panel");
    })
    .catch((error) => console.error("Error fetching reports:", error));
}

function togglePanels(panelToShow, panelToHide) {
  const showPanel = document.getElementById(panelToShow);
  const hidePanel = document.getElementById(panelToHide);
  showPanel.style.display = "block";
  hidePanel.style.display = "none";
}

function generateTable(data) {
  let table = "<table><tr>";
  // Generate table headers
  Object.keys(data[0]).forEach((key) => {
    table += `<th>${key}</th>`;
  });
  table += "</tr>";

  // Generate table rows
  data.forEach((row) => {
    table += "<tr>";
    Object.values(row).forEach((value) => {
      table += `<td>${value}</td>`;
    });
    table += "</tr>";
  });
  table += "</table>";
  return table;
}
