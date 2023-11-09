export interface Policy {
    principalId: string,
    policyDocument: {
        Version: string
        Statement: [
            {
                Action: string
                Effect: string
                Resource: string
            }
        ]
    }
}
