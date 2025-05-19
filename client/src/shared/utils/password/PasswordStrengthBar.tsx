type Props = {
	strength: number
}

const defaultLevelColors: { [key: number]: string } = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-400',
    4: 'bg-yellow-400',
    5: 'bg-green-500',
}

const LevelBar = ({
    levels = 3,
    level = 1,
    className,
    ...rest
}: {
	level: number
	levels?: number
	levelColors?: { [key: number]: string }
  } & React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={ [
                'relative flex gap-2 overflow-hidden rounded-full',
                className,
            ].join(' ') }
            { ...rest }
        >
            { Array.from({ length: levels }, (_, i) => i).map((currentLevel) => (
                <LevelBarItem
                    key={ currentLevel }
                    level={ level }
                    levels={ levels }
                    bgColor={ currentLevel <= level ? defaultLevelColors[level] : undefined }
                />
            )) }
        </div>
    )
}
   
const LevelBarItem = ({
    levels,
    level,
    bgColor = 'bg-neutral-100',
    ...rest
}: {
	level: number
	levels: number
	bgColor?: string
  } & React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={ 'h-1 w-full rounded-full bg-neutral-100' }
            style={ {
		 	 clipPath: 'inset(0 round 99px)',
            } }
            { ...rest }
        >
            <div
                className={ `absolute left-0 top-0 h-full w-0 rounded-full duration-500 ease-out ${bgColor} z-10` }
                style={ {
                    transitionProperty: 'width',
                    width: `calc((100% / ${levels}) * ${level})`,
                } }
            />
        </div>
    )
}

export const PasswordStrengthBar = ({ strength }: Props) => {
    return (
        <div className="mt-4">
            <LevelBar
                levels={ 5 }
                level={ strength }
            />
        </div>
    )
}