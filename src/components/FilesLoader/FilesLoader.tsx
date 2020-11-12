/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: atlas-monitor
 * File last modified: 11/11/20, 3:22 PM
 * All rights reserved.
 */

import React from "react";
import {
    Avatar,
    Box, IconButton,
    InputBase,
    ListItem,
    ListItemAvatar, ListItemSecondaryAction,
    ListItemText,
    Typography,
    withStyles,
    List, LinearProgress,
} from "@material-ui/core";
import styles from "./styles";
import {useDropzone} from 'react-dropzone'
import Stylable from "../../interfaces/Stylable";
import clsx from "clsx";
import request from "superagent";
import TempFile from "../../entities/TempFile";
import useCoreRequest from "../../hooks/useCoreRequest";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import DeleteIcon from '@material-ui/icons/Delete';
import useEnqueueErrorSnackbar from "../../utils/enqueueErrorSnackbar";

export const displayName = "FilesLoader";

/**
 * FilesLoaderProps - props for FilesLoader component.
 * @author Danil Andreev
 */
export interface FilesLoaderProps extends Stylable {
    onBeforeLoad?(files: File[]): File[],

    onLoaded?(files: TempFile): void;

    onError?(error: any): void;

    onProgress?(event: ProgressEvent): void;

    multiple?: boolean;

}

/**
 * UploadedFile - interface for local files accounting.
 * @interface
 */
interface UploadedFile {
    file: File;
    temp: TempFile;
}

/**
 * FilesLoader - React component for selecting one or several files and upload them to temp storage.
 * @function
 * @author Danil Andreev
 */
const FilesLoader = React.forwardRef((props: FilesLoaderProps, ref) => {
    const {
        classes,
        className,
        style,
        onBeforeLoad,
        onLoaded,
        onError,
        onProgress,
        multiple,
        ...other
    } = props;
    const coreRequest = useCoreRequest();
    const enqueueErrorSnackbar = useEnqueueErrorSnackbar();

    const [tempFiles, setTempFiles] = React.useState<TempFile[]>([]);

    const onDrop = React.useCallback((inputFiles: File[]) => {
        if (!multiple) clearTempFiles();
        let files = inputFiles;
        if (onBeforeLoad) files = onBeforeLoad(files);
        for (const file of files) {
            coreRequest()
                .post("file")
                .attach(file.name, file)
                .on("progress", (event: ProgressEvent): void => onProgress && onProgress(event))
                .then((result: request.Response): void => {
                    try {
                        const entity = new TempFile(result.body[0]); //TODO: change to body.
                        setTempFiles(prev => ([...prev, entity]));
                        onLoaded && onLoaded(entity);
                    } catch (error) {
                        enqueueErrorSnackbar("Error deleting file.");
                    }
                })
                .catch(error => {
                    onError && onError(error);
                });
        }
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    /**
     * clearTempFiles - removes currently selected files from core origin temp storage.
     * @function
     * @author Danil Andreev
     */
    function clearTempFiles() {
        const targets = [...tempFiles];
        for (const target of targets) {
            deleteFile(target.id).catch(error => {
                enqueueErrorSnackbar(`Error deleting ${target.id}`);
            }).finally(() => setTempFiles([]));
        }
    }

    /**
     * deleteFile - deletes file with selected id from core temp storage.
     * @param id Id of the file in core storage
     * @function
     * @throws Error
     * @author Danil Andreev
     */
    async function deleteFile(id: number): Promise<void> {
        try {
            await coreRequest().delete(`file/${id}`);
        } catch (error) {
            throw error;
        } finally {
            setTempFiles(prev => prev.filter(item => item.id !== id));
        }
    }

    return (
        <Box>
            {!!tempFiles.length &&
            <List>
                {tempFiles.map((file: TempFile) =>
                    <ListItem key={`file-item-${file.id}`}>
                        <ListItemAvatar>
                            <Avatar>
                                <InsertDriveFileIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={file.name}
                            secondary={
                                <LinearProgress variant="determinate" value={3} />
                            }
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={event => deleteFile(file.id)}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )}
            </List>
            }
            <Box
                {...getRootProps()}
                className={clsx(
                    classes.root,
                    classes.dropzone,
                    classes.color,
                    isDragActive && classes.dropzoneDrag,
                    isDragActive && classes.rootDrag,
                    className,
                )}
                style={style}
            >
                <Box className={classes.textContainer}>
                    <Typography variant="h5">UPLOAD</Typography>
                    <Typography variant="body1" color="textSecondary">
                        {isDragActive ? "Drop files here ..." : "Drag and drop or click to select files."}

                    </Typography>
                </Box>
                <InputBase
                    className={classes.input}
                    inputProps={{...getInputProps(), color: "primary", multiple: !!multiple}}
                />
            </Box>
        </Box>
    );
});

FilesLoader.displayName = displayName;

export default withStyles(styles)(FilesLoader);
