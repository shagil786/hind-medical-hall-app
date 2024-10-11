import React, { MutableRefObject } from "react";

export interface postsProps {
    user_image: any;
    name: string;
    created_at: string;
    post: string;
    emoji: any;
    comments: number;
    isEdited: boolean;
}

export interface HomeSectionProps {
    loading: boolean;
    commonClass: string;
    postData: Array<postsProps>;
    changeShowLogin: () => void;
}

export interface ProviderContextProps {
    postData: postsProps | undefined;
    showLogin: boolean;
    changeShowLogin: () => void;
    loading: boolean;
    ref: MutableRefObject<any>;
    close: () => void;
}

export interface inputType {
    name: string,
    label: string,
    value: string,
    type: string
}

export interface itemsProps {
    header: string,
    subHeader: string,
    inputHandler: Array<inputType>,
    others: any,
    redirect: string,
    redirectTo: string,
    button: string;
}

export interface formDataProps { [key: string]: any }

export interface ModelContextProps {
    onChangeType: () => void;
    item: itemsProps;
    onShowPassword: () => void;
    showPassword: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    addFormData: () => void;
    value: formDataProps;
}

export interface modelProps {
    ref: MutableRefObject<any>;
    close: () => void;
}