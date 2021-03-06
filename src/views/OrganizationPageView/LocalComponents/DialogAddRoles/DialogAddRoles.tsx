/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-monitor
 * File last modified: 12.11.2020, 14:01
 * All rights reserved.
 */

import React, {Ref, useEffect, useRef, useState} from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    Divider,
    Grid,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Switch,
    useTheme,
    withStyles,
} from "@material-ui/core";
import Stylable from "../../../../interfaces/Stylable";
import styles from "./styles";
import TextField from "@material-ui/core/TextField";
import ColorPicker from "../../../../components/ColorPicker";
import Role from "../../../../interfaces/Role";
import RoleToggles from "../RoleToggles";
import useEnqueueErrorSnackbar from "../../../../utils/enqueueErrorSnackbar";
import DemoRole from "../../../../interfaces/DemoRole";
import IdGenerator from "../../../../utils/IdGenerator";

interface DialogAddRolesProps extends Stylable {
    open: boolean;
    role?: Role | DemoRole;
    modify?: boolean;
    isDefault?: boolean;

    onClose(): void;

    onExited?(): void;

    onAddRole(role: any, errors: any): void;

    onModifyRole?(roleId: number | undefined, roleToModify: any, isDefault: boolean): void;
}

interface ValidationErrors {
    "noInputError": boolean;
    "nameError": boolean;
    "descriptionError": boolean;
    "permissionLevelError": boolean;
}

const DialogAddRoles = React.forwardRef((props: DialogAddRolesProps, ref: Ref<any>) => {
    const {
        classes,
        style,
        className,
        modify,
        role,
        open,
        onClose,
        onAddRole,
        onModifyRole,
        isDefault,
        onExited,
    } = props;

    let counterId = 0;
    const idGenerator = React.useRef(IdGenerator());
    if (open) {
        const getNextId = (): number => idGenerator.current.next().value;
        counterId = getNextId();
    }

    const [willBeDefault, setWillBeDefault] = useState<boolean>(isDefault || false);


    const [invalidColor, setInvalidColor] = useState("");
    const enqueueErrorSnackbar = useEnqueueErrorSnackbar();
    const theme = useTheme();
    const [addRole, setAddRole] = useState<DemoRole | Role>({
        id: role?.id || counterId,
        name: role?.name || "",
        description: role?.description || "",
        color: role?.color || "FFF",
        permissionLevel: role?.permissionLevel || 1,
        canManageUsers: role?.canManageUsers || false,
        canCreateJobs: role?.canCreateJobs || false,
        canEditJobs: role?.canEditJobs || false,
        canDeleteJobs: role?.canDeleteJobs || false,
        canManageRoles: role?.canManageRoles || false,
        canManagePlugins: role?.canManagePlugins || false,
        canManageTeams: role?.canManageTeams || false,
        canEditAudit: role?.canEditAudit || false,
    });


    const [errors, setErrors] = useState<ValidationErrors>({
        noInputError: false,
        nameError: false,
        descriptionError: false,
        permissionLevelError: false,
    });

    useEffect(() => {
        role && setAddRole({
            id: role.id,
            name: role.name,
            description: role?.description,
            color: role.color,
            permissionLevel: role.permissionLevel,
            canManageUsers: role.canManageUsers,
            canCreateJobs: role.canCreateJobs,
            canEditJobs: role.canEditJobs,
            canDeleteJobs: role.canDeleteJobs,
            canManageRoles: role.canManageRoles,
            canManagePlugins: role.canManagePlugins,
            canManageTeams: role.canManageTeams,
            canEditAudit: role.canEditAudit,
        });
    }, [role]);

    // console.log("defaultRoleId", defaultIdLocal);

    const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddRole((prev) => (
            {...prev, [event.target.name]: event.target.checked}
        ));
    };

    const handleInputRole = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        if (name === "permissionLevel") {
            setAddRole(prev => (prev && {...prev, [name]: +event.target.value}));
            return;
        }
        setAddRole(prev => (prev && {...prev, [name]: event.target.value}));
    };

    function handleGetColor(inputColor: string) {
        setAddRole((prev) => (prev && {...prev, color: inputColor}));
    }

    function handleGetInvalidColor(inputColor: string) {
        console.log("###########", inputColor);
        setInvalidColor(inputColor);
    }

    console.log("Invalid", invalidColor);

    const handleValidation = (event: React.FocusEvent<HTMLInputElement>) => {
        setErrors(prev => ({
            ...prev, "noInputError": false
        }));
        if (event.target.name === "name") {
            //TODO every language exept special symbols
            if (addRole.name.match(/[^A-Za-z0-9_ ]/) || !addRole.name || addRole.name.length < 3 || addRole.name.length > 50) {
                setErrors(prev => ({
                    ...prev, "nameError": true
                }));

            } else {
                setErrors(prev => ({
                    ...prev, "nameError": false
                }));
            }
        }
        if (event.target.name === "description") {
            if (!addRole.description || addRole.name.length > 500) {
                setErrors(prev => ({
                    ...prev, "descriptionError": true
                }));
            } else {
                setErrors(prev => ({
                    ...prev, "descriptionError": false
                }));
            }
        }
        if (event.target.name === "permissionLevel") {
            if (!addRole.permissionLevel || addRole.permissionLevel < 0 || addRole.permissionLevel > 1000) {
                setErrors(prev => ({
                    ...prev, "permissionLevelError": true
                }));
            } else {
                setErrors(prev => ({
                    ...prev, "permissionLevelError": false
                }));
            }
        }
    };

    function handleClick() {
        if (!errors.noInputError && !errors.nameError && !errors.descriptionError && !errors.permissionLevelError && invalidColor !== "f44336") {
            modify ? onModifyRole && onModifyRole(role?.id, addRole, willBeDefault) : onAddRole(addRole, errors);
            handleOnClose();
        } else {
            enqueueErrorSnackbar("Invalid input");
        }
    }

    function handleOnClose() {
        onClose();
        setErrors({
            "noInputError": false,
            "nameError": false,
            "descriptionError": false,
            "permissionLevelError": false,
        });
        setWillBeDefault(false);
    }

    return (
        <Dialog
            open={open}
            onClose={handleOnClose}
            onExited={() => {
                onExited && onExited();
                setAddRole({
                    id: counterId,
                    name: "",
                    description: "",
                    color: "fff",
                    permissionLevel: 1,
                    canManageUsers: false,
                    canCreateJobs: false,
                    canEditJobs: false,
                    canDeleteJobs: false,
                    canManageRoles: false,
                    canManagePlugins: false,
                    canManageTeams: false,
                    canEditAudit: false,
                });
            }}
        >
            <DialogTitle
                className={classes.dialogRoles}
                style={{background: `#${invalidColor !== "f44336" ? (addRole.color || "FFF") : invalidColor}`,
                    color: theme.palette.getContrastText(`#${invalidColor !== "f44336" ? (addRole.color || "FFF") : invalidColor}`)}}
            >
                {modify ? "Modify role" : "Add new role"}
            </DialogTitle>
            <Divider/>
            <ListItem className={classes.newRole}>
                <Grid container>
                    <Grid item xs={12} className={classes.gridPadding}>
                        <TextField
                            error={errors.nameError}
                            variant="standard"
                            required
                            fullWidth
                            name="name"
                            label="Name"
                            value={addRole?.name}
                            onChange={handleInputRole("name")}
                            onBlur={handleValidation}
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.gridPadding}>
                        <TextField
                            error={errors.descriptionError}
                            variant="standard"
                            fullWidth
                            multiline
                            rowsMax={5}
                            name="description"
                            label="Description"
                            value={addRole?.description}
                            onChange={handleInputRole("description")}
                            onBlur={handleValidation}
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.gridPadding}>
                        <TextField
                            error={errors.permissionLevelError}
                            type="number"
                            variant="standard"
                            required
                            fullWidth
                            name="permissionLevel"
                            label="Permission Level"
                            value={addRole?.permissionLevel}
                            onChange={handleInputRole("permissionLevel")}
                            onBlur={handleValidation}
                        />
                    </Grid>
                    {modify &&
                    <Button
                        fullWidth
                        onClick={() => {
                            setWillBeDefault(true);
                        }}
                        className={classes.makeDefaultButton}
                        disabled={isDefault || willBeDefault}
                        classes={{disabled: classes.disabledButton}}
                    >
                        Mark as default
                    </Button>
                    }
                    <Grid item xs={12} className={classes.gridPadding}>
                        <ColorPicker
                            onChange={handleGetColor}
                            color={addRole.color}
                            handleGetInvalidColor={handleGetInvalidColor}
                        />
                    </Grid>
                    <Grid container className={classes.firstLine}>
                        <RoleToggles addRole={addRole} handleSwitch={handleSwitch}/>
                    </Grid>
                    <Button
                        fullWidth
                        onClick={handleClick}
                    >
                        Accept
                    </Button>
                </Grid>
            </ListItem>
        </Dialog>
    );
});

export default withStyles(styles)(DialogAddRoles);