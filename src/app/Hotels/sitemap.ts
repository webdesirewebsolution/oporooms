import type { MetadataRoute } from 'next'
import { getHotels } from '@/server/db'
import { SearchParams } from 'next/dist/server/request/search-params'
import { ObjectId } from 'mongodb'
import { HotelTypes } from '@/Types/Hotels'

type Props = {
    searchParams: Promise<SearchParams>
}

export async function generateSitemaps({ searchParams }: Props) {
    const params = await searchParams
    const { count } = await getHotels({ searchParams: params }) as { count: number }
    // Fetch the total number of products and calculate the number of sitemaps needed
    return Array(count).map((_, i) => ({ id: i }))
}

export default async function sitemap({
    searchParams
}: {
    id: ObjectId,
    searchParams: SearchParams
}): Promise<MetadataRoute.Sitemap> {
    // Google's limit is 50,000 URLs per sitemap
    const { data } = await getHotels({ searchParams }) as { data: HotelTypes[] }

    return data.map((product) => ({
        url: `${process.env.BASE_URL}/product/${product._id}`,
        lastModified: new Date(),
    }))
}