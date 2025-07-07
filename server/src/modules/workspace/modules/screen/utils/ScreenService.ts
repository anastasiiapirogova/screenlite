import { Screen } from '@/generated/prisma/client.ts'

export class ScreenService {
    static getLayoutResolution(screen: Pick<Screen, 'layoutRotation' | 'resolutionWidth' | 'resolutionHeight'>) {
        const isRotated = screen.layoutRotation === 'R90' || screen.layoutRotation === 'R270'

        return {
            width: isRotated ? screen.resolutionHeight : screen.resolutionWidth,
            height: isRotated ? screen.resolutionWidth : screen.resolutionHeight,
        }
    }
}
