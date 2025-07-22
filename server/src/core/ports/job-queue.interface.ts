export type JobRegistry = {
    [jobType: string]: {
        data: unknown
    }
}
  
export interface IJobWorker<T extends JobRegistry = JobRegistry> {
    register<J extends keyof T>(
        jobType: J,
        handler: (data: T[J]['data']) => Promise<void>
    ): void
    shutdown(): Promise<void>
}
  
export interface IJobProducer<T extends JobRegistry = JobRegistry> {
    enqueue<J extends keyof T>(
        jobType: J,
        payload: T[J]['data'],
    ): Promise<string>
    shutdown(): Promise<void>
}