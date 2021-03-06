/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-monitor
 * File last modified: 10.11.2020, 19:22
 * All rights reserved.
 */

import {createStyles, Theme} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
    containerToken: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    root: {
        display: "flex",
        flexDirection: "row",
    },
    avatar: {
        variant: "circle",
        height: theme.spacing(25),
        width: theme.spacing(25),
    },
    container: {
        alignItems: "center",
        justifyContent: "center",
        [theme.breakpoints.down("sm")]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    },
    topic: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    box: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    typographyToken: {
        display: "flex",
        alignItems: "flex-end",
    },
    firstLine: {
        justifyContent: "center",
        alignItems: "center",
        listStyleType: "none",
        [theme.breakpoints.down("sm")]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    },
    paddingNone: {
        paddingLeft: 0,
        paddingBottom: 0,
    },
    loading: {
        display: "flex",
        height: "90vh",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default styles;