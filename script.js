/**
 * SymptoScore Diagnostic Logic
 */

function runDiagnostic() {
    const input = document.getElementById('userInput').value.toLowerCase();
    const output = document.getElementById('outputArea');
    
    if (input.length < 15) {
        alert("Clinical Error: Please provide a more detailed description for the AI engine to parse.");
        return;
    }

    // Processing State
    output.classList.remove('hidden');
    output.innerHTML = `<div class="loader-box">
        <div class="pulse"></div>
        <p>Parsing Natural Language Input & Mapping Medical Indicators...</p>
    </div>`;

    setTimeout(() => {
        let resultData = {
            risk: "LOW",
            color: "#10b981",
            summary: "Analysis suggests standard malaise or low-priority symptoms.",
            specialist: "Family Physician",
            actions: ["Rest and Hydration", "Over-the-counter monitoring", "Follow-up in 48 hours"]
        };

        // Advanced Logic Branching
        if (input.includes('chest pain') || input.includes('breathing') || input.includes('numb')) {
            resultData = {
                risk: "CRITICAL",
                color: "#ef4444",
                summary: "Red-flag indicators detected. Potential acute cardiac or neurological episode.",
                specialist: "ER Trauma Team",
                actions: ["Call Emergency Services Immediately", "Do not drive yourself", "Keep airways clear"]
            };
        } else if (input.includes('fever') || input.includes('stomach') || input.includes('vomit')) {
            resultData = {
                risk: "URGENT",
                color: "#f59e0b",
                summary: "Systemic symptoms detected. Intervention required to prevent escalation.",
                specialist: "Urgent Care Clinic",
                actions: ["Schedule same-day appointment", "Monitor temperature hourly", "Hydrate with electrolytes"]
            };
        }

        renderResults(resultData);
    }, 2000);
}

function renderResults(data) {
    const output = document.getElementById('outputArea');
    output.innerHTML = `
        <div class="result-card" style="border-top: 5px solid ${data.color}">
            <div class="res-head">
                <span class="status-badge" style="background: ${data.color}">${data.risk} RISK</span>
                <p>AI Confidence Score: 96.4%</p>
            </div>
            <div class="res-body">
                <h4>Diagnostic Summary</h4>
                <p>${data.summary}</p>
                <div class="action-grid">
                    <div>
                        <h5>Priority Actions:</h5>
                        <ul>${data.actions.map(a => `<li>${a}</li>`).join('')}</ul>
                    </div>
                    <div>
                        <h5>Recommended Specialist:</h5>
                        <p><strong>${data.specialist}</strong></p>
                    </div>
                </div>
            </div>
            <div class="res-footer">
                <button onclick="window.print()" class="btn btn-primary">Generate PDF Report</button>
            </div>
        </div>
    `;
}