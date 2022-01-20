import React, { useState, useEffect } from 'react';

import {
  Typography,
  Box,
  Grid,
  Avatar,
  TextField,
  Button,
  IconButton
} from '@mui/material';

import ClassDrawer from '../../classdrawer/ClassDrawer';
import { Timestamp } from 'firebase/firestore';

import { getAnnouncement, getDocsByCollection, getUser, createDoc } from '../../../../../utils/firebaseUtil';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";

import Input from '../../../../../components/Input'

import AddIcon from '@mui/icons-material/Add';

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
  const { user } = useSelector((state) => state);

  useEffect(() => {

    if (Object.keys(user.currentUser).length !== 0) {
      getUser().then(item => {
        setUserDetail(item)
      })
    }
  }, [user]);

  const userDetailBody = () => {
    return userDetail && userDetail.map(item =>
      <Grid container sx={style.gridcontainer} justifyContent='center'>
        <Grid container justifyContent='center'>
          <Avatar sx={style.profileLogo} variant="square" />
          <IconButton sx={style.addbtn}>
            <AddIcon sx={{ color: 'white' }} />
          </IconButton>
        </Grid>
        <Grid xs={12} item sx={{ maxWidth: 500 }}>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>Name</Typography>
            <Input
              type='text'
              value={item.displayName}
              name='Name'
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>Email</Typography>
            <Input
              type='text'
              value={item.email}
              name='Email'
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>Phone Number</Typography>
            <Input
              type='text'
              value={item.phone}
              name='Email'
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>New Password</Typography>
            <Input
              type='password'
              name='New Password'
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>Confirm New Password</Typography>
            <Input
              type='password'
              name='Confirm New Password'
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid container justifyContent='center'>
              <Button variant="contained" sx={style.saveBtn}> Save </Button>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <ClassDrawer headTitle='Profile'>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
        {userDetail && userDetailBody()}
      </Box>
    </ClassDrawer>
  )
}
