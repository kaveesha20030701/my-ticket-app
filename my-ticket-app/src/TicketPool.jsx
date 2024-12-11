import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

function TicketPool() {
  const [formData, setFormData] = useState({
    totalTickets: "",
    ticketReleaseRate: "",
    customerRetrievalRate: "",
    maxTicketCapacity: "",
    numberOfVendors: "",
    numberOfCustomers: "",
  });

  const [status, setStatus] = useState(""); // State to hold simulation status

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure value is a number and no negative numbers
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleStart = async () => {
    const {
      totalTickets,
      ticketReleaseRate,
      customerRetrievalRate,
      maxTicketCapacity,
    } = formData;

    // Validate if the inputs are empty or contain negative values
    if (
      !totalTickets ||
      !ticketReleaseRate ||
      !customerRetrievalRate ||
      !maxTicketCapacity
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    if (
      parseFloat(totalTickets) <= 0 ||
      parseFloat(ticketReleaseRate) <= 0 ||
      parseFloat(customerRetrievalRate) <= 0 ||
      parseFloat(maxTicketCapacity) <= 0
    ) {
      alert("Please enter positive values for all fields!");
      return;
    }

    // const handleStart = async () => {
    const payload = {
      totalTickets: formData.totalTickets,
      ticketReleaseRate: formData.ticketReleaseRate,
      customerRetrievalRate: formData.customerRetrievalRate,
      maxTicketCapacity: formData.maxTicketCapacity,
      numVendors: formData.numberOfVendors,
      numCustomers: formData.numberOfCustomers,
    };
    // }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/tickets/startSimulation",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        alert("Simulation started successfully!");
      } else {
        alert("Failed to start the simulation.");
      }
    } catch (error) {
      console.error("Error starting simulation:", error);
      alert("Error starting simulation");
    }
  };

  const handleLoad = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/tickets/status-note"
      );
      console.log("Fire", response.data);

      setStatus(response.data); // Update the status from the backend
    } catch (error) {
      console.error("Error fetching status:", error);
      alert("Error fetching status");
    }
  };

  // old source code
  // const handleLoad = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:8080/api/tickets/status"
  //     );
  //     setStatus(response.data); // Update the status from the backend
  //   } catch (error) {
  //     console.error("Error fetching status:", error);
  //     alert("Error fetching status");
  //   }
  // };

  const handleStop = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/tickets/stopSimulation"
      );
      if (response.status === 200) {
        alert("Simulation stopped successfully!");
        setStatus("Not running"); // Optionally, reset status
      } else {
        alert("Failed to stop the simulation.");
      }
    } catch (error) {
      console.error("Error stopping simulation:", error);
      alert("Error stopping simulation");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {/* Left Configuration Box */}
      <div className="info-box">
        <h1>WELCOME TO TICKETPOOL</h1>
        <div className="form-container">
          <h2>Ticket Configuration Information</h2>
          <form>
            <label>
              Total Number of tickets:
              <input
                type="text"
                name="totalTickets"
                value={formData.totalTickets}
                onChange={handleChange}
              />
            </label>
            <label>
              Ticket Release rate:
              <input
                type="text"
                name="ticketReleaseRate"
                value={formData.ticketReleaseRate}
                onChange={handleChange}
              />
            </label>
            <label>
              Customer Retrieval Rate:
              <input
                type="text"
                name="customerRetrievalRate"
                value={formData.customerRetrievalRate}
                onChange={handleChange}
              />
            </label>
            <label>
              Maximum Ticket Capacity:
              <input
                type="text"
                name="maxTicketCapacity"
                value={formData.maxTicketCapacity}
                onChange={handleChange}
              />
            </label>
            <label>
              Number of Vendors:
              <input
                type="text"
                name="numberOfVendors"
                value={formData.numberOfVendors}
                onChange={handleChange}
              />
            </label>
            <label>
              Number of Customers:
              <input
                type="text"
                name="numberOfCustomers"
                value={formData.numberOfCustomers}
                onChange={handleChange}
              />
            </label>
          </form>
          <div className="buttons-container">
            <div className="buttons">
              <button onClick={handleStart}>Start System</button>
              <button onClick={handleLoad}>Display Status</button>
              <button onClick={handleStop}>Stop System</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Status Box */}
      <div className="status-container">
        <h2>Simulation Status</h2>
        <div className="status-box">
          {status ? (
            status.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))
          ) : (
            <p>No status available. Start the simulation to see the status.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketPool;
