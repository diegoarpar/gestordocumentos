/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// material-ui core components
import { List, ListItem } from "@material-ui/core";
import { styled }  from "@mui/material/styles";

// @material-ui/icons
import Favorite from "@mui/icons-material/Favorite";

import styles from "@/app/src/assets/jss/material-kit-react/components/footerStyle.js";

const useStyles = styled(styles);

export default function Footer(props) {
  const classes = useStyles();
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                href=""
                className={classes.block}
                target="_blank"
              >
                Sede Electrónica
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href=""
                className={classes.block}
                target="_blank"
              >
                Acerca de Nosotros
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href=""
                className={classes.block}
                target="_blank"
              >
                Blog
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href=""
                className={classes.block}
                target="_blank"
              >
                Contáctenos
              </a>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>
          &copy; {1900 + new Date().getYear()} Bogotá, Colombia
          
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};
