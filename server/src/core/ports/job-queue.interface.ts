export interface IJobWorker<T extends { [K in keyof T]: { data: unknown } }> {
    register<J extends keyof T>(
        jobType: J,
        handler: (data: T[J]['data']) => Promise<void>,
    ): void
    shutdown(): Promise<void>
}
  
export interface IJobProducer<T extends { [K in keyof T]: { data: unknown } }> {
    enqueue<J extends keyof T>(
        jobType: J,
        payload: T[J]['data'],
    ): Promise<string>
    enqueueMany<J extends keyof T>(
        jobType: J,
        payload: T[J]['data'][],
    ): Promise<string[]>
    shutdown(): Promise<void>
}

export type JobRegistry = Record<string, { data: unknown }>