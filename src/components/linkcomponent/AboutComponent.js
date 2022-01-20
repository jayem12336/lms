import React from 'react'
import {
    Box,
    Button,
    Typography,
    Grid,
    useTheme,
    useMediaQuery
} from '@mui/material';
import aboutImage from '../../assets/img/jpg/about.jpg'

const style = {
    //helper
    marginStyle: {
        margin: {
            xs: 3,
            sm: 6,
            md: 10
        }
    },
    textAlignStyle: {
        textAlign: 'center',
    },
    textStyle: {
        fontSize: 25,
        fontWeight: 500,
        color: (theme) => theme.palette.primary.main
    },
    descriptStyle: {
        fontSize: 18,
        fontWeight: 200
    },

    section1: {
        padding: "70px 0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    cardStyle: {
        maxWidth: 345,
        height: 420,
        marginTop: 10,
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
    columnContainer: {
        display: "flex",
        justifyContent: "center",
        padding: 5
    },
    title: {
        fontSize: 40,
        fontWeight: 500
    },
    titleContainer: {
        flexDirection: 'column',
        display: 'flex',
    },
    text: {
        marginTop: 0.5,
        fontSize: 20
    },
    textContainer: {
        marginTop: 2,
        flexDirection: 'column',
    },
    button: {
        height: 50,
        width: 180,
        borderRadius: 20,
    },
    buttonContainer: {
        marginTop: 3,
    },
    aboutContainer: {
        flexDirection: {
            md: 'row',
            sm: 'column',
            xs: 'column'
        },
        display: 'flex'
    },
    imgContainer: {
        padding: {
            xs: 0,
            sm: 5,
            md: 10
        },
    }
}

export default function AboutComponent() {

    const theme = useTheme();
    const matchMD = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Box>
            <Box sx={style.section1} id="About">
                <Box sx={style.aboutContainer}>
                    <Box sx={style.marginStyle}>
                        <Box component={Grid} container justifyContent="flex-start" sx={style.titleContainer}>
                            <Typography sx={style.title}>About</Typography>
                            <Typography sx={style.title}>What is Rendezvous?</Typography>
                            <Typography sx={style.title}>The Solution for Education</Typography>
                        </Box>
                        <Box component={Grid} container justifyContent="flex-start" sx={style.textContainer}>
                            <Typography sx={style.text}> But we’re not only the makers of a leading learning</Typography>
                            <Typography sx={style.text}> management system. We're an education technology</Typography>
                            <Typography sx={style.text}> company with a mission to elevate student success,</Typography>
                            <Typography sx={style.text}> amplify the power of teaching, and inspire everyone to</Typography>
                            <Typography sx={style.text}> learn together.</Typography>
                        </Box>
                        <Box component={Grid} container justifyContent={matchMD ? "flex-start" : "center"} sx={style.buttonContainer}>
                            <Button
                                variant="contained"
                                sx={style.button}
                            >
                                Read Our Story
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={style.imgContainer}>
                        <Box component={Grid} container justifyContent="center" alignItems="center">
                            <Box
                                component="img"
                                src={aboutImage}
                                alt="imagecontact"
                                sx={style.imgStyle}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
