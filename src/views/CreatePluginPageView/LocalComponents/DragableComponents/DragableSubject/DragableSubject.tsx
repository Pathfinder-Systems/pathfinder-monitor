/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-monitor
 * File last modified: 18.11.2020, 17:29
 * All rights reserved.
 */

import React from 'react'
import { useDrag } from 'react-dnd'
import {withStyles} from "@material-ui/core";
import styles from "./styles";
import Stylable from "../../../../../interfaces/Stylable";

interface DragableSubjectProps extends Stylable{

}

const DragableSubject: React.FC<DragableSubjectProps> = (classes) => {
    const [, drag] = useDrag({ item: { type: "box" } })
    return (
        <div ref={drag}>
            Drag me
        </div>
    )
}

export default withStyles(styles)(DragableSubject);