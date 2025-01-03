'use client'

import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid'
import { TypeSafeColDef } from '@/Types/DataGridTypes'
import { Context } from '@/Context/context'
import {  Paper } from '@mui/material'
import Modal from '@/Components/Modal'
import { CategoriesAction, CategoriesTypes } from '@/Types/Categories'
import AddCategory from '../Components/AddCategory'
import { AddressTypes } from '@/Types/Hotels'
import Button from '@/Components/Buttons'

const Categories = () => {
    const { user } = useContext(Context)
    const [data, setData] = useState<CategoriesTypes[]>([])
    const [count, setCount] = useState(0)
    const [filter, setFilter] = useState({
        page: 0,
        pageSize: 10
    })
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            if (user?.userRole !== '') {
                await axios.get(`/api/category?page=${filter.page * 10}&pageSize=${filter?.pageSize}`).then(r => {
                    if (r.status == 200) {
                        setData(r.data?.list)
                        setCount(r.data?.count)
                    }
                }).finally(() => setLoading(false))
            }
        })()
    }, [filter, user])


    const columns: TypeSafeColDef<CategoriesAction>[] = [
        { id: 0, field: '_id', headerName: 'Id' },
        { id: 1, field: 'category', headerName: 'Category' },
        { id: 3, field: 'location', headerName: 'Location', renderCell: (params) => <Address params={params} /> },
        { id: 10, field: 'subCategories', headerName: 'Sub Categories', renderCell: (params) => (<></>) },
        { id: 10, field: 'actions', headerName: 'Action', width: 250, renderCell: (params) => <Action params={params} setData={setData} /> },
    ]

    columns.forEach((item) => {
        item.align = 'center';
        item.headerAlign = 'center'
    })

    return (
        <div className='flex flex-col gap-10'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-semibold'>Categories</h1>
                {(user?.userRole == 'SADMIN') &&
                    <Button onClick={() => setShowForm(true)} className='bg-red-500 text-white'>
                        Add Category
                    </Button>
                }
            </div>

            <Paper>
                <DataGrid
                    sx={{
                        minHeight: 200,
                        height: '100%'
                    }}
                    columns={columns}
                    rows={data}
                    loading={loading}
                    getRowId={row => row?._id}
                    isRowSelectable={() => false}
                    pagination
                    rowCount={count}
                    sortingMode='client'
                    filterMode='client'
                    paginationMode="server"
                    paginationModel={{
                        page: Number(filter.page),
                        pageSize: Number(filter.pageSize)
                    }}
                    onPaginationModelChange={setFilter}
                />
            </Paper>

            <Modal open={showForm} setOpen={setShowForm} className='overflow-y-scroll w-[50rem] max-w-full'>
                <AddCategory setShowModal={setShowForm} />
            </Modal>
        </div>
    )
}

const Address = ({ params }: { params: GridRenderCellParams }) => {
    const [showAddr, setShowAddr] = useState(false)

    return (
        <>
            <Button onClick={() => setShowAddr(true)} className='bg-red-400 text-white'>View Address</Button>

            <Modal open={showAddr} setOpen={() => setShowAddr(false)}>
                <div className='flex flex-col gap-5 border shadow p-10 rounded-lg'>
                    {Object.entries(params?.row?.location as AddressTypes)?.map((item, i) => (
                        <div key={i} className='flex gap-20 justify-between items-center'>
                            <div className='capitalize'>{item?.[0]}:</div>
                            <div>{item?.[1]}</div>
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    )
}

const Action = ({ params, setData }: { params: GridRenderCellParams, setData: React.Dispatch<React.SetStateAction<CategoriesTypes[]>> }) => {
    const { user } = useContext(Context)
    const [showEdit, setShowEdit] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const handleDelete = async () => {
        await axios.delete(`/api/category?_id=${params?.row?._id}`).then((r) => {
            if (r.status == 200) {
                setData(prev => prev?.filter(i => i?._id !== params?.row?._id))
                setShowModal(false)
            }
        })
    }
    return (
        <div className='flex h-full items-center justify-center gap-5'>
            <Button onClick={() => setShowEdit(true)} className='bg-blue-400 text-white'>
                Edit Category
            </Button>
            {user.userRole == 'SADMIN' && <Button onClick={() => setShowModal(true)} className='bg-red-400 text-white h-fit'>Delete Category</Button>}

            <Modal open={showModal} setOpen={() => setShowModal(false)}>
                <div className='flex flex-col gap-5 text-center'>
                    <p className='text-3xl'>Are you sure?</p>
                    <div className='flex gap-10'>
                        <Button className='bg-slate-600 text-white' size='large' onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button className='bg-red-600 text-white' size='large' onClick={handleDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>

            <Modal open={showEdit} setOpen={setShowEdit}>
                <AddCategory data={params?.row} setShowModal={setShowEdit} isEdit={true} />
            </Modal>
        </div>
    )
}

export default Categories