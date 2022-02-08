import React, { useEffect, useState } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import Header from './components/Header';
import List from './components/List';
import Map from './components/Map';

import { getPlacesData, getWeatherData } from './api';

export default function App(){
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [childClicked, setChildClicked] = useState(null);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState(0);
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => (
      setCoordinates({ lat: latitude, lng: longitude })          
    ));
  }, []);

  useEffect(() => {
    const filteredPlaces = places.filter(place => place.rating > rating);
    setFilteredPlaces(filteredPlaces);
  }, [rating]);

  useEffect(() => {
    if(bounds.sw && bounds.ne) {
      setIsLoading(true);

      getWeatherData(coordinates.lat, coordinates.lng)
        .then(data => setWeatherData(data));
  
      getPlacesData(type, bounds.sw, bounds.ne)
      .then((data) => {
        setPlaces(data?.filter(place => place.name && place.num_reviews > 0));
        setFilteredPlaces([]);
        setRating(0);
        setIsLoading(false);
      });
    }
  }, [bounds, type]);

  return (
    <>
      <CssBaseline />

      <Header setCoordinates={setCoordinates} />
      
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            setChildClicked={setChildClicked}
            coordinates={coordinates}
            places={filteredPlaces.length ? filteredPlaces : places}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  )
}