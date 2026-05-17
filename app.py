from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ---------------- Symptom → Probable Conditions Map ----------------
SYMPTOM_CONDITIONS = {
    "chest pain": ["Heart Attack", "Angina", "Acid Reflux"],
    "headache": ["Migraine", "Tension Headache", "Dehydration"],
    "fever": ["Flu", "Viral Infection", "COVID-19"],
    "cough": ["Cold", "Flu", "Bronchitis"],
    "breathing": ["Asthma", "Pneumonia", "Heart Problem"],
    "weakness": ["Anemia", "Low Blood Pressure", "Dehydration"],
    "bleeding": ["Injury", "Internal Bleeding", "Blood Disorder"]
}

# ---------------- Emergency Score Engine ----------------
def calculate_emergency_score(symptoms):
    score = 0
    red_flags = ["chest pain", "breathing", "unconscious", "weakness", "bleeding"]

    for symptom in symptoms:
        symptom_lower = symptom.lower()
        if symptom_lower in red_flags:
            score += 5
        else:
            score += 1

    if score >= 8:
        level = "Critical"
    elif score >= 4:
        level = "Urgent"
    else:
        level = "Normal"

    return score, level

# ---------------- Doctor Summary Generator ----------------
def generate_doctor_summary(symptoms, level):
    probable_conditions = []
    for symptom in symptoms:
        symptom_lower = symptom.lower()
        if symptom_lower in SYMPTOM_CONDITIONS:
            probable_conditions.extend(SYMPTOM_CONDITIONS[symptom_lower])

    if not probable_conditions:
        probable_conditions = ["General Checkup Recommended"]

    return f"""
Symptoms Reported: {', '.join(symptoms)}
Probable Conditions: {', '.join(probable_conditions)}
Emergency Level: {level}
Suggested Action: {'Visit emergency immediately' if level=='Critical' else 'Consult a doctor'}
Recommended Specialist: {'Cardiologist' if 'chest pain' in [s.lower() for s in symptoms] else 'General Physician'}
"""

# ---------------- API Route ----------------
@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    symptoms = data.get("symptoms", [])

    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    score, level = calculate_emergency_score(symptoms)
    summary = generate_doctor_summary(symptoms, level)

    return jsonify({
        "emergency_score": score,
        "risk_level": level,
        "doctor_summary": summary
    })

if __name__ == "__main__":
    app.run(debug=True)
