import React, { useState } from 'react'

import {
    Box,
    Button,
    Typography,
    Grid,
    TextField,
    InputAdornment,
    FormControl,
    IconButton,
    Stack,
    Container,
    FormControlLabel,
    Radio,
} from '@mui/material';

import { useDispatch } from 'react-redux';

import { Link, useHistory } from 'react-router-dom';

import Input from '../../components/Input'
import NavBar from '../../components/navbarcomponent/NavBar'
import NewFooter from '../../components/linkcomponent/NewFooter';


import logoRendezvous from '../../assets/img/jpg/RendezvousNewLogo.jpg'
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { loginInitiate } from '../../redux/actions/userAction';
import { getUserLogin } from '../../utils/firebaseUtil'

import { getAuth, signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";

import { setDoc, doc } from '@firebase/firestore';

import { db } from '../../utils/firebase';

const style = {
    //helper
    marginTopButton: {
        marginTop: 2
    },
    marginStyle: {
        marginTop: 1
    },
    margin: {
        marginTop: {
            xs: -10,
            md: 1
        },
        maxWidth: 700
    },
    root: {
        padding: "80px 20px",
    },
    section1: {
        padding: "150px 0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    headingStyle1: {
        marginTop: "-10px",
        textAlign: "center",
        fontWeight: 700,
        fontSize: {
            xs: "1rem",
            sm: "1.2rem",
            md: "1.5rem",
        },
        fontFamily: "ComicSans"
    },
    btnColor: {
        backgroundColor: (theme) => theme.colors.buttonColor,
        color: (theme) => theme.colors.textColor,
        "&:hover": {
            backgroundColor: (theme) => theme.colors.buttonColor,
            color: (theme) => theme.colors.navButtonHover,
        }
    },
    forgotStyle: {
        color: (theme) => theme.palette.primary.main,
        fontWeight: 500,
        fontSize: 15,
        marginBottom: 2,
        cursor: 'pointer'
    },
    loginContainer: {
        flexDirection: {
            md: 'row',
            sm: 'column',
            xs: 'column'
        },
        display: 'flex'
    },
    btnStyle: {
        height: 50,
        width: 200,
        fontSize: 23,
        borderRadius: 100,
        textTransform: 'none',
        marginTop: 1,
        backgroundColor: '#FFBD1F'
    },
    btnGoogle: {
        height: 50,
        width: 300,
        fontSize: 18,
        backgroundColor: 'transparent',
        color: 'black',
        borderRadius: 100,
        marginTop: 2,
        "&:hover": {
            backgroundColor: (theme) => theme.palette.primary.main,
            color: 'white',
        }
    },
    titleClass: {
        fontSize: 20,
        paddingTop: 5
    },
    textStyle: {
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 2,
        marginLeft: 1
    },
    imgContainer: {
        padding: {
            xs: 0,
            sm: 5,
            md: 5
        },
    },
    imgStyle: {
        height: {
            xs: 200,
            sm: 300,
            md: 500,
        },
        width: {
            xs: 300,
            sm: 500,
            md: 700,
        },
    },
}

export default function Login() {

    const dispatch = useDispatch();

    const history = useHistory();

    const [values, setValues] = useState({
        email: '',
        password: '',
        showPassword: false,
    });
    const [error, setError] = useState('')

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const btnSignIn = (e) => {
        // e.preventDefault();
        if (values.email === '' || values.password === '') {
            setValues({ ...values, errors: "Please Complete all fields", isLoading: false, password: "" })
            alert(values.errors);
        }
        else {
            setValues({ ...values, errors: "", isLoading: true });
            dispatch(loginInitiate(values.email, values.password, history));
        }
    };

    const handleNew = async (user) => {
        const docRef = doc(db, "users", user.uid);
        const payload = { displayName: user.displayName, email: user.email, uid: user.uid, photoURL: user.photoURL };
        await setDoc(docRef, payload);
    }

    const btnSignInWithGoogle = () => {
        const provider = new GoogleAuthProvider()
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                // The signed-in user info.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // Check if user is new
                const {isNewUser}  = getAdditionalUserInfo(result)
                const userId = result.user.uid
                const user = result.user;
                // handleNew(user);
                if (isNewUser) {
                    setError(`account doesn't exist`)
                }else {
                    getUserLogin(result.user.email).then(userData => {
                        userData.map(item => {
                            if(item.isTeacher){
                                history.push('/classroom')
                            }else {
                                history.push('/studentclassroom')
                            }
                        })
                    })
                }
                
                // history.push('/classroom')
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorMessage = error.message;
                alert(errorMessage);
                // The email of the user's account used.
                const email = error.email;
                alert(email);
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                alert(credential);
            });
    }
    console.log(values)

    return (
        <Container maxWidth disableGutters={true}>
            <NavBar />
            <Box sx={style.section1}>
                <Box component={Grid} container justifyContent="center">
                    <Typography sx={{ fontSize: 50, }}>Welcome Back!</Typography>
                </Box>
                <Box sx={style.loginContainer}>
                    <Box sx={style.margin}>
                        <Grid container style={{
                            padding: "100px 80px"
                        }} justifyContent='center' spacing={4}>
                            <Grid item>
                                <Typography sx={{color:'red'}}>{error}</Typography>
                            </Grid>
                            <Grid item xs={12} spacing={3}>
                                <Typography sx={style.textStyle}>Email</Typography>
                                <Input
                                    type='text'
                                    value={values.email}
                                    onChange={handleChange('email')}
                                    name='firstName'
                                // errorMessage={error.firstName}
                                />
                            </Grid>
                            <Grid item xs={12} spacing={3}>
                                <Typography sx={style.textStyle}>Password</Typography>
                                <Input
                                    type={values.showPassword ? 'text' : 'password'}
                                    onChange={handleChange('password')}
                                    value={values.password}
                                    name='password'
                                    id="outlined-adornment-password"
                                    endAdornment={
                                        <InputAdornment position="end">
                                          <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                          >
                                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                          </IconButton>
                                        </InputAdornment>
                                      }
                                />
                            </Grid>
                            <Grid container justifyContent="space-between" sx={{ paddingLeft: 6 }}>
                                <FormControlLabel value="best" control={<Radio />} label="Remember me" />
                                <Link style={{ marginTop: 4, textDecoration: "none" }}
                                    to='/forgot'>Forget Password?</Link>
                            </Grid>
                            <Grid
                                container
                                direction="column"
                                justifyContent="space-around"
                                alignItems="center"
                            >
                                <Typography noWrap component="div" sx={style.titleClass}>
                                    Don't have an account.
                                    <Button
                                        variant="text"
                                        sx={{ fontSize: 20, marginTop: -.5 }}
                                        onClick={() => history.push('/register')}
                                    >Sign up
                                    </Button>
                                </Typography>
                                <Button
                                    variant="contained"
                                    // onClick={signup}
                                    onClick={(e) => btnSignIn(e)}
                                    sx={style.btnStyle}
                                >
                                    Sign in
                                </Button>
                                <Typography noWrap component="div" sx={{ marginTop: 2 }}>
                                    ------ or continue with ------
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<GoogleIcon />}
                                    sx={{ ...style.marginStyle, ...style.btnColor, ...style.btnGoogle }}
                                    onClick={btnSignInWithGoogle}
                                >
                                    Sign In With Google+
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={style.imgContainer}>
                        <Box component={Grid} container justifyContent="center" alignItems="center">
                            <Box
                                component="img"
                                src={"assets/img/login_bg.png"}
                                alt="imagecontact"
                                sx={style.imgStyle}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <NewFooter />
        </Container>
        // <Box sx={style.root}>
        //     <Grid container justifyContent="center">    
        //         <Box sx={style.section1} boxShadow={12}>
        //             <Typography variant="subtitle1" color="textPrimary" sx={style.headingStyle1}>
        //                 Sign in to your Rendezvous Account
        //             </Typography>
        //             <img
        //                 src={logoRendezvous}
        //                 alt="Rendezvous Logo"
        //                 style={{ height: "100px", width: "100px" }}
        //             />
        //             {/* <Button
        //                 variant="outlined"
        //                 startIcon={<GoogleIcon />}
        //                 sx={{ ...style.marginStyle, ...style.btnColor }}
        //                 onClick={btnSignInWithGoogle}
        //             >
        //                 Sign In With Google+
        //             </Button> */}
        //             <Typography
        //                 variant="subtitle1"
        //                 sx={style.marginStyle}
        //             >
        //                 OR
        //             </Typography>
        //             <FormControl sx={{ m: 1, backgroundColor: 'white' }} fullWidth variant="outlined">
        //                 <TextField
        //                     id="input-with-icon-textfield"
        //                     variant="outlined"
        //                     placeholder="Email Address"
        //                     onChange={handleChange('email')}
        //                     InputProps={{
        //                         startAdornment: (
        //                             <InputAdornment position="start">
        //                                 <EmailIcon />
        //                             </InputAdornment>
        //                         ),
        //                     }}
        //                     size="medium"
        //                 />
        //             </FormControl>
        //             <FormControl sx={{ m: 1, backgroundColor: 'white' }} fullWidth variant="outlined">
        //                 <TextField
        //                     id="outlined-adornment-password"
        //                     type={values.showPassword ? 'text' : 'password'}
        //                     value={values.password}
        //                     placeholder="Password"
        //                     onChange={handleChange('password')}
        //                     InputProps={{
        //                         startAdornment: (
        //                             <InputAdornment position="start">
        //                                 <LockIcon />
        //                             </InputAdornment>
        //                         ),
        //                         endAdornment: (
        //                             <InputAdornment position="end">
        //                                 <IconButton
        //                                     aria-label="toggle password visibility"
        //                                     onClick={handleClickShowPassword}
        //                                     onMouseDown={handleMouseDownPassword}
        //                                     edge="end"
        //                                 >
        //                                     {values.showPassword ? <VisibilityOff /> : <Visibility />}
        //                                 </IconButton>
        //                             </InputAdornment>
        //                         )
        //                     }}
        //                     InputLabelProps={{
        //                         sx: style.labelStyle
        //                     }}
        //                 />
        //             </FormControl>
        //             <Grid container justifyContent='flex-end'>
        //                 <Link to="/forgot" style={{ textDecoration: 'none' }}>
        //                     <Typography
        //                         sx={style.forgotStyle}
        //                     >

        //                         Forgot Password?
        //                     </Typography>
        //                 </Link>
        //             </Grid>
        //             <Button
        //                 variant="outlined"
        //                 startIcon={<ExitToAppIcon />}
        //                 sx={{ ...style.marginStyle, ...style.btnColor }}
        //                 onClick={btnSignIn}
        //             >
        //                 Sign In
        //             </Button>
        //             <Typography
        //                 variant="subtitle1"
        //                 sx={style.marginTopButton}
        //             >

        //                 Don't have an Accoount
        //             </Typography>
        //             <Link to="/register" style={{ textDecoration: 'none' }}>
        //                 <Button
        //                     variant="outlined"
        //                     startIcon={<PersonAddIcon />}
        //                     sx={{ ...style.btnColor, ...style.marginTopButton }}
        //                 >
        //                     Register New Account
        //                 </Button>
        //             </Link>
        //         </Box>
        //     </Grid>
        // </Box>

    )
}
