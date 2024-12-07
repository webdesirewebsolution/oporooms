export interface LocationTypes {
    placeId: string,
    lat: number,
    lng: number,
    city: string
}

export interface SubCategoryTypes {
    id: number,
    title: string,
    location: LocationTypes
}

export interface CategoriesTypes {
    _id?: string,
    category: string,
    location: LocationTypes,
    subCategories: SubCategoryTypes[]
}

export interface CategoriesAction extends CategoriesTypes {
    actions: string,
}