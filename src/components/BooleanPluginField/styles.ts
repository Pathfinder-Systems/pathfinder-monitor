/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-monitor
 * File last modified: 01.12.2020, 03:36
 * All rights reserved.
 */

import {createStyles, Theme} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
    container: {
        display: "flex",
        width: "100%",
    },
    text: {
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
    }
});

export default styles;