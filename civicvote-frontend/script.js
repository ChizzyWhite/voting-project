const election = [
  { id: "president", title: "Student Union President", candidates: [
    {id:"p1",name:"Amara Okafor",initials:"AO",dept:"Computer Science · 400 Level",color:"#5c75d9",manifesto:"Promises more student-led tech events and clearer communication with faculty.",votes:342},
    {id:"p2",name:"Daniel Eze",initials:"DE",dept:"Political Science · 300 Level",color:"#d78354",manifesto:"Focuses on improved campus facilities, student welfare, and transparent budgeting.",votes:286},
    {id:"p3",name:"Fatima Bello",initials:"FB",dept:"Economics · 400 Level",color:"#29a783",manifesto:"Plans stronger career support, internship partnerships, and inclusive student activities.",votes:174},
    {id:"p4",name:"Samuel James",initials:"SJ",dept:"Mass Communication · 300 Level",color:"#9069c9",manifesto:"Wants a more responsive student union and regular open forums.",votes:98}
  ]},
  { id: "vice", title: "Vice President", candidates: [
    {id:"v1",name:"Grace Nwosu",initials:"GN",dept:"Biochemistry · 400 Level",color:"#29a783",manifesto:"Supports student clubs, peer mentoring, and accessible campus services.",votes:405},
    {id:"v2",name:"Michael Adeyemi",initials:"MA",dept:"Computer Science · 300 Level",color:"#5c75d9",manifesto:"Focuses on digital student services and quicker issue resolution.",votes:317},
    {id:"v3",name:"Joy Peter",initials:"JP",dept:"Accounting · 300 Level",color:"#d78354",manifesto:"Promotes student wellness, academic support, and better event planning.",votes:178}
  ]},
  { id: "secretary", title: "General Secretary", candidates: [
    {id:"s1",name:"Ibrahim Musa",initials:"IM",dept:"Public Administration · 400 Level",color:"#9069c9",manifesto:"Commits to accurate meeting records and timely publication of union updates.",votes:382},
    {id:"s2",name:"Esther Udo",initials:"EU",dept:"English · 300 Level",color:"#29a783",manifesto:"Wants clear minutes, organized records, and an easy-to-find student noticeboard.",votes:336},
    {id:"s3",name:"Peter Obioma",initials:"PO",dept:"Law · 300 Level",color:"#d78354",manifesto:"Prioritizes accountability and consistent communication between representatives.",votes:182}
  ]}
];

const storageKey = "civicvote-demo-v1";
let selections = {};
let submitted = false;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  selections = saved.selections || {};
  submitted = Boolean(saved.submitted);
} catch (_) {}
const positionsContainer = document.getElementById("positionsContainer");
const toast = document.getElementById("toast");
let toastTimer;

function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify({selections, submitted})); } catch (_) {}
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}
function candidateById(id) {
  for (const position of election) {
    const candidate = position.candidates.find(c => c.id === id);
    if (candidate) return candidate;
  }
  return null;
}
function renderBallot() {
  positionsContainer.innerHTML = "";
  election.forEach((position, index) => {
    const section = document.createElement("section");
    section.className = "position-ballot";
    const chosen = Boolean(selections[position.id]);
    section.innerHTML = `<div class="position-ballot-head"><h3>${String(index+1).padStart(2,"0")}. ${position.title}</h3><span>${chosen ? "Selection made ✓" : `${position.candidates.length} candidates · Choose one`}</span></div>`;
    const grid = document.createElement("div");
    grid.className = "candidate-grid";
    position.candidates.forEach(candidate => {
      const selected = selections[position.id] === candidate.id;
      const card = document.createElement("button");
      card.type = "button";
      card.className = `candidate-card${selected ? " selected" : ""}`;
      card.setAttribute("aria-pressed", String(selected));
      card.disabled = submitted;
      card.innerHTML = `<span class="candidate-avatar" style="background:${candidate.color}">${candidate.initials}</span><span class="candidate-meta"><strong>${candidate.name}</strong><small>${candidate.dept}</small><p>${candidate.manifesto}</p></span><span class="select-circle">${selected ? "✓" : ""}</span>`;
      card.addEventListener("click", () => {
        if (submitted) return;
        selections[position.id] = candidate.id;
        persist();
        renderBallot();
        showToast(`${candidate.name} selected for ${position.title}.`);
      });
      grid.appendChild(card);
    });
    section.appendChild(grid);
    positionsContainer.appendChild(section);
  });
  updateProgress();
}
function updateProgress() {
  const count = election.filter(p => selections[p.id]).length;
  const percent = Math.round(count / election.length * 100);
  document.getElementById("progressLabel").textContent = `${count} of ${election.length} positions selected`;
  document.getElementById("progressPercent").textContent = `${percent}%`;
  document.getElementById("progressBar").style.width = `${percent}%`;
  document.getElementById("selectionSummary").textContent = submitted ? "Your demo ballot has been submitted" : count ? `${count} of ${election.length} selections complete` : "No selections yet";
  document.getElementById("selectionHint").textContent = submitted ? "This browser has saved the completion status." : count === election.length ? "You're ready to review your ballot." : "Choose one candidate for each position to continue.";
  document.getElementById("reviewVoteButton").disabled = count !== election.length || submitted;
  document.getElementById("reviewVoteButton").innerHTML = submitted ? "Ballot submitted ✓" : 'Review my vote <span>→</span>';
}
function renderResults() {
  const root = document.getElementById("resultsContainer");
  root.innerHTML = "";
  election.forEach(position => {
    const total = position.candidates.reduce((sum, c) => sum + c.votes, 0);
    const sorted = [...position.candidates].sort((a,b) => b.votes-a.votes);
    const card = document.createElement("article");
    card.className = "result-card";
    card.innerHTML = `<h3>${position.title}</h3><p>${total.toLocaleString()} sample votes counted</p>`;
    sorted.forEach((candidate, i) => {
      const percent = Math.round(candidate.votes / total * 100);
      const row = document.createElement("div");
      row.className = `result-row${i===0 ? " leader" : ""}`;
      row.innerHTML = `<div class="result-name"><span class="candidate-avatar" style="background:${candidate.color}">${candidate.initials}</span><strong>${candidate.name}</strong>${i===0 ? '<span class="leader-tag">LEADING</span>' : ""}<span>${percent}%</span></div><div class="result-track"><span style="width:${percent}%"></span></div>`;
      card.appendChild(row);
    });
    root.appendChild(card);
  });
}
function openReview() {
  const list = document.getElementById("reviewList");
  list.innerHTML = "";
  election.forEach(position => {
    const candidate = candidateById(selections[position.id]);
    const row = document.createElement("div");
    row.className = "review-item";
    row.innerHTML = `<span>${position.title}</span><strong>${candidate ? candidate.name : "Not selected"}</strong>`;
    list.appendChild(row);
  });
  document.getElementById("reviewModal").classList.add("open");
}
function setView(name) {
  if (!document.getElementById(`${name}View`)) return;
  document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
  document.getElementById(`${name}View`).classList.add("active");
  document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.view === name));
  const labels = {overview:"Overview",vote:"Cast your vote",results:"Election results",guide:"Voting guide"};
  document.getElementById("pageLabel").textContent = labels[name] || "Overview";
  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("notificationButton").addEventListener("click", () => showToast("You're all caught up. No new election notifications."));
document.getElementById("reviewVoteButton").addEventListener("click", () => {
  if (submitted) return showToast("Your demo ballot has already been submitted.");
  if (election.some(p => !selections[p.id])) return showToast("Please choose one candidate for every position.");
  openReview();
});
document.getElementById("closeModal").addEventListener("click", () => document.getElementById("reviewModal").classList.remove("open"));
document.getElementById("backToBallot").addEventListener("click", () => document.getElementById("reviewModal").classList.remove("open"));
document.getElementById("reviewModal").addEventListener("click", e => {
  if (e.target.id === "reviewModal") e.currentTarget.classList.remove("open");
});
document.getElementById("confirmVoteButton").addEventListener("click", () => {
  submitted = true;
  persist();
  document.getElementById("reviewModal").classList.remove("open");
  renderBallot();
  showToast("Demo ballot submitted successfully. Thank you for participating!");
  setView("vote");
});
if (submitted) {
  // Keep the saved demo state visible after a refresh; the user can reset it from browser storage.
  showToast("Your demo ballot is already marked as submitted.");
}
renderBallot();
renderResults();
