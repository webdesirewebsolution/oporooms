import React from 'react'
import PolicyEditor from '../Components/PolicyEditor'
import axios from 'axios'

const PrivacyPolicy = async () => {
    const data = await (await axios.get(`${process.env.SERVERURL}/api/Policy?contentType=PrivacyPolicy`)).data

    return (
        <div className='flex flex-col gap-10'>
            <PolicyEditor type='PrivacyPolicy' data={data?.content} />
            {data?.content && <div dangerouslySetInnerHTML={{ __html: data?.content }} />}
        </div>
    )
}

export default PrivacyPolicy