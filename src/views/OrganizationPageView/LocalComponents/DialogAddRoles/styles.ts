/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-monitor
 * File last modified: 04.11.2020, 22:38
 * All rights reserved.
 */

import {createStyles, Theme} from "@material-ui/core";
import {yellow} from "@material-ui/core/colors";

const styles = (theme: Theme) => createStyles({
    firstLine: {
        justifyContent: "center",
        alignItems: "center",
        listStyleType: "none",
    },
    dialogRoles: {
        width: "100%",
        textAlign: "center",
        paddingBottom: theme.spacing(2),
    },
    gridPadding: {
        marginBottom: theme.spacing(1),
    },
    paddingNone: {
        paddingLeft: 0,
        paddingBottom: 0,
    },
    newRole: {
        [theme.breakpoints.down("xs")]: {
            maxWidth: 375,
        },
    },
    makeDefaultButton:{
        backgroundColor: yellow[700],
        "&:hover": {
            backgroundColor: yellow[600]
        }
    },
    disabledButton:{
        backgroundColor:yellow[900],
    }

});

export default styles;