export class WorkspaceMember {
    constructor(
        public readonly id: string,
        public readonly workspaceId: string,
        public readonly userId: string,
    ) {}
}