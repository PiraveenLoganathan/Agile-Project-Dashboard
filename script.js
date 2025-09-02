document.addEventListener("DOMContentLoaded", () => {
    let stakeholders = [];
    let userStories = [];
    let storyIdCounter = 1;

    // DOM elements
    const stakeholderList = document.getElementById("stakeholderList");
    const storyList = document.getElementById("storyList");
    const backlogList = document.getElementById("backlogList");

    const totalStories = document.getElementById("totalStories");
    const completedStories = document.getElementById("completedStories");
    const totalPoints = document.getElementById("totalPoints");
    const completionRate = document.getElementById("completionRate");

    // Add Stakeholder
    document.getElementById("addStakeholderBtn").addEventListener("click", () => {
        const name = document.getElementById("stakeholderName").value.trim();
        const role = document.getElementById("stakeholderRole").value;
        const influence = document.getElementById("stakeholderInfluence").value;

        if (!name || !role || !influence) {
            alert("Please fill all stakeholder fields");
            return;
        }

        stakeholders.push({ name, role, influence });
        document.getElementById("stakeholderName").value = "";
        document.getElementById("stakeholderRole").value = "";
        document.getElementById("stakeholderInfluence").value = "";

        renderStakeholders();
    });

    function renderStakeholders() {
        stakeholderList.innerHTML = stakeholders.map(s => `
            <div class="item">
                <strong>${s.name}</strong> - ${s.role} (${s.influence} Influence)
            </div>
        `).join('');
    }

    // Add User Story
    document.getElementById("addUserStoryBtn").addEventListener("click", () => {
        const title = document.getElementById("storyTitle").value.trim();
        const description = document.getElementById("storyDescription").value.trim();
        const priority = document.getElementById("storyPriority").value;
        const points = parseInt(document.getElementById("storyPoints").value);

        if (!title || !description || !priority || !points) {
            alert("Please fill all user story fields");
            return;
        }

        userStories.push({ id: storyIdCounter++, title, description, priority, points, status: "backlog" });
        document.getElementById("storyTitle").value = "";
        document.getElementById("storyDescription").value = "";
        document.getElementById("storyPriority").value = "";
        document.getElementById("storyPoints").value = "";

        updateDisplay();
    });

    // Toggle story status
    function toggleStatus(id) {
        const story = userStories.find(s => s.id === id);
        const statuses = ["backlog", "progress", "testing", "done"];
        story.status = statuses[(statuses.indexOf(story.status)+1)%statuses.length];
        updateDisplay();
    }

    // Render stories
    function renderStories() {
        storyList.innerHTML = userStories.map(s => `
            <div class="item" onclick="toggleStatus(${s.id})">
                <strong>${s.title}</strong> (${s.priority}) - ${s.points} pts
            </div>
        `).join('');

        backlogList.innerHTML = userStories
            .sort((a,b) => ({high:3, medium:2, low:1}[b.priority] - {high:3, medium:2, low:1}[a.priority]))
            .map(s => `
                <div class="item" onclick="toggleStatus(${s.id})">
                    <strong>${s.title}</strong> - ${s.status} (${s.priority}, ${s.points} pts)
                </div>
            `).join('');
    }

    // Update KPIs and display
    function updateKPIs() {
        totalStories.textContent = userStories.length;
        completedStories.textContent = userStories.filter(s => s.status === "done").length;
        totalPoints.textContent = userStories.reduce((a,b)=>a+b.points,0);
        completionRate.textContent = userStories.length>0 ?
            Math.round(userStories.filter(s => s.status==="done").length/userStories.length*100)+"%" : "0%";
    }

    function updateDisplay() {
        renderStories();
        updateKPIs();
    }

    window.toggleStatus = toggleStatus; // make accessible from onclick
});
