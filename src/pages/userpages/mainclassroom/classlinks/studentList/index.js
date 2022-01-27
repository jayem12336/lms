import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../../../../utils/firebase';
import { getUser, acceptStudent, removeStudent } from '../../../../../utils/firebaseUtil'

import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

import AddUserDialog from './AddUserDialog';

import {
  Typography,
  Box,
  Grid,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody
} from '@mui/material';

import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { useParams } from 'react-router-dom';

import Teacherdrawer from '../../classdrawer/ClassDrawerTeacher';
import bgImage from '../../../../../assets/img/jpg/animatedcomputer.jpg';


import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';

// import CreateClass from './CreateClass';
// import JoinClass from './JoinClass';

const style = {
  gridcontainer: {
    display: "flex",
    marginTop: 5,
    padding: 2,
    maxWidth: 1100,
    borderBottom: 0.5,
    borderColor: (theme) => theme.palette.primary.main
  },
  gridcontainerClass: {
    display: "flex",
    // boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
    marginTop: 5,
    padding: 2,
    maxWidth: 1100
  },
  main: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
  },
  iconStyle: {
    margin: 0.5
  },
  btnStyle: {
    borderRadius: 2,
    fontSize: 20,
    width: 150,
    marginLeft: 2,
    textTransform: 'none',
    color: (theme) => theme.colors.textColor,
    backgroundColor: "#4BAEA6",
    '&:hover': {
      backgroundColor: '#35D6C9',
    },
  },
  textStyle: {
    paddingLeft: 2,
    fontSize: 20,
    fontWeight: 400
  },
  linkStyle: {
    paddingLeft: 0
  },
  imgStyle: {
    height: 300,
    width: 300
  },
  imgContainer: {
    width: 200
  },
  txtContainer: {
    width: 500
  }
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function StudentList() {

  const history = useHistory();
  const { user } = useSelector((state) => state);
  const params = useParams()

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [isTeacher, setIsTeacher] = useState(false)
  const [classCode, setClassCode] = useState('')


  const [classroom, setClassroom] = useState([]);


  const [addUserOpen, SetAddUserOpen] = useState(false);
  const [title, setTitle] = useState('')

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddUserOpen = () => {
    SetAddUserOpen(!addUserOpen);
  }

  //Load classrooms
  useEffect(() => {

    if (Object.keys(user.currentUser).length !== 0) {
      getClassData()
      getUser().then(data => {
        data.map(item => {
          setIsTeacher(item.isTeacher)
        })
      })
    }


  }, [user]);

  const getClassData = () => {
    const classCollection = collection(db, "createclass")
    const qTeacher = query(classCollection, where('ownerId', "==", user.currentUser.uid), where('classCode', "==", params.id));
    const unsubscribe = onSnapshot(qTeacher, (snapshot) => {
      setClassroom(
        snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      );
      snapshot.docs.map(doc => {
        setClassCode(doc.data().classCode)
        setTitle(doc.data().className)
      })
      // setLoading(false);
    }
    )
    return unsubscribe;
  }

  const handleAccept = (classCode, userId, classData, studentData) => {
    acceptStudent('createclass', classCode, classData, studentData)
  }

  const handleRemove = (classCode, userId, studentData) => {
    removeStudent('createclass', classCode, userId, studentData)
  }

  console.log(classroom)

  const classroomBody = () => {
    return (
      <Box component={Grid} container justifyContent="center" >
        {classroom && classroom.map(item =>
          <Grid container sx={style.gridcontainerClass} >
            <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }} container>
              <Typography variant="h5" sx={style.linkStyle} onClick={() => null}>Classroom name : {item.className}</Typography>
            </Grid>
            <Grid container xs={12} direction='column'>
              <Typography variant="p" sx={{ marginTop: 1 }}>section: {item.section}</Typography>
              <Typography variant="p" sx={{ marginTop: 1 }}>subject: {item.subject}</Typography>
              <Typography variant="p" sx={{ marginTop: 1 }}>room: {item.room}</Typography>
            </Grid>
            {/* <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginTop: 1 }}>{item.ownerEmail}</Typography>
          </Grid> */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ marginTop: 1 }}>Student List ({item.students && item.students.length !== 0 ? item.students.length : 0})</Typography>
              {/* <Box component={Grid} container justifyContent="flex-end" sx={{ marginBottom: 2 }}>
                <Button variant="contained" sx={style.btnStyle}><PersonAddAltIcon sx={style.iconStyle} />Request</Button>
                <Button variant="contained" sx={style.btnStyle} onClick={handleAddUserOpen}><PersonAddAltIcon sx={style.iconStyle} />User</Button>
              </Box> */}
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Student name A-Z</StyledTableCell>
                      {/* <StyledTableCell align="left">Email</StyledTableCell> */}
                      {/* <StyledTableCell align="left">Phone number</StyledTableCell> */}
                      <StyledTableCell align="left">Type</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {item.students && item.students.map((row) => (
                      <StyledTableRow key={row.name}>
                        <StyledTableCell component="th" scope="row">
                          {row.displayName}
                        </StyledTableCell>
                        {/* <StyledTableCell align="left">{row.email}</StyledTableCell> */}
                        {/* <StyledTableCell align="left">{row.phone}</StyledTableCell> */}
                        <StyledTableCell align="left">{row.isTeacher ? "Teacher" : "Student"}</StyledTableCell>
                        <StyledTableCell align="center">
                          {!row.isJoin ?
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ marginTop: 2, marginRight: 2 }}
                              onClick={() => handleAccept(item.classCode, user.currentUser.uid, item, row)}
                            >
                              Accept
                            </Button>
                            :
                            <Button
                              variant="contained"
                              color="error"
                              sx={{ marginTop: 2, marginRight: 2 }}
                              onClick={() => handleRemove(item.classCode, user.currentUser.uid, row)}
                            >
                              Remove
                            </Button>
                          }


                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}

        <AddUserDialog
          isAddUserOpen={addUserOpen}
          toggleUser={handleAddUserOpen}
        />
      </Box>
    )
  }

  return (
    <Teacherdrawer classCode={params.id} headTitle={title}>
      <Helmet>
        <title>Student List</title>
        <link rel="Classroom Icon" href={logohelmetclass} />
      </Helmet>
      {classroom ?
        <Box component={Grid} container justifyContent="" alignItems="" sx={{ paddingTop: 5, flexDirection: "column" }}>
          {classroomBody()}
        </Box>
        :
        <Box component={Grid} container justifyContent="center" alignItems="center" sx={{ paddingTop: 5, flexDirection: "column" }}>
          <Box component={Grid} container justifyContent="center" sx={style.imgContainer}>
            <Box component="img" src={bgImage} alt="Animated Computer" sx={style.imgStyle} />
          </Box>
          <Box component={Grid} container justifyContent="center" sx={style.txtContainer}>
            <Typography sx={style.linkStyle}>
              This is where you'll see classrooms.
            </Typography>
            <Typography sx={style.linkStyle}>
              You can join class, see activities and check available quiz
            </Typography>
          </Box>
        </Box>
      }
    </Teacherdrawer >
  )
}
