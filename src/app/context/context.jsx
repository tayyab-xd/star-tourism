'use client'
import { useState, createContext, useReducer, useEffect } from "react"
import { reducer } from "./reducer"

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const initialState = {
    allTrips: [],
    profileData: null,
    applications: [],
    loadingProfile: true, // Add a loading state
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  // Function to fetch user profile
  // const fetchUser = async () => {
  //   const storedUser = JSON.parse(localStorage.getItem('startourism'));
  //   if (storedUser && storedUser.userId) {
  //     try {
  //       const res = await fetch(`/api/users/getuser/${storedUser.userId}`);
  //       const data = await res.json();
  //       console.log(data  )
  //       dispatch({ type: 'PROFILE_SET', payload: data });
  //     } catch (error) {
  //       console.error('Failed to fetch user:', error);
  //       dispatch({ type: 'PROFILE_CLEAR' })
  //     }
  //   } else {
  //     dispatch({ type: 'PROFILE_CLEAR' });
  //   }
  // };


  // Fetch initial data on mount
  useEffect(() => {
    // fetchUser();
    const fetchTrips = async () => {
      const res = await fetch('/api/trips/all-trips');
      const data = await res.json();
      dispatch({ type: 'SET_TRIPS', payload: data });
    };

    const fetchApplications = async () => {
        const token = JSON.parse(localStorage.getItem('startourism'));
        if (!token) return;
        const res = await fetch(`/api/applications`, {
            headers: { Authorization: `Bearer ${token.token}` },
        });
        const data = await res.json();
        dispatch({ type: 'SET_APPLICATIONS', payload: data.applications });
    };
    
    fetchTrips();
    fetchApplications();
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'startourism') {
        fetchUser(); // Re-fetch user when localStorage changes
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };