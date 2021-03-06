/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-monitor
 * File last modified: 12.11.2020, 18:37
 * All rights reserved.
 */

import React, {Ref, useCallback, useEffect, useState} from "react";
import {
    Button,
    Divider,
    Grid,
    IconButton,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    TextField,
    withStyles
} from "@material-ui/core";
import styles from "./styles";
import Stylable from "../../interfaces/Stylable";
import List from "@material-ui/core/List";
import AddIcon from "@material-ui/icons/Add";
import PluginCreation from "./LocalComponents/PluginCreation";
import update from "immutability-helper";
import IdGenerator from "../../utils/IdGenerator";
import FilesLoader from "../../components/FilesLoader";
import BasicPluginField from "../../entities/BasicPluginField";
import GroupField from "../../entities/GroupField";
import useEnqueueErrorSnackbar from "../../utils/enqueueErrorSnackbar";
import useCoreRequest from "../../hooks/useCoreRequest";
import IntegerField from "../../entities/IntegerField";
import {useChangeRoute} from "routing-manager";
import {PluginSetting, PluginSettingsSpec, ValidationError} from "@atlasrender/render-plugin";
import useAuth from "../../hooks/useAuth";
import ErrorHandler from "../../utils/ErrorHandler";
import StringField from "../../entities/StringField";
import FloatField from "../../entities/FloatField";


interface PluginContextProps {
    pluginFields: (BasicPluginField)[];
    errorIds: number[];
    handleAddPluginField: (field: BasicPluginField, id: number) => void,
    handleDeletePluginField: (field: BasicPluginField) => void,
    handleEditPluginField: (field: BasicPluginField, index: number) => void,
    idGenerator: () => number;
    moveField: (inputArray: BasicPluginField[], targetId: number, toId: number, objectToAdd: BasicPluginField, remove: boolean) => BasicPluginField[];
    handleGetErrorIndexes: (index: number) => void;
    handleDeleteErrorsIds: (index: number) => void;
}

export const PluginContext = React.createContext<PluginContextProps>({
    pluginFields: [],
    errorIds: [],
    handleAddPluginField: (field: BasicPluginField, id: number) => {
    },
    handleDeletePluginField: (field: BasicPluginField) => {
    },
    handleEditPluginField: (field: BasicPluginField, index: number) => {
    },
    idGenerator: (): number => {
        return 1;
    },
    moveField: (inputArray: BasicPluginField[], targetId: number, toId: number, objectToAdd: BasicPluginField, remove: boolean = false) => {
        return [];
    },
    handleGetErrorIndexes: (index: number) => {
    },
    handleDeleteErrorsIds: (index: number) => {
    }
});


/**
 * CreatePluginPageViewProps - interface for CreatePluginPageView
 * @interface
 * @author Andrii Demchyshyn
 */
interface CreatePluginPageViewProps extends Stylable {

}

interface Plugin {
    name: string,
    version: string,
    note?: string,
    description?: string,
    file: number,
    organization: number,
    settings: BasicPluginField[] | PluginSetting[],
}

/**
 * UserPageView - function for showing create plugin page
 * @function
 * @author Andrii Demchyshyn
 */
const CreatePluginPageView = React.forwardRef((props: CreatePluginPageViewProps, ref: Ref<any>) => {
    const {
        classes,
        className,
        style,
    } = props;

    const {changeRoute} = useChangeRoute();
    const {logout} = useAuth();
    const enqueueErrorSnackbar = useEnqueueErrorSnackbar();
    const coreRequest = useCoreRequest();
    const idGenerator = React.useRef(IdGenerator());
    const getNextId = (): number => idGenerator.current.next().value;
    const {getRouteParams} = useChangeRoute();
    const {id} = getRouteParams();

    const [pluginFields, setPluginFields] = useState<BasicPluginField[]>([]);
    const [errorIds, setErrorIds] = useState<number[]>([]);

    console.log(pluginFields);

    const [plugin, setPlugin] = useState<Plugin>({
        name: "",
        version: "",
        note: "",
        description: "",
        file: 0,
        organization: +id,
        settings: pluginFields,
    });

    function getFileId(id: number) {
        setPlugin((prev) => ({...prev, file: id}));
        console.log("file id", id);
    }

    useEffect(() => {
        setPlugin((prev) => ({...prev, settings: pluginFields}));
    }, [pluginFields]);

    const [isDialogPluginButtonActive, setIsDialogPluginButtonActive] = useState(false);

    function handlePluginChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.persist();
        setPlugin((prev) => ({...prev, [event.target.name]: event.target.value}));
        console.log(plugin);
    }

    function handleCreatePlugin() {
        try {
            const validated = new PluginSettingsSpec(pluginFields);
            // console.log("kuku validate", validated);
            setPlugin((prev) => ({...prev, fields: validated}));
        } catch (err) {
            if (err instanceof ValidationError) {
                handleCheckValidation();
                enqueueErrorSnackbar(err.message);
                console.log(err.getNested());
            } else {
                const errorHandler = new ErrorHandler(enqueueErrorSnackbar);
                errorHandler
                    .on(400, "Plugin settings validation error")
                    .on(401, () => {
                        logout();
                    })
                    .on(404, "Temp file not found")
                    .on(409, "Plugin with this version already exists")
                    .handle(err);
            }
            return;
        }
        console.log("Before send:", plugin);
        coreRequest()
            .post("plugins")
            .query({organization: plugin.organization})
            .send(plugin)
            .then(response => {
                console.log("done");
                changeRoute({page: `organization/${plugin.organization}`, create: null, id: null})
            })
            .catch(err => {
                const errorHandler = new ErrorHandler(enqueueErrorSnackbar);
                errorHandler
                    .on(400, "Plugin settings validation error")
                    .on(401, () => {
                        logout();
                    })
                    .on(404, "Organization not found")
                    .on(409, "Plugin with this version already exists")
                    .handle(err);
            });
    }


    const move = useCallback(
        (dragIndex: number, hoverIndex: number, targetId: number, toId: number) => {
            const draggedField = pluginFields[dragIndex];
            setPluginFields(
                update(pluginFields, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, draggedField],
                    ],
                }),
            );
        },
        [pluginFields],
    );


    function moveField(inputArray: BasicPluginField[], targetId: number, toId: number, objectToAdd: BasicPluginField, remove: boolean = false): BasicPluginField[] {

        const array = [...inputArray];

        let target: BasicPluginField | null = null;

        function findField(callback: (array: BasicPluginField[], field: number) => BasicPluginField[]) {
            return function findTarget(array: BasicPluginField[], id: number): BasicPluginField[] {
                for (let i = 0; i < array.length; i++) {
                    const field = array[i];
                    if (field.id === id) {
                        return callback(array, i);
                    } else {
                        if (field instanceof GroupField && field.nested) {
                            field.nested = findTarget(field.nested, id);
                        }
                    }
                }
                return array;
            };
        }

        const newArray: BasicPluginField[] = findField((callbackArray, index) => {
            target = callbackArray[index];
            return callbackArray.filter(item => item.id !== callbackArray[index].id);
        })(array, targetId);

        if (remove) {
            return newArray;
        }

        if (!target)
            target = objectToAdd;


        const finalArray: BasicPluginField[] = findField((callbackFinalArray, index) => {
            if (callbackFinalArray[index] instanceof GroupField) {

                if (target) {
                    const callbackResult = (callbackFinalArray[index] as GroupField);
                    if (callbackResult.nested) {
                        callbackResult.nested.push(target);
                    }
                }
            } else {

                let saveFieldTo: BasicPluginField = new BasicPluginField({
                    type: "integer",
                    name: "name",
                    label: "label",
                    id: 1000,
                });

                for (let i = 0; i < callbackFinalArray.length; i++) {
                    if (callbackFinalArray[i].id === toId) {
                        saveFieldTo = callbackFinalArray[i];
                    }
                }

                for (let i = 0; i < callbackFinalArray.length; i++) {
                    if (callbackFinalArray[i].id === toId && target) {
                        callbackFinalArray[i] = target;
                        callbackFinalArray.push(saveFieldTo);
                    }
                }

            }

            return callbackFinalArray;
        })(array, toId);

        return finalArray;

    }

    function handleAddPluginField(field: BasicPluginField, id: number) {
        setPluginFields(prev => ([...prev, field]));
    }

    function handleEditPluginField(field: BasicPluginField, index: number) {
        const copy = [...pluginFields];
        copy.splice(index, 1, field);
        setPluginFields(copy);
    }

    function handleDeletePluginField(field: BasicPluginField) {
        setPluginFields(pluginFields.filter(pluginField => pluginField.id !== field.id));
    }

    function handleSetIsDialogPluginButtonActive() {
        setIsDialogPluginButtonActive(true);
    }

    const handleGetErrorIds = (id: number) => {
        setErrorIds(prev => ([...prev, id]));
    };

    const handleDeleteErrorsIds = (id: number) => {
        const copy = errorIds.filter(errorId => errorId !== id);
        setErrorIds(copy);

    }

    const handleCheckValidation = () => {
        pluginFields.forEach(field => {
            const id = handleValidation(field);
            console.log(id);
            if(id) {
                handleGetErrorIds(id);
            }
        })
    };

    function handleValidation(pluginField: BasicPluginField) {
        if (!pluginField.name || pluginField.name.length < 3 || pluginField.name.length > 50 || pluginFields.filter(field => field.name === pluginField.name).length > 1) {
            console.log("name");
            return pluginField.id;
        }
        if (!pluginField.label || pluginField.label.length < 3 || pluginField.label.length > 50) {
            return pluginField.id;
        }
        // if (pluginField instanceof IntegerField || pluginField instanceof StringField || pluginField instanceof FloatField) {
        //     if (!pluginField.min || pluginField.min < 0) {
        //         return pluginField.id;
        //     }
        //     if (!pluginField.max || pluginField.max < 0) {
        //         return pluginField.id;
        //     }
        //     if (pluginField instanceof StringField) {
        //         if (!pluginField.default || pluginField.min && pluginField.default.length < pluginField.min || pluginField.max && pluginField.default.length > pluginField.max) {
        //             return pluginField.id;
        //         }
        //
        //     } else if (pluginField instanceof IntegerField || pluginField instanceof FloatField) {
        //         if (!pluginField.default || pluginField.min && pluginField.default < pluginField.min || pluginField.max && pluginField.default > pluginField.max) {
        //             return pluginField.id;
        //         }
        //
        //     }
        //     if (pluginField.min && pluginField.max) {
        //         if (pluginField.min > pluginField.max) {
        //             return pluginField.id;
        //         }
        //     }
        // }
    }

    return (
        <React.Fragment>

            <Grid container className={classes.firstLine}>
                <Grid item xs={12} md={10}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={plugin.name}
                                onChange={handlePluginChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Version"
                                name="version"
                                value={plugin.version}
                                onChange={handlePluginChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Note"
                                name="note"
                                value={plugin.note}
                                onChange={handlePluginChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={plugin.description}
                                onChange={handlePluginChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FilesLoader multiple getFileId={getFileId}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container className={classes.firstLine}>
                <Grid item xs={12} md={10}>
                    <List component="nav" aria-label="secondary mailbox folders">
                        <ListItem className={classes.paddingNone}>
                            <ListItemText primary="Settings" primaryTypographyProps={{variant: "h6"}}/>
                            {/*<ListItemSecondaryAction>*/}
                            {/*    <IconButton*/}
                            {/*        edge="end"*/}
                            {/*        aria-label="delete"*/}
                            {/*        onClick={handleSetIsDialogPluginButtonActive}*/}
                            {/*    >*/}
                            {/*        <AddIcon/>*/}
                            {/*    </IconButton>*/}
                            {/*</ListItemSecondaryAction>*/}
                        </ListItem>
                        <Divider/>
                    </List>
                </Grid>
            </Grid>

            <Grid container className={classes.firstLine}>
                <Grid item xs={12} md={10}>
                    <PluginContext.Provider value={{
                        pluginFields: pluginFields,
                        errorIds: errorIds,
                        handleAddPluginField: handleAddPluginField,
                        handleDeletePluginField: handleDeletePluginField,
                        handleEditPluginField: handleEditPluginField,
                        idGenerator: getNextId,
                        moveField: moveField,
                        handleGetErrorIndexes: handleGetErrorIds,
                        handleDeleteErrorsIds: handleDeleteErrorsIds,
                    }}>
                        <PluginCreation
                            open={isDialogPluginButtonActive}
                            onClose={() => setIsDialogPluginButtonActive(false)}
                            onAddField={handleAddPluginField}
                            idGenerator={getNextId}
                            pluginFields={pluginFields}
                            move={move}
                        />
                    </PluginContext.Provider>
                </Grid>

                <Button fullWidth onClick={handleCreatePlugin}>
                    Save
                </Button>
            </Grid>
        </React.Fragment>
    );
});

export default withStyles(styles)(CreatePluginPageView);