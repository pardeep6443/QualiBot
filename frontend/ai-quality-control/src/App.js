import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import {CategoryScale} from 'chart.js'; 
Chart.register(CategoryScale);
function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error uploading the image", error);
    }
  };

  return (
    <div className="App">
      <h1>AI-Powered Quality Control</h1>
      <input type="file" onChange={handleImageUpload} />
      <button onClick={handleSubmit}>Upload & Detect</button>
      
      {result && (
        <div>
          <h2>Defect Detection Results</h2>
          <p>{result.message}</p>
          <img src={`data:image/jpeg;base64,${result.image}`} alt="Processed" />
        </div>
      )}

      <div>
        <h2>Machine Performance</h2>
        <Line
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Defect Rate",
                data: [10, 20, 15, 30, 25, 40],
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

export default App;