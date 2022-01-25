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

import Teacherdrawer from '../../classdrawer/ClassDrawerTeacher';
import { Timestamp } from 'firebase/firestore';

import { getAnnouncement, getDocsByCollection, getUser, createDoc } from '../../../../../utils/firebaseUtil';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import Banner from '../../../../../assets/img/jpg/banner.jpg'


import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import YouTubeIcon from '@mui/icons-material/YouTube';

const style = {
  gridcontainer: {
    display: "flex",
    boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
    marginTop: 5,
    padding: 2,
    maxWidth: 1100
  },
  announcementBannerContainer: {
    boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
    marginTop: 5,
    height: {
      xs: 120, md: 300
    },
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(${Banner})`,
    alignItems: "center",
    maxWidth: 1100
  },
  imageContainer: {

  },
  announcementcontainer: {
    display: "flex",
    marginTop: { xs: 0, md: 2 },
    maxWidth: 1100
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
  }
}

export default function ClassAnnouncement() {

  const [showInput, setShowInput] = useState(false);
  // const [inputValue, setInputValue] = useState('');
  const [announcementData, setAnnouncementData] = useState();
  const [userId, setUserId] = useState('');
  const [className, setClassName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [announcementContent, setAnnoucncementContent] = useState('')

  const params = useParams()
  const { user } = useSelector((state) => state);

  useEffect(() => {

    if (Object.keys(user.currentUser).length !== 0) {
      getUser().then(item => {
        item.map(data => {
          setUserId(data.ownerId)
          setOwnerName(data.displayName)
        })

      })
      getClassData()
    }
    getDataAnnouncement()
  }, [user]);

  const getClassData = () => {
    getDocsByCollection('createclass')
      .then(item => {
        const data = item.filter(item => item.classCode === params.id)
        data.map(item => {
          setClassName(item.className)
          setOwnerName(item.displayName)
        })
      })
  }

  const getDataAnnouncement = () => {
    getAnnouncement('announcement', 'created')
      .then(item => {
        const data = item.filter(item => item.classCode === params.id)
        setAnnouncementData(data)
      })
  }

  const handleAnnoucement = (e) => {
    setAnnoucncementContent(e.target.value)
  }

  const saveAnnoucement = () => {
    const data = {
      body: announcementContent,
      classCode: params.id,
      created: Timestamp.now(),
      ownerId: user.currentUser.uid,
      ownerName: ownerName
    }
    createDoc('announcement', data).then(() => {
      setAnnoucncementContent('')
      getDataAnnouncement()
    })
  }

  const cancelAnnouncement = () => {
    setShowInput(false)
    setAnnoucncementContent('')
  }

  const announcementBody = () => {
    return announcementData && announcementData.map(item =>
      <Grid container sx={style.gridcontainer} justifyContent='space-between'>
        <Grid xs={12} item sx={{ display: 'flex' }}>
          <Avatar />
          <Grid container sx={{ paddingLeft: 1 }}>
            <Grid container>
              <Typography>{new Date(item.created.seconds * 1000).toLocaleDateString()} {new Date(item.created.seconds * 1000).toLocaleTimeString()}</Typography>
            </Grid>
            <Grid container>
              <Typography>{item.ownerName}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 1 }}>
          <Typography sx={{ marginTop: 2 }}>{item.body}</Typography>
        </Grid>
        <Grid xs={12} justifyContent='flex-end' container>
          <Button
            variant="contained"
            color="error"
            sx={{ marginTop: 2 }}
            onClick={() => null}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    )
  }

  return (
    <Teacherdrawer headTitle={className} classCode={params.id}>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
        <Box component={Grid} container justifyContent="center" sx={style.announcementBannerContainer}>
        </Box>
        <Grid container sx={style.gridcontainer}>
          {showInput ? (
            <Grid container>
              <TextField
                variant="filled"
                multiline
                value={announcementContent}
                onChange={handleAnnoucement}
                fullWidth
                minRows={5}
              />
              <Box sx={{ marginTop: 2 }} container component={Grid} justifyContent="space-between">
                <Grid item>
                  <IconButton sx={style.iconStyle}>
                    <AddToDriveIcon />
                  </IconButton>
                  <IconButton sx={style.iconStyle}>
                    <FileUploadIcon />
                  </IconButton>
                  <IconButton sx={style.iconStyle}>
                    <InsertLinkIcon />
                  </IconButton>
                  <IconButton sx={style.iconStyle}>
                    <YouTubeIcon />
                  </IconButton>
                </Grid>
                <Grid item sx={{ marginTop: 0.5 }}>
                  <Button
                    style={style.btnStyle}
                    onClick={cancelAnnouncement}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    disabled={announcementContent ? false : true}
                    style={style.btnStyle}
                    onClick={saveAnnoucement}
                  >
                    Post
                  </Button>
                </Grid>
              </Box>
            </Grid>
          ) : (
            <Grid container sx={style.main}
              onClick={() => setShowInput(true)}
            >
              <Avatar />
              <Typography style={{ paddingLeft: 20 }}>Announce Something To Class</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
      <Box component={Grid} container justifyContent="center">
        <Grid container sx={style.announcementcontainer}>
          {announcementData && announcementBody()}
        </Grid>
      </Box>
    </Teacherdrawer>
  )
}
