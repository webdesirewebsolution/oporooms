'use client'

import { User } from '@/Types/Profile'
import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import { MdEdit } from 'react-icons/md'
import Modal from '../Modal'
import AddUser from '../AddUser'

type Props = {
    user: User
}

const EditProfile = ({ user }: Props) => {
    const [modal, setModal] = useState(false)
    return (
        <div>
            <IconButton onClick={() => setModal(true)}>
                <MdEdit size={20}/>
            </IconButton>

            <Modal open={modal} setOpen={setModal}>
                <AddUser userData={user} setShowModal={(e) => {
                    setModal(e)
                }} isEdit={true}/>
            </Modal>
        </div>
    )
}

export default EditProfile