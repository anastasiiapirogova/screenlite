import {
    CreateBucketCommand,
    S3Client,
} from '@aws-sdk/client-s3'
import { NodeJsClient } from '@smithy/types'

export const s3Client = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT ? `${process.env.S3_ENDPOINT}:${process.env.S3_PORT}` : 'http://localhost:9000',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
    },
    forcePathStyle: true,
    requestHandler: {
        maxSockets: 500,
        keepAlive: true,
        keepAliveMsecs: 1000,
        requestTimeout: 5000
    }
}) as NodeJsClient<S3Client>

export const Buckets = {
    uploads: 'screenlite-uploads',
}

export const createBuckets = async () => {
    const bucketNames = [Buckets.uploads]

    for (const bucketName of bucketNames) {
        try {
            await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }))
            console.log(`Bucket ${bucketName} created successfully`)
        } catch (error) {
            if ((error as { name: string }).name !== 'BucketAlreadyOwnedByYou') {
                console.error(`Error creating bucket ${bucketName}:`, error)
                process.exit(1)
            }
        }
    }
}