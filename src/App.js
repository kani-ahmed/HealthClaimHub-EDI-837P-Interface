import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DynamicForm from './DynamicForm';
import Login from './Login';
import AddClients from './AddClients';
import BillingHistory from './BillingHistory';
import Layout from './Layout'; // Import the Layout component
import { useAuth } from './AuthContext';

function App() {
    const { currentUser } = useAuth();

    return (
        <Router>
            <Routes>
                <Route path="/billing-history" element={
                    currentUser ? (
                        <Layout>
                            <BillingHistory />
                        </Layout>
                    ) : (
                        <Login />
                    )
                } />
                <Route exact path="/" element={
                    currentUser ? (
                        <Layout>
                            <DynamicForm />
                        </Layout>
                    ) : (
                        <Login />
                    )
                } />
                <Route path="/add-clients" element={
                    currentUser ? (
                        <Layout>
                            <AddClients />
                        </Layout>
                    ) : (
                        <Login />
                    )
                } />
            </Routes>
        </Router>
    );
}

export default App;
