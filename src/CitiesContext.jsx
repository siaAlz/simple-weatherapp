import { createContext, useContext, useState } from "react";
const CitiesContext = createContext(null);

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <CitiesContext value={{ cities, setCities, isLoading, setIsLoading }}>
      {children}
    </CitiesContext>
  );
}
function useCities() {
  const result = useContext(CitiesContext);
  if (!result) throw new Error("context used out of provider");

  return result;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };
