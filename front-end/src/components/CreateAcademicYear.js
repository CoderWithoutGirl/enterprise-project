import React, { useState, useEffect } from "react";
import DateTimePicker from "./DateTimePicker";

const CreateAcademicYear = () => {
  const [minDate, setMinDate] = useState();

  useEffect(() => {
    loadDate();
  }, []);

  const loadDate = () => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    today = yyyy + "-" + mm + "-" + dd;
    setMinDate(today);
    console.log(today);
  };
  return <DateTimePicker min={minDate} />;
};

export default CreateAcademicYear;
