import { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import { LocationOnOutlined } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';

import useStyles from './styles';
import mapStyles from './mapStyles';

export default function Map({ setCoordinates, setBounds, setChildClicked, coordinates, places, weatherData }) {
  const classes = useStyles();
  const isDesktop = useMediaQuery('(min-width:600px)');

  const [defaultCenter, setDefaultCenter] = useState({});

  useEffect(() => {
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
      if (result.state === 'granted') {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => (
          setDefaultCenter({ lat: latitude, lng: longitude })          
        ));
      } else {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => (
          setDefaultCenter({ lat: latitude, lng: longitude })          
        ));
      }
    });
  }, []);

  return (
    <div className={classes.mapContainer}>
      {coordinates.lat && (
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
          defaultCenter={defaultCenter}
          center={coordinates.lat ? coordinates : defaultCenter}
          defaultZoom={14}
          margin={[50, 50, 50, 50]}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: mapStyles
          }}
          onChange={(e) => {
            setCoordinates({
              lat: e.center.lat,
              lng: e.center.lng
            })
            setBounds({
              ne: e.marginBounds.ne,
              sw: e.marginBounds.sw
            })
          }}
          onChildClick={(child) => {
            setChildClicked(child);
          }}
        >
          {places?.map((place, index) => (
            <div
              className={classes.markerContainer}
              lat={Number(place.latitude)}
              lng={Number(place.longitude)}
              key={index}
            >
              { !isDesktop
                  ? <LocationOnOutlined color="primary" fontSize="large" />
                  : (
                    <Paper elevation={3} className={classes.paper}>
                      <Typography className={classes.typography} variant="subtitle2" gutterBottom>
                        {place.name}
                      </Typography>
                      <img
                        className={classes.pointer}
                        src={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
                        alt={place.name}
                      />
                      <Rating size="small" value={Number(place.rating)} readOnly />
                    </Paper>
                  )}
            </div>
          ))}
          {weatherData?.list?.map((data, index) => (
            <div key={index} lat={data.coord.lat} lng={data.coord.lon}>
              <img height={100} src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`} alt="Weather" />
            </div>
          ))}
        </GoogleMapReact>
      )}
    </div>
  )
}