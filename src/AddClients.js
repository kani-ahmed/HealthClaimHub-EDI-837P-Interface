import React, { useEffect, useReducer, useState } from "react";
import { useAuth } from "./AuthContext";
import Login from "./Login";
import Layout from "./Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import {
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  Paper,
  Grid,
  Stack,
  Collapse
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

// Initial state for a single client form
const initialClientState = {
  firstName: "",
  lastName: "",
  idNumber: "",
  address: "",
  birthday: "",
  zipcode: "",
  rate: "",
  collapsed: true
};

const FORM_ACTION_TOAST_ID = 'form-action-toast';

const AddClients = () => {
  const { currentUser, getIdToken, signOut, showWelcomeMessage } = useAuth();
  const [clientForms, dispatch] = useReducer(reducer, [{ ...initialClientState, collapsed: false }]);
  const [resetCounter, setResetCounter] = useState(0);

  useEffect(() => {
    showWelcomeMessage();
  }, []);

  function reducer(state, action) {
    switch (action.type) {
        case 'addForm':
            if (!toast.isActive(FORM_ACTION_TOAST_ID)) {
                toast.info("Adding a new client form...", { autoClose: false, toastId: FORM_ACTION_TOAST_ID });
            } else {
                toast.update(FORM_ACTION_TOAST_ID, { render: "Added a new client form.", type: 'success', autoClose: 5000 });
            }
            return [...state.map(form => ({ ...form, collapsed: true })), { ...initialClientState, collapsed: false }];

        case 'deleteForm':
            if (!toast.isActive(FORM_ACTION_TOAST_ID)) {
                toast.info("Deleting a client form...", { autoClose: false, toastId: FORM_ACTION_TOAST_ID });
            } else {
                toast.update(FORM_ACTION_TOAST_ID, { render: `Deleted client form ${action.index + 1}.`, type: 'error', autoClose: 5000 });
            }
            return state.filter((_, index) => index !== action.index);

        case 'updateField':
            const updatedForms = [...state];
            updatedForms[action.index] = { ...updatedForms[action.index], [action.fieldName]: action.value };
            return updatedForms;

        case 'resetForm':
            const resetForms = [...state];
            resetForms[action.index] = { ...initialClientState, collapsed: false };
            return resetForms;

        case 'toggleCollapse':
            return state.map((form, index) => index === action.index ? { ...form, collapsed: !form.collapsed } : form);

        default:
            return state;
    }
}


const handleFieldChange = (index, fieldName, value) => {
    const formattedDate =
      fieldName === "birthday" ? dayjs(value) : value.toString();
    dispatch({ type: "updateField", index, fieldName, value: formattedDate });
  };


  const handleReset = (index) => {
    dispatch({ type: 'resetForm', index });
    toast.info(`Client Form ${index + 1} reset successfully.`);
    setResetCounter(resetCounter => resetCounter + 1);
  };

  const handleSubmit = async () => {
    // Regular expressions for validation
    const zipcodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/; // Example for US zip codes
    //const idNumberRegex = /^[0-9]{9}$/; // Example for 9 digit ID number

    for (const form of clientForms) {
        if (!form.firstName || !form.lastName || !form.idNumber || !form.address || !form.birthday || !form.zipcode || !form.rate) {
        toast.error("Please fill in all the fields.");
        return;
        }

        if (!zipcodeRegex.test(form.zipcode)) {
        toast.error("Invalid zipcode format.");
        return;
        }

        if (isNaN(form.idNumber) || form.idNumber <= 0) {
        toast.error("Invalid ID number format.");
        return;
        }

        if (isNaN(form.rate) || form.rate <= 0) {
        toast.error("Rate must be a positive number.");
        return;
        }

        if (dayjs(form.birthday).isAfter(dayjs())) {
        toast.error("Birthday cannot be in the future.");
        return;
        }
    }

    // Validation: Check if any field in any form is empty
    const isEveryFieldFilled = clientForms.every(form => {
      return Object.values(form).every(value => value !== '' && value !== null);
    });
  
    if (!isEveryFieldFilled) {
      toast.error("Please fill in all the fields.");
      return; // Stop the submission if validation fails
    }
  
    // If validation passes, continue with submission
    const token = await getIdToken();
    const payload = clientForms.map(form => ({
      firstName: form.firstName,
      lastName: form.lastName,
      idNumber: form.idNumber,
      address: form.address,
      birthday: form.birthday ? form.birthday.toISOString().slice(0, 10).replace(/-/g, '') : null,
      zipcode: form.zipcode,
      rate: form.rate
    }));
  
    try {
      const response = await fetch('http://localhost:8080/api/addClients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      toast.success("Clients added successfully");
    } catch (error) {
      console.error('Failed to submit clients:', error);
      toast.error("Error submitting clients");
    }
  };

  const handleAddForm = () => {
    if (!toast.isActive(FORM_ACTION_TOAST_ID)) {
      toast.info("Adding a new client form...", { autoClose: false, toastId: FORM_ACTION_TOAST_ID });
    }
    dispatch({ type: 'addForm' });
  };

  const handleDeleteForm = (index) => {
    if (!toast.isActive(FORM_ACTION_TOAST_ID)) {
      toast.info("Deleting a client form...", { autoClose: false, toastId: FORM_ACTION_TOAST_ID });
    }
    dispatch({ type: 'deleteForm', index });
  };

  if (!currentUser) {
    return <Login />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Layout>
        <Container>
          <Typography variant="h4" align="center" gutterBottom></Typography>
          <ToastContainer />
  
          {clientForms.map((form, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }} elevation={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">Client Form {index + 1}</Typography>
                <IconButton onClick={() => dispatch({ type: 'toggleCollapse', index })}>
                  <ExpandMoreIcon />
                </IconButton>
              </Stack>
              <Collapse in={!form.collapsed}>
                <Grid container spacing={2}>
                  {Object.entries(form).filter(([key]) => key !== "collapsed").map(([fieldName, value]) => (
                    <Grid item xs={12} sm={6} key={fieldName}>
                      {fieldName === 'birthday' ? (
                        <DatePicker
                          label="Birthday"
                          value={value ? dayjs(value) : null}
                          onChange={(newValue) => handleFieldChange(index, fieldName, newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              required: true,
                              error: !value,
                              helperText: !value ? "This field is required" : null,
                            }
                          }}
                          key={`datepicker-${resetCounter}`} // Reset the DatePicker when the form is reset
                        />
                      ) : (
                        <TextField
                          label={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                          fullWidth
                          required
                          error={!value}
                          helperText={!value ? "This field is required" : null}
                          value={value}
                          onChange={(e) => handleFieldChange(index, fieldName, e.target.value)}
                          key={`field-${resetCounter}`} // Reset the field when the form is reset
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button variant="outlined" color="secondary" onClick={() => handleReset(index)}>
                    Reset Form
                  </Button>
                  {clientForms.length > 1 && (
                    <IconButton onClick={() => handleDeleteForm(index)} color="error" sx={{ ml: 2 }}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Stack>
              </Collapse>
            </Paper>
          ))}
          <Stack direction="row" justifyContent="center" gap={4} sx={{ py: 4 }}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddForm}>
              Add Another Client
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Submit Clients
            </Button>
          </Stack>
        </Container>
      </Layout>
    </LocalizationProvider>
  );    
};

export default AddClients;
