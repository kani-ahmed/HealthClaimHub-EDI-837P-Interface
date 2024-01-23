// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
            <Switch>
                {/* Use Layout component only in routes that require the navigation bar */}
                <Route path="/billing-history">
                    {currentUser ? (
                        <Layout>
                            <BillingHistory />
                        </Layout>
                    ) : (
                        <Login />
                    )}
                </Route>
                <Route exact path="/">
                    {currentUser ? (
                        <Layout>
                            <DynamicForm />
                        </Layout>
                    ) : (
                        <Login />
                    )}
                </Route>
                <Route path="/add-clients">
                    {currentUser ? <AddClients /> : <Login />}
                </Route>
            </Switch>
        </Router>
    );
}

export default App;














//this one is the second iteration

// App.js
// import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import DynamicForm from './DynamicForm';
// import Login from './Login';
// import BillingHistory from './BillingHistory';
// import Layout from './Layout'; // Import the Layout component
// import { useAuth } from './AuthContext';

// function App() {
//     const { currentUser } = useAuth();

//     return (
//         <Router>
//             <Layout> {/* Wrap the Switch component with Layout */}
//                 <Switch>
//                     <Route path="/billing-history">
//                         {currentUser ? <BillingHistory /> : <Login />}
//                     </Route>
//                     <Route exact path="/">
//                         {currentUser ? <DynamicForm /> : <Login />}
//                     </Route>
//                 </Switch>
//             </Layout>
//         </Router>
//     );
// }

// export default App;





//older code below: updated with the one above.

// import React from 'react';
// import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
// import DynamicForm from './DynamicForm';
// import Login from './Login';
// import BillingHistory from './BillingHistory'; // Import your new component
// import Layout from './Layout';
// import { useAuth } from './AuthContext';

// function App() {
//     const { currentUser } = useAuth();

//     return (
//         <Router>
//             <Layout> {/* Wrap the Switch component with Layout */}
//             <Switch>
//             <div>
//                 <nav>
//                     <ul>
//                         <li>
//                             <Link to="/">Home</Link>
//                         </li>
//                         {currentUser && (
//                             <li>
//                                 <Link to="/billing-history">Billing History</Link>
//                             </li>
//                         )}
//                     </ul>
//                 </nav>
//                     <Route path="/billing-history">
//                         <BillingHistory />
//                     </Route>
//                     <Route path="/">
//                         {currentUser ? <DynamicForm /> : <Login />}
//                     </Route>
//             </div>
//             </Switch>
//             </Layout>
//         </Router>
//     );
// }

// export default App;
