import { cn } from '@/lib/cn'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-[1280px]',
}

export function Container({ size = 'xl', className, children, ...rest }: ContainerProps) {
  return (
    <div className={cn('mx-auto px-6', sizeMap[size], className)} {...rest}>
      {children}
    </div>
  )
}
