import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
//const jwt = require('jsonwebtoken');
//import jwt_decode from 'jwt-decode';
import { CircularProgress } from '@mui/material';
import swal from 'sweetalert';
import Button from '@mui/material/Button';
import config from './config.json'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  block: {
    display: 'block',
    gridTemplateColumns: 'repeat(12, 1fr)',
    width: '250px',
    height: '250px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    margin: '-125px 0 0 -125px',
  },
  boxset: {
    background: '#eaeaed',
  },
  box: {
    background: '#2db34a',
    height: '80px',
    lineHeight: '80px',
    textAlign: "center",
    width: '80px',
  }
}));

export default function Dashboard() {
  const classes = useStyles();
  //const [anchorEl, setAnchorEl] = React.useState(null);
  //const open = Boolean(anchorEl);
  const token = localStorage.getItem('token');
  //var decoded = jwt_decode(token);
  //const user = decoded.username

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  //const user = JSON.parse(localStorage.getItem('user'));

//  const handleMenu = (event) => {
//    setAnchorEl(event.currentTarget);
//  };

//  const handleClose = () => {
//    setAnchorEl(null);
//  };

  const reserveEnable = () => {
    fetch(`http://${config.api.host}:${config.api.port}/api/v1/reserveEnable`,{
      headers: { 
        'x-auth-token': token 
      },
    })
    .then(data => data.json())
    .then(data => {
      (async () => {
        swal("Success", data.data.status, "success", {
          buttons: false,
        })
        await sleep(4000)
        window.location.href = "/";
      })();
    })
    .catch(error => {
      console.log(error)
      swal("Failed", error.statusText, "error");
      setError(error);
      if (error.status === 401 ) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    })
  };

  const reserveDisable = () => {
    fetch(`http://${config.api.host}:${config.api.port}/api/v1/reserveDisable`,{
      headers: { 
        'x-auth-token': token 
      },
    })
    .then(data => data.json())
    .then(data => {
      (async () => {
        swal("Success", data.data.status, "success", {
          buttons: false
        })
        await sleep(4000)
        window.location.href = "/";
      })();
    })
    .catch(error => {
      console.log(error)
      swal("Failed", error.statusText, "error");
      setError(error);
      if (error.status === 401 ) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    })
  };

  const syncStatus = () => {
    swal("Success", 'error.statusText', "success")
    //await sleep(2000)
    window.location.href = "/";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);



  useEffect(() => {
    fetch(`http://${config.api.host}:${config.api.port}/api/v1/get_Status`,{
      headers: { 
        'x-auth-token': token 
      },
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then(data => {
      setData(data);
    })
    .catch(error => {
      console.log(error)
      swal("Failed", error.statusText, "error");
      setError(error);
      if (error.status === 401 ) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    })
    .finally(() => {
      setLoading(false);
    })
  }, [])

  if(loading) return (
    <>
      <CircularProgress />
    </>
  );
  if(error) return "Error!";

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Reserve status: {data.data.status}
          </Typography>
            <div>
            <Button
              variant="h6"
              id="composition-button"

              aria-haspopup="true"
              //onClick={reserveEnable}
            > Accounts </Button>
            <Button
              variant="h6"
              id="composition-button"

              aria-haspopup="true"
              onClick={handleLogout}
            > Log Out </Button>
          </div>
        </Toolbar>
      </AppBar>
        <div className={classes.block} >
          <Button variant="contained" color="error" style={{ height: 10, fontSize: "20px", padding: "40px 40px", margin: ".3125rem 1px", borderRadius: "10px" }} onClick={reserveEnable} >
            Enable Reserve
          </Button>
          <Button variant="contained" color="success" style={{ height: 10, fontSize: "20px", padding: "40px 40px", margin: ".3125rem 1px", borderRadius: "10px" }} onClick={reserveDisable} >
            Disable Reserve
          </Button>
          <Button variant="contained" color="info" style={{ height: 10, fontSize: "20px", padding: "40px 40px", margin: ".3125rem 1px", borderRadius: "10px" }} onClick={syncStatus} >
            Syncronize status
          </Button>
        </div>
      </div>
  );
}