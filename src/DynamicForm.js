import React, { useEffect, useReducer, useState } from "react";
import { useAuth } from "./AuthContext";
import Login from "./Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash"; // Import debounce from lodash
import Autocomplete from "@mui/material/Autocomplete";
import Divider from "@mui/material/Divider";

import {
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  Collapse,
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
  Paper,
  Stack,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import CalendarComponent from "./DateCalendarValue";

const week_days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Initial state for a single form
const initialFormState = {
  firstName: "",
  lastName: "",
  idNumber: "",
  address: "",
  birthday: "",
  zipcode: "",
  startDate: "",
  endDate: "",
  rate: "",
  serviceDays: [],
  hoursPerDay: [],
  datesToSkip: "",
};

const DynamicForm = () => {
  const [fieldValidation, setFieldValidation] = useState({
    firstName: { touched: false, valid: true },
    lastName: { touched: false, valid: true },
    idNumber: { touched: false, valid: true },
    address: { touched: false, valid: true },
    birthday: { touched: false, valid: true },
    zipcode: { touched: false, valid: true },
    startDate: { touched: false, valid: true },
    endDate: { touched: false, valid: true },
    rate: { touched: false, valid: true },
    // Add other fields as necessary
  });
  const handleFieldBlur = (fieldName) => {
    setFieldValidation((prevState) => ({
      ...prevState,
      [fieldName]: { ...prevState[fieldName], touched: true },
    }));
  };

  // Inside your component
  const { getIdToken, showWelcomeMessage } = useAuth(); // Destructure to get the getIdToken function
  const [resetCounter, setResetCounter] = useState(0);

  const [forms, setForms] = useState([{ id: 1, collapsed: false }]);
  const [daysAndHours, setDaysAndHours] = useState({
    monday: { checked: false, hours: "" },
    tuesday: { checked: false, hours: "" },
    wednesday: { checked: false, hours: "" },
    thursday: { checked: false, hours: "" },
    friday: { checked: false, hours: "" },
    saturday: { checked: false, hours: "" },
    sunday: { checked: false, hours: "" },
  });
  // const [formData, setFormdata] = useState([])
  function reducer(state, action) {
    if (action.type === "resetForm") {
      return state.map((form, index) => {
        if (index === action.index) {
          initialFormState.serviceDays.map(() => ""); // Reset hoursPerDay based on serviceDays
          return {
            ...initialFormState,
            hoursPerDay: initialFormState.serviceDays.map(() => ""),
          };
        }
        return form;
      });
    }
    if (action.type === "onChange") {
      let newState = [...state];
      let newObj = { ...state[action.index], [action.fieldName]: action.value };
      newState[action.index] = newObj;
      return newState;
    } else if (action.type === "addForm") {
      let newState = [...state];
      newState.push({
        firstName: "",
        lastName: "",
        idNumber: "",
        address: "",
        birthday: "",
        zipcode: "",
        startDate: "",
        endDate: "",
        rate: "",
        serviceDays: [],
        hoursPerDay: [],
        datesToSkip: "",
      });
      return newState;
    } else if (action.type === "deleteForm") {
      let newState = [...state];
      newState.splice(action.index, 1);
      console.log("=======>", newState);
      return newState;
    } else if (action.type === "checkbox") {
      const updatedFormData = [...state];
      const updatedForm = { ...updatedFormData[action.index] };
      const updatedServiceDays = [...updatedForm.serviceDays];

      // Toggle the checkbox value for the specified day
      const dayIndex = updatedServiceDays.indexOf(action.day);
      if (dayIndex === -1) {
        updatedServiceDays.push(action.day);
      } else {
        updatedServiceDays.splice(dayIndex, 1);
        updatedForm.hoursPerDay.splice(dayIndex, 1);
      }

      updatedForm.serviceDays = updatedServiceDays;
      updatedFormData[action.index] = updatedForm;
      return updatedFormData;
    } else if (action.type === "hours") {
      const updatedFormData = [...state];
      const updatedForm = { ...updatedFormData[action.index] };
      const updatedServiceDays = [...updatedForm.serviceDays];

      const dayIndex = updatedServiceDays.indexOf(action.day);
      updatedForm.hoursPerDay[dayIndex] = parseFloat(action.value) || 0; // Convert to float
      updatedFormData[action.index] = updatedForm;

      return updatedFormData;
    }
  }
  const [formData, dispatch] = useReducer(reducer, [
    {
      firstName: "",
      lastName: "",
      idNumber: "",
      address: "",
      birthday: "",
      zipcode: "",
      startDate: "",
      endDate: "",
      rate: "",
      serviceDays: [],
      hoursPerDay: [],
      datesToSkip: "",
    },
  ]);
  // console.log(formData);

  const handleCheckboxChange = (day) => {
    setDaysAndHours((prevDaysAndHours) => ({
      ...prevDaysAndHours,
      [day]: {
        // ...prevDaysAndHours[day],
        checked: !prevDaysAndHours[day].checked,
        hours: prevDaysAndHours[day].checked ? "" : prevDaysAndHours[day].hours,
      },
    }));
  };

  // Function to handle name selection
  const handleNameSelect = (event) => {
    setSelectedFirstName(event.target.value); // Corrected
  };

  // Inside your component
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [selectedFirstName, setSelectedFirstName] = useState(""); // To store the selected first name

  const suggestNames = async (value) => {
    if (value.length > 1) {
      const token = await getIdToken();
      fetch(`http://localhost:8080/api/users/search?firstName=${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setNameSuggestions(data);
        })
        .catch((error) => console.error("Error fetching suggestions:", error));
    }
  };

  const handleSelectName = async (firstName, index) => {
    setSelectedFirstName(firstName);
    if (firstName && nameSuggestions.includes(firstName)) {
      // Call the debounced autocomplete function only if the selected name is in the suggestions
      handleDebouncedAutocomplete(firstName, index, dispatch, getIdToken);
    }
    // Do nothing if the name is not in the suggestions.
    // This allows the user to continue typing a new name without interruption.
  };

  const AUTOCOMPLETE_TOAST_ID = "autocomplete-toast";

  const handleDebouncedAutocomplete = debounce(
    async (firstName, index, dispatch, getIdToken) => {
      let toastId;
      if (firstName.length > 1) {
        try {
          if (!toast.isActive(AUTOCOMPLETE_TOAST_ID)) {
            toast.info("Requesting autocompletion...", {
              autoClose: false,
              toastId: AUTOCOMPLETE_TOAST_ID,
            });
          }
          const token = await getIdToken(); // Retrieve the Firebase ID token
          const response = await fetch(
            `http://localhost:8080/api/users/details?firstName=${firstName}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              },
            }
          );
          if (!response.ok) {
            console.log("can't connect to the backend");
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();

          // Autofill only if the response contains a valid "First Name"
          if (data.firstName) {
            const receivedData = data; // The received data from the backend
            dispatch({
              type: "onChange",
              index,
              fieldName: "firstName",
              value: receivedData.firstName,
            });
            dispatch({
              type: "onChange",
              index,
              fieldName: "lastName",
              value: receivedData.lastName,
            });
            dispatch({
              type: "onChange",
              index,
              fieldName: "idNumber",
              value: receivedData.idNumber,
            });
            dispatch({
              type: "onChange",
              index,
              fieldName: "address",
              value: receivedData.address,
            });
            dispatch({
              type: "onChange",
              index,
              fieldName: "birthday",
              value: receivedData.birthday,
            });
            dispatch({
              type: "onChange",
              index,
              fieldName: "zipcode",
              value: receivedData.zipcode,
            });
            dispatch({
              type: "onChange",
              index,
              fieldName: "rate",
              value: receivedData.rate.toString(),
            });

            // Autopopulate service days and hours
            // Autopopulate service days and hours
            if (receivedData.dateRanges && receivedData.dateRanges.length > 0) {
              const dateRange = receivedData.dateRanges[0];
              const daysOfWeek = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ];

              daysOfWeek.forEach((day) => {
                const dayKey = day.toLowerCase() + "Hours"; // Convert day to lowercase and add "Hours" to match the field name
                const hours = dateRange[dayKey];

                if (hours !== undefined && hours > 0) {
                  const dayUpper = day.toUpperCase();
                  dispatch({ type: "checkbox", index, day: dayUpper }); // This will check the day
                  dispatch({
                    type: "hours",
                    index,
                    day: dayUpper,
                    value: hours.toString(),
                  }); // This will set the hours
                }
              });
            }

            toast.update(AUTOCOMPLETE_TOAST_ID, {
              render: "Autocompletion complete!",
              //type: toast.TYPE.SUCCESS,
              autoClose: 5000,
            }); // Update the existing toast to show success
          } else {
            toast.update(AUTOCOMPLETE_TOAST_ID, {
              render: "No data found for autocompletion.",
              //type: toast.TYPE.INFO,
              autoClose: 5000,
            }); // Update the existing toast to show no data found
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          toast.update(AUTOCOMPLETE_TOAST_ID, {
            render: "Failed to autocomplete data. No user data found.",
            //type: toast.TYPE.ERROR,
            autoClose: 5000,
          }); // Update the existing toast to show error
        }
      }
    },
    500
  );

  // The main function for handling the first name change
  const handleFirstNameChange = async (e, index, dispatch, getIdToken) => {
    const firstName = e.target.value;
    dispatch({
      type: "onChange",
      index: index,
      fieldName: "firstName",
      value: firstName,
    });

    if (!toast.isActive(AUTOCOMPLETE_TOAST_ID)) {
      toast.info("Requesting autocompletion...", {
        autoClose: false,
        toastId: AUTOCOMPLETE_TOAST_ID,
      });
    }
    suggestNames(firstName); // Call suggestNames for autocomplete

    // Call the debounced function
    //handleDebouncedAutocomplete(firstName, index, dispatch, getIdToken);
  };

  const { currentUser, signOut } = useAuth();

  // useEffect to show toast when user signs in
  useEffect(() => {
    showWelcomeMessage();
  }, []);
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out.");
    }
  };

  if (!currentUser) {
    return <Login />;
  }

  const handleHoursChange = (day, value) => {
    setDaysAndHours((prevDaysAndHours) => ({
      ...prevDaysAndHours,
      [day]: {
        ...prevDaysAndHours[day],
        hours: value,
      },
    }));
  };

  const handleReset = (index) => {
    const isFormEmpty = Object.keys(initialFormState).every((key) => {
      return (
        formData[index][key] === initialFormState[key] ||
        (Array.isArray(formData[index][key]) &&
          formData[index][key].length === 0)
      );
    });

    if (!isFormEmpty) {
      dispatch({ type: "resetForm", index });

      // Resetting related states
      setDaysAndHours({
        monday: { checked: false, hours: "" },
        tuesday: { checked: false, hours: "" },
        wednesday: { checked: false, hours: "" },
        thursday: { checked: false, hours: "" },
        friday: { checked: false, hours: "" },
        saturday: { checked: false, hours: "" },
        sunday: { checked: false, hours: "" },
      });
      setSelectedFirstName("");

      // Resetting field validation state if necessary
      setFieldValidation({
        firstName: { touched: false, valid: true },
        lastName: { touched: false, valid: true },
        idNumber: { touched: false, valid: true },
        // ... other fields
      });

      toast.success(`Claim Form ${index + 1} reset successfully.`, {
        autoClose: 5000,
      });
    } else {
      toast.error(`Claim Form ${index + 1} is already empty.`, {
        autoClose: 5000,
      });
    }
    setSelectedFirstName("");
    setResetCounter((resetCounter) => resetCounter + 1);
  };

  const addForm = () => {
    dispatch({ type: "addForm" });
    const newForm = { id: forms.length + 1, collapsed: false };
    setForms((prevForms) => [
      ...prevForms.map((form) => ({ ...form, collapsed: true })),
      newForm,
    ]);
  };

  const deleteForm = (id) => {
    if (forms.length === 1) {
      return;
    }
    dispatch({ type: "deleteForm", index: id });
    const updatedForms = forms.filter((form, index) => index !== id);
    setForms(updatedForms);
    // Display a success toast notification
    toast.success(`Form ${id + 1} deleted successfully.`, { autoClose: 5000 });
  };

  const toggleCollapse = (id) => {
    const updatedForms = forms.map((form, index) =>
      index === id ? { ...form, collapsed: !form.collapsed } : form
    );
    setForms(updatedForms);
  };
  function downloadBlob(blob, filename) {
    // Create a link element, hide it, direct it towards the blob, and then 'click' it programatically
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    const url = window.URL.createObjectURL(blob); // Create a link to the blob
    a.href = url;
    a.download = filename; // Provide the name for the downloaded file
    a.click(); // Simulate a click on the element

    // Clean up by revoking the object URL and removing the element
    window.URL.revokeObjectURL(url);
    a.remove();
  }
  //function to clean up skipped dates before submitting by putting them into array as single dates
  // Function to get dates between two dates
  function getDatesInRange(startDate, endDate) {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dateArray.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }
  const handleSubmit = async () => {
    // Check if any of the required fields are empty
    for (const form of formData) {
      if (!form.firstName || !form.lastName) {
        toast.error("Please fill in all required fields.");
        return;
      }
    }
    const preparedData = formData.map((form) => {
      // Process the 'datesToSkip' field
      const processedDatesToSkip = [];
      form.datesToSkip.split(",").forEach((dateEntry) => {
        if (dateEntry.includes(":")) {
          // Handle date range
          const [startDate, endDate] = dateEntry.split(":");
          const dateRange = getDatesInRange(startDate, endDate);
          processedDatesToSkip.push(...dateRange);
        } else {
          // Handle single date
          processedDatesToSkip.push(dateEntry);
        }
      });

      return {
        ...form,
        rate: parseFloat(form.rate) || 0,
        datesToSkip: processedDatesToSkip,
        serviceHours: form.serviceDays.reduce((acc, day, index) => {
          acc[day] = parseFloat(form.hoursPerDay[index]) || 0;
          return acc;
        }, {}),
      };
    });

    const payload = { requests: preparedData }; // Wrap in 'requests' key

    try {
      toast.info("Submitting claim...");
      const token = await getIdToken(); // Retrieve the Firebase ID token
      const response = await fetch(
        "http://localhost:8080/api/receiveBatchData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        toast.error("claim submission failed");
        throw new Error(`Error: ${response.status}`);
      }

      const blob = await response.blob();
      const dynamicFilename = "Batch_Claims_Data.zip"; // Use a suitable filename
      downloadBlob(blob, dynamicFilename);
    } catch (error) {
      console.error("Error generating or downloading file:", error);
    }
  };

  // console.log(arrayValue, formData[0].datesToSkip)
  console.log("Current selectedFirstName:", selectedFirstName);
  return (
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Automated Claims Billing System
        </Typography>
        <ToastContainer />

        {/* <Grid container spacing={2}> */}
        {/* Forms Section */}
        {/* <Grid item xs={12} spacing={2}> */}
        {/* <Grid container spacing={2}> */}
        {forms.map((form, index) => (
          // <Container >
          <Paper
            sx={{ p: 2, borderRadius: 1, mb: 2 }}
            key={index}
            elevation={3}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                width: "100%", // Ensure the box takes the full width
              }}
            >
              <Typography variant="h6" gutterBottom>
                Claim Form {index + 1}
              </Typography>

              <Box
                sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleReset(index)}
                >
                  Reset Form
                </Button>
              </Box>

              <IconButton onClick={() => toggleCollapse(index)}>
                <ExpandMoreIcon rotate={form.collapsed ? 0 : 180} />
              </IconButton>
            </Box>
            <Collapse in={!form.collapsed}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Autocomplete
                    id="name-autocomplete"
                    key={`autocomplete-${resetCounter}`}
                    options={nameSuggestions}
                    freeSolo
                    onInputChange={(event, newValue) => {
                      suggestNames(newValue);
                    }}
                    value={selectedFirstName}
                    onChange={(event, newValue) => {
                      setSelectedFirstName(newValue);
                      handleSelectName(newValue, index);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="First Name"
                        fullWidth
                        sx={{ mb: 2 }}
                        required
                        onChange={(e) => {
                          dispatch({
                            type: "onChange",
                            index: index,
                            fieldName: "firstName",
                            value: e.target.value,
                          });
                        }}
                        inputProps={{
                          ...params.inputProps,
                          id: `${index}-firstName`,
                        }}
                      />
                    )}
                  />

                  <TextField
                    label="Last Name"
                    fullWidth
                    sx={{ mb: 2 }}
                    error={
                      fieldValidation.lastName.touched &&
                      !fieldValidation.lastName.valid
                    }
                    helperText={
                      fieldValidation.lastName.touched &&
                      !fieldValidation.lastName.valid
                        ? "This field is required"
                        : ""
                    }
                    value={formData[index].lastName}
                    onBlur={() => handleFieldBlur("lastName")}
                    onChange={(e) =>
                      dispatch({
                        type: "onChange",
                        index: index,
                        fieldName: "lastName",
                        value: e.target.value,
                      })
                    }
                    inputProps={{
                      id: `${index}-lastName`,
                      "aria-required": true,
                    }}
                  />
                  <TextField
                    label="ID Number"
                    fullWidth
                    sx={{ mb: 2 }}
                    inputProps={{
                      id: `${index}-idNumber`,
                      "aria-required": true,
                    }}
                    value={formData[index].idNumber}
                    onChange={(e) =>
                      dispatch({
                        type: "onChange",
                        index: index,
                        fieldName: "idNumber",
                        value: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Address"
                    fullWidth
                    sx={{ mb: 2 }}
                    inputProps={{
                      id: `${index}-address`,
                      "aria-required": true,
                    }}
                    value={formData[index].address}
                    onChange={(e) =>
                      dispatch({
                        type: "onChange",
                        index: index,
                        fieldName: "address",
                        value: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Birthday"
                    fullWidth
                    sx={{ mb: 2 }}
                    placeholder="YYYYMMDD"
                    inputProps={{
                      id: `${index}-birthday`,
                      "aria-required": true,
                    }}
                    value={formData[index].birthday}
                    onChange={(e) =>
                      dispatch({
                        type: "onChange",
                        index: index,
                        fieldName: "birthday",
                        value: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Zipcode"
                    fullWidth
                    sx={{ mb: 2 }}
                    inputProps={{
                      id: `${index}-zipcode`,
                      "aria-required": true,
                    }}
                    value={formData[index].zipcode}
                    onChange={(e) =>
                      dispatch({
                        type: "onChange",
                        index: index,
                        fieldName: "zipcode",
                        value: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Rate"
                    fullWidth
                    sx={{ mb: 2 }}
                    inputProps={{
                      id: `${index}-rate`,
                      "aria-required": true,
                      //inputMode: "numeric", // Set inputMode to "numeric"
                      //step: "0.01", // Optional: To allow decimal values
                    }}
                    value={formData[index].rate}
                    onChange={(e) =>
                      dispatch({
                        type: "onChange",
                        index: index,
                        fieldName: "rate",
                        value: e.target.value,
                      })
                    }
                  />
                  <Divider
                    sx={{ mb: 2 }}
                    style={{ backgroundColor: "rebeccapurple" }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Service Days and Hours:
                  </Typography>

                  <Grid container spacing={2}>
                    {/* {Object.entries(daysAndHours).map(
                    ([day, { checked, hours }]) => (*/}
                    {week_days.map((week) => (
                      <React.Fragment key={week}>
                        <Grid item xs={6} md={3}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                // id={day}
                                name="serviceDays"
                                value={week}
                                checked={formData[index].serviceDays.includes(
                                  week.toUpperCase()
                                )}
                                onChange={(e) =>
                                  dispatch({
                                    type: "checkbox",
                                    index,
                                    day: week.toUpperCase(),
                                  })
                                }
                              />
                            }
                            label={week}
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <TextField
                            type="number"
                            // id={`${day}Hours`}
                            // name={`${day}Hours`}
                            label={`${week.charAt(0).toUpperCase()}${week.slice(
                              1
                            )} Hours`}
                            fullWidth
                            inputProps={{ min: 0, max: 24, step: 0.5 }}
                            disabled={
                              !formData[index].serviceDays.includes(
                                week.toUpperCase()
                              )
                            }
                            value={
                              formData[index].hoursPerDay[
                                formData[index].serviceDays.indexOf(
                                  week.toUpperCase()
                                )
                              ] ?? ""
                            }
                            onChange={(e) =>
                              dispatch({
                                type: "hours",
                                index: index,
                                day: week.toUpperCase(),
                                value: e.target.value,
                              })
                            }
                          />
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                  <Divider
                    sx={{ mb: 2, mt: 2 }}
                    style={{ backgroundColor: "rebeccapurple" }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Service Start Date and End Date:
                  </Typography>
                  <TextField
                    label="Start Date"
                    fullWidth
                    type="date"
                    sx={{ my: 2 }}
                    inputProps={{
                      id: `${index}-startDate`,
                      "aria-required": true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    value={formData[index].startDate}
                    onChange={(e) =>
                      dispatch({
                        type: "onChange",
                        index: index,
                        fieldName: "startDate",
                        value: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="End Date"
                    fullWidth
                    type="date"
                    sx={{ my: 2 }}
                    inputProps={{
                      id: `${index}-endDate`,
                      "aria-required": true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    value={formData[index].endDate}
                    onChange={(e) =>
                      dispatch({
                        type: "onChange",
                        index: index,
                        fieldName: "endDate",
                        value: e.target.value,
                      })
                    }
                  />
                  <Divider
                    sx={{ mb: 2 }}
                    style={{ backgroundColor: "rebeccapurple" }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Missed Service Days:
                  </Typography>
                  <TextField
                    label="Dates to Skip"
                    fullWidth
                    sx={{ my: 2 }}
                    inputProps={{
                      id: `${index}-datesToSkip`,
                    }}
                    helperText="(comma-separated, e.g., 2023-01-01,2023-01-02)"
                    value={formData[index].datesToSkip}
                    onChange={(e) =>
                      dispatch({
                        type: "onChange",
                        index: index,
                        fieldName: "datesToSkip",
                        value: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  {/* Add your calendar component or visualization here */}
                  <Container
                    sx={{ border: 1, p: 2, borderRadius: 1, height: "100%" }}
                  >
                    <Typography variant="h6" style={{ textAlign: "center" }}>
                      Calendar Visualization
                    </Typography>
                    <CalendarComponent
                      highlightedRange={[
                        formData[index].startDate,
                        formData[index].endDate,
                      ]}
                      excludeDateRange={formData[index].datesToSkip}
                      selectedDays={formData[index].serviceDays}
                    />
                    {/* <DateCalendarValue
                    range={[formData[index].startDate, formData[index].endDate]}
                  /> */}
                  </Container>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={2}>
                    <Typography variant="h6" gutterBottom>
                      Skip Dates
                    </Typography>
                    <Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="datesToSkipRange"
                            checked={formData[index].datesToSkipRange}
                            onChange={(e) =>
                              dispatch({
                                type: "onChange",
                                index: index,
                                fieldName: "datesToSkipRange",
                                value: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Range"
                      />
                      {formData[index].datesToSkipRange && (
                        <>
                          <TextField
                            label="Start Date"
                            fullWidth
                            type="date"
                            sx={{ my: 2 }}
                            inputProps={{
                              id: `${index}-startDateRange`,
                              "aria-required": true,
                            }}
                            InputLabelProps={{ shrink: true }}
                            value={formData[index].startDateRange}
                            onChange={(e) =>
                              dispatch({
                                type: "onChange",
                                index: index,
                                fieldName: "startDateRange",
                                value: e.target.value,
                              })
                            }
                          />
                          <TextField
                            label="End Date"
                            fullWidth
                            type="date"
                            sx={{ my: 2 }}
                            inputProps={{
                              id: `${index}-endDateRange`,
                              "aria-required": true,
                            }}
                            InputLabelProps={{ shrink: true }}
                            value={formData[index].endDateRange}
                            onChange={(e) =>
                              dispatch({
                                type: "onChange",
                                index: index,
                                fieldName: "endDateRange",
                                value: e.target.value,
                              })
                            }
                          />
                          <Button
                            variant="outlined"
                            onClick={() => {
                              // Add your logic to add a new date range
                            }}
                            startIcon={<AddIcon />}
                            sx={{ mt: 2 }}
                          >
                            Add Range
                          </Button>
                        </>
                      )}
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Collapse>
            {forms.length > 1 && (
              <IconButton onClick={() => deleteForm(index)} color="error">
                <DeleteIcon />
              </IconButton>
            )}
            {/* </Container> */}
          </Paper>
        ))}
        <Stack justifyContent="center" gap={4} direction="row" sx={{ py: 4 }}>
          <Button
            variant="outlined"
            onClick={addForm}
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
          >
            Add Form
          </Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
            Submit Form
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSignOut}
            sx={{ mt: 2 }}
          >
            Sign Out
          </Button>
        </Stack>
      </Container>
  );
};

export default DynamicForm;
