'use client'

import useWindowDimensions from '@/Hooks/useWindow'
import React, { useState } from 'react'
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import { IoMdMenu } from 'react-icons/io'
import { signOut } from '@/auth'
import { User } from '../../../Types/Profile'
import { MdBedroomParent, MdCategory, MdHome, MdPrivacyTip } from "react-icons/md";
import { FaHotel, FaRegEnvelopeOpen } from "react-icons/fa6";
import { GrCurrency } from "react-icons/gr";
import { FaUsers } from "react-icons/fa";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RiPagesLine } from "react-icons/ri";
import { MdOutlineBookmark } from "react-icons/md";

type Props = {
    user: User
}

const Menu = ({ user }: Props) => {
    const pathname = usePathname()
    const { width } = useWindowDimensions()
    const [open, setOpen] = useState(false)
    const drawerWidth = 260

    const userRoles = ['SADMIN', 'CADMIN', 'HR', 'HotelOwner']

    const menuItems = [
        {
            title: 'Home',
            link: '/Admin/Home',
            as: '/Admin/Home',
            type: 'link',
            userRoles,
            icon: MdHome,
        },
        {
            title: 'Bookings',
            link: '/Admin',
            as: '/Admin',
            type: 'link',
            userRoles,
            icon: MdOutlineBookmark,
        },
        {
            title: 'Users',
            link: '/Admin/Users',
            as: '/Admin/Users',
            type: 'link',
            userRoles: ['SADMIN', 'CADMIN', 'HR'],
            icon: FaUsers,
        },
        {
            title: 'Hotels',
            link: '/Admin/Hotels',
            as: '/Admin/Hotels',
            type: 'link',
            userRoles: ['SADMIN', 'HotelOwner'],
            icon: FaHotel,
        },
        {
            title: 'Rooms',
            link: '/Admin/Rooms',
            as: '/Admin/Rooms',
            type: 'link',
            userRoles: ['SADMIN', 'HotelOwner'],
            icon: MdBedroomParent,
        },
        {
            title: 'Transactions',
            link: '/Admin/Transactions',
            as: '/Admin/Transactions',
            type: 'link',
            userRoles,
            icon: GrCurrency
        },
        {
            title: 'Categories',
            link: '/Admin/Categories',
            as: '/Admin/Categories',
            type: 'link',
            userRoles: ['SADMIN'],
            icon: MdCategory
        },
        {
            title: 'Enquiries',
            link: '/Admin/Enquiry',
            as: '/Admin/Enquiry',
            type: 'link',
            userRoles: ['SADMIN'],
            icon: FaRegEnvelopeOpen
        },
        {
            title: 'Privacy Policy',
            link: '/Admin/PrivacyPolicy',
            as: '/Admin/PrivacyPolicy',
            type: 'link',
            userRoles: ['SADMIN'],
            icon: MdPrivacyTip
        },
        {
            title: 'Terms & Conditions',
            link: '/Admin/TermsConditions',
            as: '/Admin/TermsConditions',
            type: 'link',
            userRoles: ['SADMIN'],
            icon: RiPagesLine
        },
    ]

    const DrawerList = (
        <Box role="presentation" onClick={() => setOpen(false)}>
            <List>
                {menuItems?.filter(i => i.userRoles?.includes(user?.userRole)).map((item) => (
                    <ListItem key={item.title} disablePadding>
                        {item.type == 'link' ?
                            <Link href={item?.link} className={`w-full ${pathname == item.as ? 'bg-red-400 text-white' : 'bg-white'}`}>
                                <ListItemButton className='text-xl py-5 flex items-center gap-5'>
                                    {item?.icon && <item.icon size={18} />}
                                    {item.title}
                                </ListItemButton>
                            </Link>
                            :
                            <ListItemButton className='text-xl py-5'>
                                <ListItemIcon>
                                </ListItemIcon>
                                {item.title}
                            </ListItemButton>}
                    </ListItem>
                ))}
            </List>
            {width < 650 &&
                <>
                    <Divider />
                    <List>
                        <ListItem>
                            <ListItemButton className='bg-red-500 text-xl text-white py-5 rounded-md' onClick={() => signOut({
                                redirect: true,
                            })}>
                                Sign Out
                            </ListItemButton>
                        </ListItem>
                    </List>
                </>
            }
        </Box>
    );

    return (
        <>
            {width < 650 &&
                <IconButton onClick={() => setOpen(true)}>
                    <IoMdMenu size={20} />
                </IconButton>}

            <div className='absolute'>
                <Drawer open={open} sx={width > 650 ? {
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        height: '89vh',
                        marginTop: 9,
                        borderWidth: 1,
                        marginLeft: 1,
                        boxShadow: '.1rem .1rem 1rem #ccc',
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                } : {
                    '& .MuiDrawer-paper': {
                        width: drawerWidth
                    }
                }} onClose={() => setOpen(false)} variant={width <= 650 ? 'temporary' : 'permanent'}
                    anchor="left">
                    {DrawerList}
                </Drawer>
            </div>
        </>
    )
}

export default Menu