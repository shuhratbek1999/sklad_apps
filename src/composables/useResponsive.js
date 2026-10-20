import { ref, onMounted, onUnmounted } from 'vue'

export function useResponsive() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)

  const updateDimensions = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
    
    isMobile.value = width.value < 640
    isTablet.value = width.value >= 640 && width.value < 1024
    isDesktop.value = width.value >= 1024
  }

  onMounted(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions)
  })

  // Breakpoint check functions
  const isBelow = (breakpoint) => {
    const breakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    }
    return width.value < breakpoints[breakpoint]
  }

  const isAbove = (breakpoint) => {
    const breakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    }
    return width.value >= breakpoints[breakpoint]
  }

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isBelow,
    isAbove
  }
}

// Mobile detection composable
export function useMobile() {
  const { isMobile } = useResponsive()
  return { isMobile }
}

// Tablet detection composable
export function useTablet() {
  const { isTablet } = useResponsive()
  return { isTablet }
}

// Desktop detection composable
export function useDesktop() {
  const { isDesktop } = useResponsive()
  return { isDesktop }
}