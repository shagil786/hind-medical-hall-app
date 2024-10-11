"use client"
import React from 'react'

const ProfileController = (props: any) => {
    const { children, ...rest } = props;

    const viewProps = {

    }

    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { ...rest, ...viewProps });
        }
        return child;
    });

    return <>{childrenWithProps}</>;
};

export { ProfileController }; 