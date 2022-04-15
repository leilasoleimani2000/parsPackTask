export interface IUsers {
    id: number,
    name: string,
    phone: string,
    username: string,
    website: string,
    email: string,
    company: ICompany,
    address: IAddress
}

export interface ICompany {
    bs: string,
    catchPhrase: string,
    name: string
}

export interface IAddress {
    city: string,
    geo: IGeo,
    street: string,
    suite: string,
    zipcode: string
}

export interface IGeo {
    lat: string,
    lng: string
}