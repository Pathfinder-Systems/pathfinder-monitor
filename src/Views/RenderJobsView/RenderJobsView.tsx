/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Andrii Demchyshyn
 * Project: pathfinder-monitor
 * File last modified: 30.09.2020, 17:13
 * All rights reserved.
 */

import React, {Ref} from 'react';
import {Box, useMediaQuery, useTheme, withStyles} from "@material-ui/core";
import styles from "./styles";
import RenderJobsTable from "../../Components/RenderJobsTable";
import List from "../../Components/List";


interface RenderJobsViewPropsStyled {
    classes?: any;
    style?: any;
    className?: string;
}

/**
 * RenderJobsView - display render jobs page
 * @function
 * @author Andrii Demchyshyn
 */
const RenderJobsView = React.forwardRef((props: RenderJobsViewPropsStyled, ref: Ref<any>) => {
    const {
        classes,
        className,
    } = props;

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    let tableList;
    if(matches) {
        tableList = (<RenderJobsTable />);
    } else {
        tableList = (<List />);
    }

    return (
        <Box>
            {tableList}
        </Box>
    );
});
RenderJobsView.displayName = "RenderJobsView";
RenderJobsView.propTypes = {}

export default withStyles(styles)(RenderJobsView);