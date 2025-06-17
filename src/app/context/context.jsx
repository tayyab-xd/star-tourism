'use client'
import { useState, createContext, useReducer, useEffect } from "react"
import { reducer } from "./reducer"

const AppContext = createContext();

const AppProvider = ({ children }) => {

  const initialState = {
    allTrips: [],
    profileData: {},
    applications: [],
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  // searching for trips
  useEffect(() => {
    const fetchtrips = async () => {
      const res = await fetch('/api/trips/all-trips', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json()
      dispatch({ type: 'SET_TRIPS', payload: data })
    }
    fetchtrips()
  }, [])


  //set profile
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem('startourism'));
      if (!storedUser) return;
      try {
        const res = await fetch(`/api/users/getuser/${storedUser.userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json()
        dispatch({ type: 'PROFILE_SET', payload: data });
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  //for application
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('startourism'));
    if (!token) {
      return
    }
    const fetchApplications = async () => {
      const res = await fetch(`/api/applications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.token}`
        },
      });
      const data = await res.json()
      dispatch({ type: 'SET_APPLICATIONS', payload: data.applications })
    }
    fetchApplications()
  }, [])


  return (
    <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
  )
}

export { AppContext, AppProvider };