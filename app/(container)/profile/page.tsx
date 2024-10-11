import React from 'react'
import { ProfileController } from '@/modules/ui/profile/controller/ProfileController'
import ProfileViews from '@/modules/ui/profile/view/ProfileViews'

const ProfilePage = () => {
    return (
        <ProfileController>
            <ProfileViews />
        </ProfileController>
    )
}

export default ProfilePage;