/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Nikita Nesterov
 * Project: pathfinder-monitor
 * File last modified: 02.10.2020, 11:19
 * All rights reserved.
 */

import React from "react";
import {
    Grid,
    IconButton,
    Accordion,
    AccordionDetails,
    Divider,
    Typography,
    AccordionSummary,
    withStyles,
    Box
} from "@material-ui/core";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import styles from "./styles";
import DataTextField from "../../../../components/DataTextField/DataTextField";
import Stylable from "../../../../interfaces/Stylable";

/**
 * TokensViewerPropsStyled - interface for TokensViewer function
 * @interface
 * @author Nikita Nesterov
 */
interface TokensViewerPropsStyled extends Stylable{

}

/**
 * TokensViewer - function for UserPageView component used for fast output(creation) of tokens and their description
 * @function
 * @author Nikita Nesterov
 */
const TokensViewer = React.forwardRef((props: TokensViewerPropsStyled) => {
    const {
        classes,
        style,
        className,
    } = props;

    const [isOpen, setIsOpen] = React.useState(false);

    const handleClick=()=>{
        setIsOpen(!isOpen);
    }

    return (
        <Box>
            <Grid container className={clsx(classes.container, className)}>
                <Grid item xs={10}>
                        <Grid container>
                            <Grid item xs={11}>
                                <Typography variant="h6">Tokens</Typography>
                            </Grid>
                            <Grid item xs={1} className={clsx(classes.box, className)}>
                                <IconButton onClick={handleClick} ><ExpandMoreIcon/></IconButton>
                            </Grid>
                        </Grid>
                </Grid>
                <Grid item xs ={10}>
                    <Divider/>
                </Grid>
            </Grid>
            <Grid container spacing={2} className={clsx(classes.container, className)}>
                <Grid item xs ={6}>
                    <DataTextField label="Description" children="token"/>
                </Grid>
                <Grid item xs={4}>
                    <DataTextField label="Token" children="1232123125321423124"/>
                </Grid>
            </Grid>
        </Box>
    );
})

export default withStyles(styles)(TokensViewer)