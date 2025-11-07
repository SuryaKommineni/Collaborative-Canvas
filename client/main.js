ws.on("userList", (users) => {
  const usersDiv = document.getElementById("users");
  if (!usersDiv) return;

  if (users.length === 0) {
    usersDiv.style.display = "none";
    return;
  }

  usersDiv.style.display = "block";
  usersDiv.innerHTML = `
    <strong>Online Users (${users.length})</strong><br>
    ${users
      .map(
        (u) =>
          `<div style="color:${u.color}">
             ● ${u.name}
           </div>`
      )
      .join("")}
  `;
});
