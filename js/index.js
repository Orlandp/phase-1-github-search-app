document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector("#github-form");
    const searchInput = document.querySelector("#search");
    const resultsContainer = document.querySelector("#results");
    const toggleButton = document.createElement("button");
    let searchMode = "user"; // Tracks current search mode, can be 'user' or 'repo'
  
    // Setup the toggle button
    toggleButton.textContent = "Switch to Repo Search";
    toggleButton.classList.add("toggle-btn");
    searchForm.appendChild(toggleButton);
  
    toggleButton.addEventListener("click", () => {
      searchMode = searchMode === "user" ? "repo" : "user";
      toggleButton.textContent = searchMode === "user" ? "Switch to Repo Search" : "Switch to User Search";
    });
  
    // Event listener for form submit
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      resultsContainer.innerHTML = ""; // Clear previous results
      const searchTerm = searchInput.value.trim();
  
      if (searchTerm) {
        if (searchMode === "user") {
          searchUsers(searchTerm);
        } else {
          searchRepositories(searchTerm);
        }
      }
    });
  
    // Function to search users by name
    function searchUsers(query) {
      fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          data.items.forEach((user) => {
            const userCard = document.createElement("div");
            userCard.classList.add("user-card");
            userCard.innerHTML = `
              <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
              <p><strong>${user.login}</strong></p>
              <a href="${user.html_url}" target="_blank">View Profile</a>
              <button class="repos-btn" data-username="${user.login}">View Repositories</button>
            `;
            resultsContainer.appendChild(userCard);
          });
  
          // Add event listeners for "View Repositories" buttons
          document.querySelectorAll(".repos-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
              const username = e.target.getAttribute("data-username");
              fetchUserRepositories(username);
            });
          });
        })
        .catch((error) => console.error("Error fetching users:", error));
    }
  
    // Function to fetch a user's repositories
    function fetchUserRepositories(username) {
      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })
        .then((response) => response.json())
        .then((repos) => {
          const userReposContainer = document.createElement("div");
          userReposContainer.classList.add("repos-container");
  
          repos.forEach((repo) => {
            const repoCard = document.createElement("div");
            repoCard.classList.add("repo-card");
            repoCard.innerHTML = `
              <p><strong>${repo.name}</strong></p>
              <p>${repo.description || "No description available"}</p>
              <a href="${repo.html_url}" target="_blank">View Repository</a>
            `;
            userReposContainer.appendChild(repoCard);
          });
  
          resultsContainer.innerHTML = ""; // Clear previous results and display repos
          resultsContainer.appendChild(userReposContainer);
        })
        .catch((error) => console.error("Error fetching repositories:", error));
    }
  
    // Function to search repositories by keyword
    function searchRepositories(query) {
      fetch(`https://api.github.com/search/repositories?q=${query}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          data.items.forEach((repo) => {
            const repoCard = document.createElement("div");
            repoCard.classList.add("repo-card");
            repoCard.innerHTML = `
              <p><strong>${repo.name}</strong> by ${repo.owner.login}</p>
              <p>${repo.description || "No description available"}</p>
              <a href="${repo.html_url}" target="_blank">View Repository</a>
            `;
            resultsContainer.appendChild(repoCard);
          });
        })
        .catch((error) => console.error("Error fetching repositories:", error));
    }
  });
  