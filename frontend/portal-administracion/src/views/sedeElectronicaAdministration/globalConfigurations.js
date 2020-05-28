import React,{ useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import GlobalConfigurationsUserRegistration from './globalConfigurationsUserRegistration';
import GlobalConfigurationsCarrusel from './globalConfigurationsCarrusel';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import AjustIcon from '@material-ui/icons/Adjust';
import AppBar from "@material-ui/core/AppBar";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";

const GlobalConfigurations =()=>{
    const [openModalUserRegistration,setOpenModalUserRegistration]=useState(false);

    const handleCloseModalUserRegistration=()=>setOpenModalUserRegistration(false);

    const [openModalCarrusel,setOpenModalCarrusel]=useState(false);
    const handleCloseModalCarrusel=()=>setOpenModalCarrusel(false);

    const tileData = [
        {"title":"Configuración registro de usuarios", "action":(e)=>setOpenModalUserRegistration(true)}
        ,{"title":"Configuración carrusel", "action":(e)=>setOpenModalCarrusel(true)}
        
    ];
    const classes = useStyles();
    return (
    <div>

        <div className={classes.root}>
            <GridList  className={classes.gridList}     >

                {tileData.map((tile, index) => (
                <GridListTile key={tile.img+"G"+index} onClick={tile.action}  className={classes.gridListTile}>
                    <IconButton key={tile.img+"I"+index} aria-label={`info about ${tile.title}`} className={classes.icon}>
                        <AjustIcon/>
                        {tile.title}
                    </IconButton>

                </GridListTile>
                ))}
            </GridList>

        </div>

        <GlobalConfigurationsUserRegistration openM={openModalUserRegistration} handleCloseM={handleCloseModalUserRegistration} />
        <GlobalConfigurationsCarrusel openM={openModalCarrusel} handleCloseM={handleCloseModalCarrusel} />
    </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      height: '100%'
    },
    gridList: {
      width: 400,
      height: 110,
      overflow: 'hidden'
    },
    icon: {
      color: 'rgba(255, 255, 255, 255)',
      background: '#3f51b5',
      width: 100,
      height: 100,
      fontSize: '0.6rem'
    },
    
    title:{
        fontSize: "0.6rem !important",
        height: 50
    },
    gridListTile:{
        height: 100,
        overflow: 'hidden'
    }
  }));

export default GlobalConfigurations;