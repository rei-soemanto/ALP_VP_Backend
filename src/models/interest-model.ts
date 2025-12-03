export interface CreateInterestRequest {
    name: string
}

export interface InterestResponse {
    id: number
    name: string
}

// Request to link user to interests
export interface AddUserInterestRequest {
    interestId: number
    isPrimary?: boolean
}

export function toInterestResponse(interest: any): InterestResponse {
    return {
        id: interest.id,
        name: interest.name
    }
}