import { useState, useEffect } from "react";
import PieChart from "./components/pieChart";
import "./App.css";
function App() {
  const [currentDate, setCurrentDate] = useState(new Date("2021-05-29")); // Current Date Fetch from current_date.json in public/data
  const [vaccineDates, setVaccineDates] = useState([]); // List Of Vaccine Dates Fetch from vaccine_dates.json in public/data
  const [percentageVaccinated, setPercentageVaccinated] = useState(0);

  useEffect(() => {
    async function fetchData() {
      // get current date from public/data and store it in state
      const currentDateFromJson = await (await fetch("/data/current_date.json")).json();
      setCurrentDate(() => new Date(currentDateFromJson.current_date));


      // get vaccine date information from public/data
      const vaccineInfoFromJson = await (await fetch("/data/vaccine_dates.json")).json();

      // Get all the vaccination dates and store it in state
      setVaccineDates(() => {
        return vaccineInfoFromJson.map((vaccineDate) => {
          return vaccineDate.vaccination_date;
        })
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    // for setting percentage and chart for initial current date
    const vaccinatedDates = vaccineDates.filter((vaccineDate) => new Date(vaccineDate).getTime() <= currentDate.getTime());
    const percentage = vaccinatedDates.length / vaccineDates.length * 100;
    setPercentageVaccinated(percentage);
  }, [vaccineDates, currentDate])

  const setDate = (changeCriteria) => {
    // get current date with changeCriteria = +1 OR -1
    const curDate = new Date(currentDate.setDate(currentDate.getDate() + changeCriteria));
    // set Current Date to state
    setCurrentDate(curDate);


    // get total vvaccinated people by filtering out
    const vaccinatedDates = vaccineDates.filter((vaccineDate) => new Date(vaccineDate).getTime() <= currentDate.getTime());

    // get percentage of vaccinated people till the currently selected date
    const percentage = vaccinatedDates.length / vaccineDates.length * 100;
    setPercentageVaccinated(percentage);
  }

  return (
    <div className="App">
      <br />
      <div className="date">
        <button onClick={() => setDate(1)}>+</button> {/* Set Current Date to next date on click  */}
        <div className="currentdate">{currentDate.toDateString()}</div>
        <button onClick={() => setDate(-1)}>-</button> {/* Set Current Date to previous date on click  */}
      </div>
      <div className="chart">
        {/* Update the following Component to display pie chart with proper data, alignment and colors */}
        <PieChart data={[percentageVaccinated, (100 - percentageVaccinated)]} />
      </div>
    </div>
  );
}

export default App;
