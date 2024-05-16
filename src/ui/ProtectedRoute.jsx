import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  // 1 Load the authenticated user
  const { isAuthenticated, isLoading, fetchStatus } = useUser();

  // 2 If there is NO authenticated user, redirect to the /login
  useEffect(() => {
    if (!isAuthenticated && !isLoading && fetchStatus !== "fetching")
      navigate("/login");
  }, [isAuthenticated, isLoading, navigate, fetchStatus]);

  // 3 Show a spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4 If there IS a user, render the app
  if (isAuthenticated) return <div>{children}</div>;
}

export default ProtectedRoute;
