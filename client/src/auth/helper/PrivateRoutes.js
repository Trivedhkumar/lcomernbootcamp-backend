import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAutheticated } from ".";

const PrivateRoute = ({ component: Component, ...rest }) => {
  let auth = isAutheticated();
  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
export default PrivateRoute;
