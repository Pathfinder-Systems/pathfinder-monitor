/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-monitor
 * File last modified: 24.11.2020, 18:20
 * All rights reserved.
 */

import {createStyles, Theme} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
    typographyText: {
        textAlign: "center",
    },
    gridPadding: {
        marginBottom: theme.spacing(1),
    },
    listPadding: {
        padding: 0,
    }
});

export default styles;