import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    fever: 0,
    cough: 0,
    fatigue: 0,
    headache: 0,
    sore_throat: 0,
    breathing_difficulty: 0,
    chest_pain: 0,
    body_ache: 0,
  });

  const [report, setReport] = useState("");
  const [disease, setDisease] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:5000/predict", {
        ...form,
        fever: Number(form.fever),
        cough: Number(form.cough),
        fatigue: Number(form.fatigue),
        headache: Number(form.headache),
        sore_throat: Number(form.sore_throat),
        breathing_difficulty: Number(form.breathing_difficulty),
        chest_pain: Number(form.chest_pain),
        body_ache: Number(form.body_ache),
      });

      setDisease(res.data.disease);
      setReport(res.data.report);
      setLoading(false);
    } catch (error) {
      alert("Error generating report");
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(report, 10, 10);
    doc.save("Medical_Report.pdf");
  };

  return (
    <div className="container">
      <h2>Federated ML + LLM Medical Report Generator</h2>

      <div className="form">
        <input name="name" placeholder="Patient Name" onChange={handleChange} />

        <input name="age" placeholder="Age" onChange={handleChange} />

        <select name="gender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {[
          "fever",
          "cough",
          "fatigue",
          "headache",
          "sore_throat",
          "breathing_difficulty",
          "chest_pain",
          "body_ache",
        ].map((symptom) => (
          <input
            key={symptom}
            name={symptom}
            placeholder={`${symptom.replace("_", " ")} (0 or 1)`}
            onChange={handleChange}
          />
        ))}

        <button onClick={handleSubmit}>
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {report && (
        <div className="report">
          <h3>Predicted Disease: {disease}</h3>
          <pre>{report}</pre>
          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      )}
    </div>
  );
}

export default App;
