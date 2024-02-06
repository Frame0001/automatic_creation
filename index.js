document.addEventListener("DOMContentLoaded", function () {
  // Example JSON data
  let jsonData = {
      m1: { oee: 80, nq: 60, status: "Good", goodparts: 50, badparts: 50 },
      m2: { oee: 30, nq: 10, status: "Good", goodparts: 540, badparts: 510 },
  };

  // Function to create and append a gauge element to a box
  function appendGauge(boxElement, oeeValue, nqValue) {
      var gaugeContainer = document.createElement("div");
      gaugeContainer.classList.add("gauge");

      // Create OEE gauge
      var oeeGauge = createGauge("OEE", oeeValue);
      gaugeContainer.appendChild(oeeGauge);

      // Create NQ gauge
      var nqGauge = createGauge("NQ", nqValue);
      gaugeContainer.appendChild(nqGauge);

      boxElement.appendChild(gaugeContainer);
  }

  // Function to create a gauge element
  function createGauge(label, value) {
      var gaugeElement = document.createElement("div");
      gaugeElement.classList.add("gauge");

      var gaugeValueElement = document.createElement("div");
      gaugeValueElement.classList.add("gauge-value");
      gaugeValueElement.textContent = label + ": " + value + "%";

      var gaugeNeedleElement = document.createElement("div");
      gaugeNeedleElement.classList.add("gauge-needle");
      var rotationAngle = (value / 100) * 180 - 90;
      gaugeNeedleElement.style.transform = "rotate(" + rotationAngle + "deg)";

      gaugeElement.appendChild(gaugeValueElement);
      gaugeElement.appendChild(gaugeNeedleElement);

      return gaugeElement;
  }

  // Function to render JSON data
  function renderJson(data, parentElement) {
      for (var key in data) {
          if (data.hasOwnProperty(key)) {
              var value = data[key];
              var box = document.createElement("div");
              var keyElement = document.createElement("div");
              var valueElement = document.createElement("div");

              // Use the key as the class for both key and value elements
              var keyClass = "json-" + key.toLowerCase();
              keyElement.classList.add("json-key", keyClass);
              valueElement.classList.add("json-value", keyClass);

              // Check if the value is an object (nested JSON)
              if (typeof value === "object") {
                  keyElement.textContent = key + " (click to view detailed stats)";
                  keyElement.classList.add("nested");

                  // Add click event to the box to display detailed statistics
                  box.addEventListener("click", function () {
                      displayDetailedStats(value, key);
                  });

                  // Recursively render nested JSON
                  renderJson(value, valueElement);

                  // Create and append gauges for OEE and NQ
                  var oeeValue = value.oee || 0;
                  var nqValue = value.nq || 0;
                  appendGauge(box, oeeValue, nqValue);
              } else {
                  // Display the name of the value in the box
                  keyElement.textContent = key + ":";
                  valueElement.textContent = key === 'status' ? value : value + "%";
              }

              box.classList.add(`json-box`);
              box.classList.add(`json-box-${key.toLowerCase()}`);
              box.appendChild(keyElement);
              box.appendChild(valueElement);

              parentElement.appendChild(box);
          }
      }
  }

  // Function to update HTML content with JSON data
  function updateHtmlWithJson(jsonData) {
      // Get the container element
      var jsonContainer = document.getElementById("jsonContainer");

      // Check if the container element exists
      if (!jsonContainer) {
          console.error("Error: Container element not found.");
          return;
      }

      // Clear the existing content
      jsonContainer.innerHTML = "";

      // Render the updated JSON data
      renderJson(jsonData, jsonContainer);
  }

  // Function to display detailed statistics for the selected machine
  function displayDetailedStats(machineData, machineName) {
      // You can implement the logic to display detailed statistics
      // For now, let's log the selected machine's data to the console
      console.log("Selected Machine:", machineName);
      console.log("Detailed Stats:", machineData);
  }

  // Set up the uibuilder.onChange callback
  uibuilder.onChange('msg', (msg) => {
      // Extract the JSON data from the msg payload
      var receivedData = msg.payload;

      // Log the received JSON data to the console
      console.log(receivedData);

      // Update HTML content with the received JSON data
      updateHtmlWithJson(receivedData);
  });

  // Initial rendering with the example JSON data
  updateHtmlWithJson(jsonData);
});
