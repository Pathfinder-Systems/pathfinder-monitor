/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: atlas-monitor
 * File last modified: 11/11/20, 3:22 PM
 * All rights reserved.
 */

import {createStyles, Theme} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
    input: {
    },
    container: {
        width: "100%",
        border: "2px solid transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    textContainer: {
        flexGrow: 1,
        textAlign: "center",
    },
    containerDrag: {
        border: "2px dashed black"
    }
});

export default styles;