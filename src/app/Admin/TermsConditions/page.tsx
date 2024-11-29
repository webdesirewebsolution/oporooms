import React from 'react'
import PolicyEditor from '../Components/PolicyEditor'
import axios from 'axios'

const TermsConditions = async () => {
    const data = await (await axios.get(`${process.env.SERVERURL}/api/Policy?contentType=TermsConditions`)).data

    return (
        <div className='flex flex-col gap-10'>
            <PolicyEditor type='TermsConditions' data={data?.content}/>

            {data?.content && <div dangerouslySetInnerHTML={{ __html: data?.content }} />}
        </div>
    )
}

export default TermsConditions