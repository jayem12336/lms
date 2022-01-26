import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(0),
  },
  '& .MuiInputBase-input': {
    borderRadius: 24,
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    border: '1px solid #ced4da',
    fontSize: 16,
    width: '100%',
    padding: '10px 12px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px black inset",
    },
    border:'1px solid red'
  },
}));

const style = {
  '.MuiOutlinedInput-input': {
    // border:'1px solid red',
      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 0 black inset",
      },
      
    },
    'input:-internal-autofill-selected': {
      // border: '1px solid green',
      backgroundImage: 'none !important',
      backgroundColor:' black !important'
    }
    // '.MuiInputAdornment-positionEnd': {
    //   border: '1px solid red',
    //   height: 20,
    //   width: 20,
    //   "&:-webkit-autofill": {
    //     WebkitBoxShadow: "0 0 0 1000px black inset",
    //   }
    // },
    
  
}

export default function Input(props) {
  const {
    label,
    value,
    onChange,
    name,
    type,
    pattern,
    errorMessage,
    endAdornment,
    id,
  } = props
  return (
    <div style={{display:'flex',flexDirection:'column', width:'100%'}}>
      <InputLabel shrink htmlFor="bootstrap-input" aria-describedby="component-error-text" style={{fontWeight: "bold", fontSize: 20, color: 'black'}}>
          {label}
      </InputLabel>
      {/* <BootstrapInput 
        defaultValue="rendevouz" 
        // id="bootstrap-input" 
        value={value}
        onChange={(e) => onChange(e)}
        name={name}
        type={type}
        pattern={pattern}
        id={id}
        endAdornment={endAdornment ? endAdornment : ''}
      /> */}
      <OutlinedInput
        style={{borderRadius:24, width: '100%', fontWeight: "bold"}}
        sx={style}
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        pattern={pattern}
        endAdornment={endAdornment ? endAdornment : ''}
      />
      <FormHelperText error={true} id="component-error-text">{errorMessage}</FormHelperText>
    </div>
  );
}
