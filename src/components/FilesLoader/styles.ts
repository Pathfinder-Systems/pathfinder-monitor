/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-monitor
 * File last modified: 11.11.2020, 18:03
 * All rights reserved.
 */

import {createStyles, Theme} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
    input: {},
    root: {
        width: "100%",
    },
    rootDrag: {
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    color: {
        backgroundColor: "rgba(255,255,255,0.05)",
    },
    dropzone: {
        userSelect: "none",
        cursor: "pointer",
        width: "100%",
        border: "2px solid transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(1),
    },
    dropzoneDrag: {
        border: "2px dashed black",
        height: 300,
    },
    textContainer: {
        flexGrow: 1,
        textAlign: "center",
    },
});

export default styles;