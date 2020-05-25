import React,{ useState,useEffect } from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import GlobalConfigurationsUserRegistration from './globalConfigurationsUserRegistration';

const GlobalConfigurations =()=>{
    const [openModalUserRegistration,setOpenModalUserRegistration]=useState(false);
    const handleCloseModalUserRegistration=()=>setOpenModalUserRegistration(false);
    return (
    <div>
        <Button variant="contained" color="primary"  
                onClick={(e) => {
                    setOpenModalUserRegistration(true);

                }}>
                Configuración registro de usuarios
            </Button>

        <GlobalConfigurationsUserRegistration open={openModalUserRegistration} handleClose={handleCloseModalUserRegistration} />
    </div>
    );
}

export default GlobalConfigurations;