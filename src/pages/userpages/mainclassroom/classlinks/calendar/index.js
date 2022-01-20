import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router';

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

import {
    Typography,
    Box,
    Grid,
    Button,
} from '@mui/material';

import "react-big-calendar/lib/css/react-big-calendar.css";

import Classdrawer from '../../classdrawer/ClassDrawer';
import bgImage from '../../../../../assets/img/jpg/animatedcomputer.jpg';


const style = {
    gridcontainer: {
        display: "flex",
        padding: 2,
        borderBottom: 3,
        borderColor: (theme) => theme.palette.primary.main
    },
    gridcontainerClass: {
        display: "flex",
        padding: 2,
        cursor: 'pointer',
        marginTop: -3
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
        borderRadius: 20,
        fontSize: 20,
        width: 150,
        marginRight: 2,
        marginBottom: 4,
        textTransform: 'none',
        color: (theme) => theme.colors.textColor,
        backgroundColor: (theme) => theme.palette.primary.main,
        '&:hover': {
            backgroundColor: "#3e857f",
            boxShadow: '0 3px 5px 2px rgba(163, 163, 163, .3)',
        },
    },
    textStyle: {
        paddingLeft: 2,
        fontSize: 20,
        fontWeight: 400
    },
    linkStyle: {
        cursor: 'pointer',
        color: 'white',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 600
    },
    imgStyle: {
        height: 300,
        width: 300,

    },
    imgContainer: {
        width: 200
    },
    txtContainer: {
        width: 500
    },
    headerClass: {
        backgroundColor: '#4BAEA6',
        width: '112%',
        marginLeft: -2,
        height: 70,
        marginTop: -2,
        paddingTop: 2
    }
}



export default function CalendarComponent() {

    const localizer = momentLocalizer(moment)

    return (
        <Classdrawer headTitle='Classroom'>
            <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 10 }}>
                <Grid container sx={style.gridcontainer} justifyContent="space-between">
                    <Calendar
                        localizer={localizer}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 1000, width: "100%" }}
                    />
                </Grid>
            </Box>
        </Classdrawer >
    )
}
