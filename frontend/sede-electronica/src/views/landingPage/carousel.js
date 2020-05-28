import React, { useState, useEffect } from "react";
// react component for creating beautiful carousel
import Carousel from "react-slick";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import LocationOn from "@material-ui/icons/LocationOn";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import Slider from "react-slick";

import image1 from "assets/img/bg.jpg";
import image2 from "assets/img/bg2.jpg";
import image3 from "assets/img/bg3.jpg";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../menus/navBar";
import SedeElectronicaGeneralServices from '../../services/sedeElectronicaGeneralServices';

import styles from "assets/jss/material-kit-react/views/componentsSections/carouselStyle.js";

const useStyles = makeStyles(styles);

export default function SectionCarousel() {
  const [carruselList,setCarruselList]=useState([]);
  useEffect(()=>{
    SedeElectronicaGeneralServices.GetSedeElectronicaGeneral({"type":"CARRUSEL_ITEM"})
    .then((data)=>{
      setCarruselList(data);
    });
  },[])
  const classes = useStyles();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false
  };
  return (
    <div>
        <h2> Sede Electrónica</h2>
        <Navbar></Navbar>
        <Slider {...settings}>
          {carruselList.map((row,index)=>{
            return (
            <div className="row" key={row.name}>
              <h3 className="column" key={"H3"+row.name} >
              <img src={image1} key={"IMG3"+row.name} alt="Third slide" className="slick-image" />
              </h3>
              <p className="column" key={"P"+row.name}>
                
                {row.description}
                
              </p>
            </div>
            )
          })
          
          }
        </Slider>
      </div>
  );
}
