import { Autocomplete } from "@react-google-maps/api";
import { AppBar, Toolbar, Typography, InputBase, Box } from "@material-ui/core";
import { Search } from '@material-ui/icons';

import useStyles from './styles';
import { useEffect, useRef, useState } from "react";

export default function Header({ setCoordinates }) {
  const classes = useStyles();
  const [autoComplete, setAutoComplete] = useState(null);

  const currentMounted = useRef(false);

  useEffect(() => {
    currentMounted.current = true;

    return () => {
      currentMounted.current = false;
    }
  }, []);

  function handleLoad(autoC) {
    setAutoComplete(autoC);
  }

  function handlePlaceChanged() {
    const lat = autoComplete.getPlace().geometry.location.lat();
    const lng = autoComplete.getPlace().geometry.location.lng();

    setCoordinates({ lat, lng });
  }

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}      >
        <Typography variant="h5" className={classes.title}>
          Travel Advisor
        </Typography>
        <Box display="flex">
          <Typography variant="h6" className={classes.title}>
            Explore new places
          </Typography>
          {currentMounted.current && (
            <Autocomplete
              onLoad={handleLoad}
              onPlaceChanged={handlePlaceChanged}
            >
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <Search />
                </div>
                <InputBase placeholder="Search..." classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }} />
              </div>
            </Autocomplete>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}