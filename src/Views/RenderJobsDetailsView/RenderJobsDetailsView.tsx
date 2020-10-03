/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Andrii Demchyshyn
 * Project: pathfinder-monitor
 * File last modified: 30.09.2020, 17:14
 * All rights reserved.
 */

import React, {Ref} from 'react';
import {Box, Typography, Divider, withStyles, Grid, useMediaQuery} from "@material-ui/core";
import styles from "./styles";
import clsx from "clsx";
import Progress from "../../Components/Progress";
import Tabs from "../../Components/Tabs";
import TabsPanel from "../../Components/TabsPanel";
import {useTheme} from "@material-ui/core/styles";
import TasksTab from "./Tabs/TasksTab";
import InfoTable from "./Tabs/InfoTab";
import DataTextField from "../../Components/DataTextField";
import StatisticsTab from "./Tabs/StatisticsTab";
import SimpleList from "../../Components/SimpleList";
import Stylable from "../../Interfaces/Stylable";

/**
 * RenderJobsDetailsViewProps - interface for RenderJobsDetailsView component
 * @interface
 * @author Andrii Demchyshyn
 */
interface RenderJobsDetailsViewProps extends Stylable{
}

/**
 * RenderJobsDetailsView - display page with render job details
 * @function
 * @author Andrii Demchyshyn
 */
const RenderJobsDetailsView = React.forwardRef((props: RenderJobsDetailsViewProps, ref: Ref<any>) => {
    const {
        classes,
        className,
    } = props;

    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
    };

    const matches = useMediaQuery(theme.breakpoints.up('md'));
    let tasksTab;
    if (matches) {
        tasksTab = (<TasksTab/>);
    } else {
        tasksTab = (<SimpleList/>);
    }

    return (
        <Box>
            <Box className={classes.normalContent}>
                <Typography variant="subtitle2" className={clsx(classes.pathText, className)}>
                    Renders Jobs / Pathfinder Logo
                </Typography>
                <Typography variant="h4" className={clsx(classes.mainText, className)}>
                    Pathfinder Logo
                </Typography>
                <Progress className={clsx(classes.progressMargin, className)}/>
                <Typography variant="h6">
                    General
                </Typography>
                <Divider className={clsx(classes.dividerMargin, className)}/>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <DataTextField label="Name" children="Pathfinder Logo"/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <DataTextField label="Submitter" children="Danil Andreev"/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <DataTextField label="Organisation" children="Blizzard Entertainment"/>
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        <DataTextField label="Priority" children="1"/>
                    </Grid>

                    <Grid item xs={6} sm={3} md={2}>
                        <DataTextField label="Status" children="Done"/>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <DataTextField label="Submission date" children="25.09.2020 12.59.20"/>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <DataTextField label="Finish date" children="29.09.2020 12.59.20"/>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <DataTextField label="Frames" children="400 - 800"/>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <DataTextField label="Competing tasks" children="2"/>
                    </Grid>

                    <Grid item xs={12}>
                        <DataTextField
                            label="Description"
                            children="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rutrum sodales risus vitae
                                fermentum. Pellentesque hendrerit ultricies libero et lacinia. Integer sed ultricies velit.
                                Sed dui orci, lacinia fermentum lacus vitae, maximus pretium ante."
                        />
                    </Grid>
                </Grid>
                <Typography variant="h6" className={clsx(classes.pluginMargin, className)}>
                    Plugin
                </Typography>
                <Divider className={clsx(classes.dividerMargin, className)}/>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <DataTextField label="Name" children="Plug in Name"/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <DataTextField label="Version" children="ver.1.22474487139..."/>
                    </Grid>
                    <Grid item xs={12}>
                        <DataTextField
                            label="Description"
                            children="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rutrum sodales risus vitae
                                fermentum. Pellentesque hendrerit ultricies libero et lacinia. Integer sed ultricies velit.
                                Sed dui orci, lacinia fermentum lacus vitae, maximus pretium ante."
                        />
                    </Grid>
                </Grid>
            </Box>
            <Tabs
                value={value}
                onChange={handleChange}
                onChangeIndex={handleChangeIndex}
                className={clsx(classes.customTabsMargin, className)}
            >
                <TabsPanel value={value} index={0} dir={theme.direction}>
                    {tasksTab}
                </TabsPanel>
                <TabsPanel value={value} index={1} dir={theme.direction}>
                    <InfoTable/>
                </TabsPanel>
                <TabsPanel value={value} index={2} dir={theme.direction}>
                    <StatisticsTab/>
                </TabsPanel>
            </Tabs>
        </Box>
    );
});
RenderJobsDetailsView.displayName = "RenderJobsDetailsView";
RenderJobsDetailsView.propTypes = {}

export default withStyles(styles)(RenderJobsDetailsView);