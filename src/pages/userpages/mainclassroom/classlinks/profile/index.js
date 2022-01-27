import React, { useState, useEffect } from 'react';

import {
  Typography,
  Box,
  Grid,
  Avatar,
  Button,
  Snackbar,
  Alert
} from '@mui/material';

import ClassDrawer from '../../classdrawer/ClassDrawer';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../utils/firebase'

import { getUser } from '../../../../../utils/firebaseUtil';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { logoutInitiate } from '../../../../../redux/actions/userAction';


import Input from '../../../../../components/Input'

import { getAuth, updatePassword } from "firebase/auth";
import { useHistory } from 'react-router';

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';


const style = {
  gridcontainer: {
    display: "flex",
    boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
    marginTop: 5,
    maxWidth: 1000,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5
  },
  main: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
  },
  iconStyle: {
    color: (theme) => theme.palette.primary.main,
    margin: 0.5
  },
  btnStyle: {
    width: 80,
    marginLeft: 5
  },
  profileLogo: {
    height: 130,
    width: 130,
    borderRadius: 9,
    border: '1px solid black'
  },
  addbtn: {
    position: 'relative',
    top: '80%',
    left: '-2%',
    height: 30,
    width: 30,
    border: '1px solid black',
    backgroundColor: '#949494',
    '&:hover': {
      backgroundColor: '#949494'
    },
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 1,
    marginLeft: 1,
    marginTop: 2
  },
  saveBtn: {
    marginTop: 3,
    width: 100,
    height: 40,
    borderRadius: 2,
    textTransform: 'none',
    fontSize: 18
  }
}

export default function ClassAnnouncementList() {

  const [userDetail, setUserDetail] = useState([])

  const params = useParams()
  const dispatch = useDispatch();
  const history = useHistory();

  const { user } = useSelector((state) => state);
  const [values, setValues] = useState({
    newPassword: '',
    confirmPassword: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {

    if (Object.keys(user.currentUser).length !== 0) {
      getUser().then(item => {
        setUserDetail(item)
      })
    }
  }, [user]);

  const onChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  const onSave = () => {
    setSuccess('')
    setError('')
    if (values.newPassword !== values.confirmPassword) {
      setSuccess('')
      setError('Password not matched, please type again')
    } else if (userDetail[0].phone !== values.phone) {
      setError('')
      setOpen(true)
      const docRef = doc(db, 'users', user.currentUser.uid);
      setDoc(docRef, { phone: values.phone }, { merge: true });
    } else {
      setError('')
      const docRef = doc(db, 'users', user.currentUser.uid);
      setDoc(docRef, { phone: values.phone }, { merge: true });
      const auth = getAuth();
      const user = auth.currentUser;
      // const newPassword = getASecureRandomPassword();
      updatePassword(user, values.newPassword).then(() => {
        setOpen(true)
        setSuccess('Profile has been updated')
        handleLogOut()
      }).catch((error) => {
        // An error ocurred
        // ...
      });
    }
  }

  const handleLogOut = () => {
    if (user) {
      dispatch(logoutInitiate());
      history.push('/');
    }
  }

  console.log(user)
  console.log(values)
  const userDetailBody = () => {
    return userDetail && userDetail.map(item =>
      <Grid container sx={style.gridcontainer} justifyContent='center'>
        <Grid container justifyContent='center'>
          <Avatar sx={style.profileLogo} variant="square" src={user.currentUser.photoUrl} />
          {/* <IconButton sx={style.addbtn}>
            <AddIcon sx={{ color: 'white' }} />
          </IconButton> */}
        </Grid>
        <Grid xs={12} item sx={{ maxWidth: 500 }}>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>Name</Typography>
            <Input
              type='text'
              value={item.displayName}
              name='Name'
              disabled
              onChange={null}
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>Email</Typography>
            <Input
              type='text'
              value={item.email}
              name='Email'
              disabled
              onChange={null}
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>Phone Number</Typography>
            <Input
              type='text'
              value={values.phone ? values.phone : item.phone}
              name='phone'
              onChange={onChange}
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>New Password</Typography>
            <Input
              type='password'
              name='newPassword'
              value={values.newPassword}
              onChange={onChange}
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>Confirm New Password</Typography>
            <Input
              type='password'
              value={values.confirmPassword}
              name='confirmPassword'
              onChange={onChange}
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid container justifyContent='center'>
            <Typography sx={{ color: 'red' }}>{error}</Typography>
            <Typography sx={{ color: 'green' }}>{success}</Typography>
          </Grid>
          <Grid container justifyContent='center'>
            <Button
              variant="contained"
              sx={style.saveBtn}
              onClick={onSave}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false)
  };

  return (
    <ClassDrawer headTitle='Profile'>
      <Helmet>
        <title>Profile</title>
        <link rel="Profile Icon" href={logohelmetclass} />
      </Helmet>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000}
        open={open}
        onClose={handleClose}
        message="I love snacks"
      // key={vertical + horizontal}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Successfully Updated Profile
        </Alert>
      </Snackbar>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
        {userDetail && userDetailBody()}
      </Box>
    </ClassDrawer>
  )
}
