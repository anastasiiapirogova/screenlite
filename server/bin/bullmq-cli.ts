#!/usr/bin/env tsx
import { listJobs } from '../src/cli/listJobs.js'
import { getAllQueueNames } from '../src/cli/utils.js'
import { Command } from 'commander'

const program = new Command()

program
    .command('list')
    .requiredOption('-q, --queue <name>', 'Queue name or "all"')
    .option('-s, --status <status>', 'Job status', 'waiting')
    .action(async (opts) => {
        const { queue, status } = opts

        const queueNames = queue === 'all'
            ? await getAllQueueNames()
            : [queue]

        for (const name of queueNames) {
            const jobs = await listJobs(name, status)
            
            console.log(`\n📂 Queue: ${name} (${jobs.length} jobs)`)
            
            for (const job of jobs) {
                const baseInfo = `  • ID: ${job.id}, Name: ${job.name}`
            
                if (status === 'failed') {
                    const failedAt = job.finishedOn
                        ? new Date(job.finishedOn).toISOString()
                        : 'N/A'
                  
                    const attempts = job.attemptsMade ?? 0

                    console.log(`${baseInfo}, Failed At: ${failedAt}, Retries: ${attempts}`)
                } else {
                    console.log(baseInfo)
                }
            }
        }
    })

program.parse()
